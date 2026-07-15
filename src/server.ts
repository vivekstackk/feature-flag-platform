import Fastify from 'fastify';
import { FlagStore } from './store';
import { CreateFlagInput, UserContext, TargetingRule, RolloutConfig } from './types';
import { evaluateFlag } from './evaluation';

export function buildServer() {
  const app = Fastify({ logger: process.env.NODE_ENV !== 'test' });
  const store = new FlagStore();

  app.post<{ Body: CreateFlagInput }>('/flags', async (request, reply) => {
    try {
      const flag = store.create(request.body);
      reply.code(201).send(flag);
    } catch (err) {
      reply.code(409).send({ error: (err as Error).message });
    }
  });

  app.get('/flags', async () => {
    return store.getAll();
  });

  app.get<{ Params: { id: string } }>('/flags/:id', async (request, reply) => {
    const flag = store.getById(request.params.id);
    if (!flag) {
      return reply.code(404).send({ error: 'Flag not found' });
    }
    return flag;
  });

  app.patch<{ Params: { id: string }; Body: Partial<Pick<import('./types').Flag, 'description' | 'enabled' | 'defaultValue'>> }>(
    '/flags/:id',
    async (request, reply) => {
      try {
        const flag = store.update(request.params.id, request.body);
        return flag;
      } catch (err) {
        reply.code(404).send({ error: (err as Error).message });
      }
    }
  );

  app.delete<{ Params: { id: string } }>('/flags/:id', async (request, reply) => {
    const deleted = store.delete(request.params.id);
    if (!deleted) {
      return reply.code(404).send({ error: 'Flag not found' });
    }
    reply.code(204).send();
  });

  app.post<{ Params: { key: string }; Body: UserContext }>('/evaluate/:key', async (request, reply) => {
    const flag = store.getByKey(request.params.key);
    if (!flag) {
      return reply.code(404).send({ error: 'Flag not found' });
    }

    const value = evaluateFlag(flag, request.body);
    return { key: flag.key, value };
  });

  app.put<{ Params: { id: string }; Body: { rules: TargetingRule[] } }>('/flags/:id/rules', async (request, reply) => {
    try {
      const flag = store.setRules(request.params.id, request.body.rules);
      return flag;
    } catch (err) {
      reply.code(404).send({ error: (err as Error).message });
    }
  });

  app.put<{ Params: { id: string }; Body: { rollout: RolloutConfig | null } }>('/flags/:id/rollout', async (request, reply) => {
    try {
      const flag = store.setRollout(request.params.id, request.body.rollout);
      return flag;
    } catch (err) {
      reply.code(404).send({ error: (err as Error).message });
    }
  });

  return app;
}