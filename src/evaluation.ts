import { createHash } from 'crypto';
import { FlagConfig, TargetingRule, UserContext } from './types';

export function evaluateFlag(flag: FlagConfig, user: UserContext): boolean {
  if (!flag.enabled) {
    return flag.defaultValue;
  }

  const matchedRule = flag.rules.find((rule) => matchesRule(rule, user));
  if (matchedRule) {
    return matchedRule.serveValue;
  }

  if (flag.rollout) {
    return evaluateRollout(flag, flag.rollout, user);
  }

  return flag.defaultValue;
}

function matchesRule(rule: TargetingRule, user: UserContext): boolean {
  const actual = user.attributes?.[rule.attribute];
  if (actual === undefined) return false;

  switch (rule.operator) {
    case 'equals':
      return actual === rule.value;
    case 'notEquals':
      return actual !== rule.value;
    case 'in':
      return Array.isArray(rule.value) && rule.value.includes(actual as string | number);
    case 'contains':
      return typeof actual === 'string' && typeof rule.value === 'string' && actual.includes(rule.value);
    default:
      return false;
  }
}

function evaluateRollout(flag: FlagConfig, rollout: { percentage: number; serveValue: boolean }, user: UserContext): boolean {
  const bucket = bucketFor(flag.key, user.userId);
  return bucket < rollout.percentage ? rollout.serveValue : flag.defaultValue;
}

export function bucketFor(flagKey: string, userId: string): number {
  const hash = createHash('sha256').update(`${flagKey}:${userId}`).digest('hex');
  const intValue = parseInt(hash.slice(0, 8), 16);
  return (intValue % 10000) / 100;
}