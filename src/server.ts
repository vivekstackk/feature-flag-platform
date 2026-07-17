import Fastify from 'fastify';
import { Pool } from 'pg';
import Redis from 'ioredis';
import { PgFlagStore } from './pgFlagStore';
import { CachedFlagStore, FLAG_CHANGE_CHANNEL } from './cachedFlagStore';
import { CreateFlagInput, UserContext, TargetingRule, RolloutConfig, Flag, CreateSegmentInput } from './types';
import { evaluateFlag } from './evaluation';
import { SegmentStore } from './segmentStore';
import { ExperimentStore } from './experimentStore';
import { config } from './config';
type FlagPatchBody = Partial<Pick<Flag, 'description' | 'enabled' | 'defaultValue'>>;

export function buildServer(pool?: Pool, redisClient?: Redis) {
  const app = Fastify({ logger: !config.isTest });

  const dbPool =
    pool ??
    new Pool({
      connectionString: config.databaseUrl,
    });

  const redis = redisClient ?? new Redis(config.redisUrl);

  const store = new CachedFlagStore(new PgFlagStore(dbPool), redis);
  const segmentStore = new SegmentStore(dbPool);
  const experimentStore = new ExperimentStore(dbPool);

  if (!redisClient) {
    app.addHook('onClose', async () => {
      await redis.quit();
    });
  }

  app.post<{ Body: CreateFlagInput }>('/flags', async (request, reply) => {
    try {
      const flag = await store.create(request.body);
      reply.code(201).send(flag);
    } catch (err) {
      reply.code(409).send({ error: (err as Error).message });
    }
  });

  app.get('/flags', async () => {
    return store.getAll();
  });

  app.get<{ Params: { id: string } }>('/flags/:id', async (request, reply) => {
    const flag = await store.getById(request.params.id);

    if (!flag) {
      return reply.code(404).send({ error: 'Flag not found' });
    }

    return flag;
  });

  app.patch<{ Params: { id: string }; Body: FlagPatchBody }>('/flags/:id', async (request, reply) => {
    try {
      const flag = await store.update(request.params.id, request.body);
      return flag;
    } catch (err) {
      reply.code(404).send({ error: (err as Error).message });
    }
  });

  app.delete<{ Params: { id: string } }>('/flags/:id', async (request, reply) => {
    const deleted = await store.delete(request.params.id);

    if (!deleted) {
      return reply.code(404).send({ error: 'Flag not found' });
    }

    reply.code(204).send();
  });

  app.post<{ Params: { key: string }; Body: UserContext }>(
    '/evaluate/:key',
    async (request, reply) => {
      const flag = await store.getByKey(request.params.key);

      if (!flag) {
        return reply.code(404).send({ error: 'Flag not found' });
      }

      const allSegments = await segmentStore.getAll();
      const segmentMap = new Map(allSegments.map((s) => [s.name, s]));

      const value = evaluateFlag(flag, request.body, segmentMap);

      await experimentStore.logExposure({
        flagKey: flag.key,
        userId: request.body.userId,
        value,
      });

      return {
        key: flag.key,
        value,
      };
    }
  );

  app.put<{ Params: { id: string }; Body: { rules: TargetingRule[] } }>(
    '/flags/:id/rules',
    async (request, reply) => {
      try {
        const flag = await store.setRules(request.params.id, request.body.rules);
        return flag;
      } catch (err) {
        reply.code(404).send({ error: (err as Error).message });
      }
    }
  );

  app.put<{ Params: { id: string }; Body: { rollout: RolloutConfig | null } }>(
    '/flags/:id/rollout',
    async (request, reply) => {
      try {
        const flag = await store.setRollout(request.params.id, request.body.rollout);
        return flag;
      } catch (err) {
        reply.code(404).send({ error: (err as Error).message });
      }
    }
  );

  app.post<{ Body: CreateSegmentInput }>('/segments', async (request, reply) => {
    try {
      const segment = await segmentStore.create(request.body);
      reply.code(201).send(segment);
    } catch (err) {
      reply.code(409).send({ error: (err as Error).message });
    }
  });

  app.get('/segments', async () => {
    return segmentStore.getAll();
  });

  app.delete<{ Params: { id: string } }>('/segments/:id', async (request, reply) => {
    const deleted = await segmentStore.delete(request.params.id);
    if (!deleted) {
      return reply.code(404).send({ error: 'Segment not found' });
    }
    reply.code(204).send();
  });

  app.post<{ Body: { userId: string; eventName: string } }>('/outcomes', async (request, reply) => {
    await experimentStore.logOutcome(request.body);
    reply.code(201).send({ status: 'logged' });
  });

  app.get<{ Params: { key: string }; Querystring: { event: string } }>(
    '/experiments/:key/stats',
    async (request, reply) => {
      if (!request.query.event) {
        return reply.code(400).send({ error: 'Query parameter "event" is required' });
      }
      return experimentStore.getStats(request.params.key, request.query.event);
    }
  );

  app.get('/stream', async (request, reply) => {
    reply.hijack();

    const subscriber = redis.duplicate();

    reply.raw.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
    reply.raw.write(': connected\n\n');

    await subscriber.subscribe(FLAG_CHANGE_CHANNEL);

    subscriber.on('message', (_channel, message) => {
      reply.raw.write(`data: ${message}\n\n`);
    });

    request.raw.on('close', () => {
      subscriber.unsubscribe();
      subscriber.quit();
    });
  });

  return app;
}