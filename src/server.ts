import Fastify from 'fastify';
import { Pool } from 'pg';
import Redis from 'ioredis';
import { PgFlagStore } from './pgFlagStore';
import { CachedFlagStore, FLAG_CHANGE_CHANNEL } from './cachedFlagStore';
import { CreateFlagInput, UserContext, TargetingRule, RolloutConfig } from './types';
import { evaluateFlag } from './evaluation';

export function buildServer(pool?: Pool, redisClient?: Redis) {
  const app = Fastify({ logger: process.env.NODE_ENV !== 'test' });

  const dbPool =
    pool ??
    new Pool({
      connectionString:
        process.env.DATABASE_URL ?? 'postgresql://ffp:ffp_dev_password@localhost:5432/feature_flags',
    });
  const redis = redisClient ?? new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379');
  const store = new CachedFlagStore(new PgFlagStore(dbPool), redis);

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

  app.patch<{ Params: { id: string }; Body: Partial<Pick<import('./types').Flag, 'description' | 'enabled' | 'defaultValue'>> }>(
    '/flags/:id',
    async (request, reply) => {
      try {
        const flag = await store.update(request.params.id, request.body);
        return flag;
      } catch (err) {
        reply.code(404).send({ error: (err as Error).message });
      }
    }
  );

  app.delete<{ Params: { id: string } }>('/flags/:id', async (request, reply) => {
    const deleted = await store.delete(request.params.id);
    if (!deleted) {
      return reply.code(404).send({ error: 'Flag not found' });
    }
    reply.code(204).send();
  });

  app.post<{ Params: { key: string }; Body: UserContext }>('/evaluate/:key', async (request, reply) => {
    const flag = await store.getByKey(request.params.key);
    if (!flag) {
      return reply.code(404).send({ error: 'Flag not found' });
    }

    const value = evaluateFlag(flag, request.body);
    return { key: flag.key, value };
  });

  app.put<{ Params: { id: string }; Body: { rules: TargetingRule[] } }>('/flags/:id/rules', async (request, reply) => {
    try {
      const flag = await store.setRules(request.params.id, request.body.rules);
      return flag;
    } catch (err) {
      reply.code(404).send({ error: (err as Error).message });
    }
  });

  app.put<{ Params: { id: string }; Body: { rollout: RolloutConfig | null } }>('/flags/:id/rollout', async (request, reply) => {
    try {
      const flag = await store.setRollout(request.params.id, request.body.rollout);
      return flag;
    } catch (err) {
      reply.code(404).send({ error: (err as Error).message });
    }
  });

  app.get('/stream', (request, reply) => {
    reply.raw.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    const subscriber = redis.duplicate();
    subscriber.subscribe(FLAG_CHANGE_CHANNEL);

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