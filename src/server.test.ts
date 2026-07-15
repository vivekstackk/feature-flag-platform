import { buildServer } from './server';
import { FastifyInstance } from 'fastify';

describe('Flag API', () => {
  let app: FastifyInstance;

  beforeEach(() => {
    app = buildServer();
  });

  afterEach(async () => {
    await app.close();
  });

  it('creates a flag via POST /flags', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/flags',
      payload: { key: 'checkout-v2', description: 'test' },
    });

    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body);
    expect(body.key).toBe('checkout-v2');
    expect(body.enabled).toBe(false);
  });

  it('rejects duplicate keys with 409', async () => {
    await app.inject({ method: 'POST', url: '/flags', payload: { key: 'dup' } });
    const response = await app.inject({ method: 'POST', url: '/flags', payload: { key: 'dup' } });

    expect(response.statusCode).toBe(409);
  });

  it('lists all flags via GET /flags', async () => {
    await app.inject({ method: 'POST', url: '/flags', payload: { key: 'a' } });
    await app.inject({ method: 'POST', url: '/flags', payload: { key: 'b' } });

    const response = await app.inject({ method: 'GET', url: '/flags' });
    const body = JSON.parse(response.body);

    expect(body).toHaveLength(2);
  });

  it('returns 404 for a non-existent flag', async () => {
    const response = await app.inject({ method: 'GET', url: '/flags/fake-id' });
    expect(response.statusCode).toBe(404);
  });

  it('updates a flag via PATCH', async () => {
    const created = await app.inject({ method: 'POST', url: '/flags', payload: { key: 'toggle' } });
    const { id } = JSON.parse(created.body);

    const response = await app.inject({
      method: 'PATCH',
      url: `/flags/${id}`,
      payload: { enabled: true },
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).enabled).toBe(true);
  });

  it('deletes a flag via DELETE', async () => {
    const created = await app.inject({ method: 'POST', url: '/flags', payload: { key: 'temp' } });
    const { id } = JSON.parse(created.body);

    const response = await app.inject({ method: 'DELETE', url: `/flags/${id}` });
    expect(response.statusCode).toBe(204);

    const getResponse = await app.inject({ method: 'GET', url: `/flags/${id}` });
    expect(getResponse.statusCode).toBe(404);
  });

  it('evaluates a disabled flag to its default value', async () => {
    const created = await app.inject({
      method: 'POST',
      url: '/flags',
      payload: { key: 'eval-test', defaultValue: false },
    });
    const { key } = JSON.parse(created.body);

    const response = await app.inject({
      method: 'POST',
      url: `/evaluate/${key}`,
      payload: { userId: 'u1' },
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).value).toBe(false);
  });

  it('returns 404 when evaluating a non-existent flag key', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/evaluate/does-not-exist',
      payload: { userId: 'u1' },
    });

    expect(response.statusCode).toBe(404);
  });
});