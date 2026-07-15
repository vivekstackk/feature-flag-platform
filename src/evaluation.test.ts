import { evaluateFlag, bucketFor } from './evaluation';
import { FlagConfig } from './types';

function baseFlag(overrides: Partial<FlagConfig> = {}): FlagConfig {
  return {
    id: '1',
    key: 'test-flag',
    description: '',
    enabled: true,
    defaultValue: false,
    createdAt: '',
    updatedAt: '',
    rules: [],
    rollout: null,
    ...overrides,
  };
}

describe('evaluateFlag', () => {
  it('returns defaultValue when flag is disabled', () => {
    const flag = baseFlag({ enabled: false, defaultValue: true });
    expect(evaluateFlag(flag, { userId: 'u1' })).toBe(true);
  });

  it('returns defaultValue when no rules or rollout match', () => {
    const flag = baseFlag({ defaultValue: false });
    expect(evaluateFlag(flag, { userId: 'u1' })).toBe(false);
  });

  it('applies a matching equals rule', () => {
    const flag = baseFlag({
      rules: [{ attribute: 'plan', operator: 'equals', value: 'pro', serveValue: true }],
    });
    expect(evaluateFlag(flag, { userId: 'u1', attributes: { plan: 'pro' } })).toBe(true);
    expect(evaluateFlag(flag, { userId: 'u2', attributes: { plan: 'free' } })).toBe(false);
  });

  it('applies a matching in rule', () => {
    const flag = baseFlag({
      rules: [{ attribute: 'country', operator: 'in', value: ['IN', 'US'], serveValue: true }],
    });
    expect(evaluateFlag(flag, { userId: 'u1', attributes: { country: 'IN' } })).toBe(true);
    expect(evaluateFlag(flag, { userId: 'u2', attributes: { country: 'DE' } })).toBe(false);
  });

  it('falls through to rollout when no rule matches', () => {
    const flag = baseFlag({
      rules: [{ attribute: 'plan', operator: 'equals', value: 'pro', serveValue: true }],
      rollout: { percentage: 100, serveValue: true },
    });
    expect(evaluateFlag(flag, { userId: 'u1', attributes: { plan: 'free' } })).toBe(true);
  });

  it('rollout at 0 percent never serves the rollout value', () => {
    const flag = baseFlag({ rollout: { percentage: 0, serveValue: true } });
    expect(evaluateFlag(flag, { userId: 'any-user' })).toBe(false);
  });

  it('rollout at 100 percent always serves the rollout value', () => {
    const flag = baseFlag({ rollout: { percentage: 100, serveValue: true } });
    expect(evaluateFlag(flag, { userId: 'any-user' })).toBe(true);
  });
});

describe('bucketFor', () => {
  it('is deterministic for the same flag and user', () => {
    const a = bucketFor('flag-x', 'user-1');
    const b = bucketFor('flag-x', 'user-1');
    expect(a).toBe(b);
  });

  it('is spread across the 0-100 range for different users', () => {
    const buckets = Array.from({ length: 200 }, (_, i) => bucketFor('flag-x', `user-${i}`));
    const min = Math.min(...buckets);
    const max = Math.max(...buckets);
    expect(min).toBeLessThan(10);
    expect(max).toBeGreaterThan(90);
  });

  it('returns a value between 0 and 100', () => {
    for (let i = 0; i < 50; i++) {
      const b = bucketFor('flag-x', `user-${i}`);
      expect(b).toBeGreaterThanOrEqual(0);
      expect(b).toBeLessThan(100);
    }
  });
});