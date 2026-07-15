import Fastify from 'fastify';
import { FlagStore } from './store';
import { CreateFlagInput } from './types';

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

  return app;
}