import { FlagStore } from './store';

describe('FlagStore', () => {
  let store: FlagStore;

  beforeEach(() => {
    store = new FlagStore();
  });

  it('creates a flag with defaults', () => {
    const flag = store.create({ key: 'new-checkout' });
    expect(flag.key).toBe('new-checkout');
    expect(flag.enabled).toBe(false);
    expect(flag.defaultValue).toBe(false);
    expect(flag.id).toBeDefined();
  });

  it('prevents duplicate keys', () => {
    store.create({ key: 'dup-flag' });
    expect(() => store.create({ key: 'dup-flag' })).toThrow();
  });

  it('retrieves a flag by key', () => {
    store.create({ key: 'find-me' });
    const found = store.getByKey('find-me');
    expect(found?.key).toBe('find-me');
  });

  it('updates a flag', () => {
    const flag = store.create({ key: 'toggle-me' });
    const updated = store.update(flag.id, { enabled: true });
    expect(updated.enabled).toBe(true);
  });

  it('throws when updating a non-existent flag', () => {
    expect(() => store.update('fake-id', { enabled: true })).toThrow();
  });

  it('deletes a flag', () => {
    const flag = store.create({ key: 'delete-me' });
    const result = store.delete(flag.id);
    expect(result).toBe(true);
    expect(store.getById(flag.id)).toBeUndefined();
  });
});