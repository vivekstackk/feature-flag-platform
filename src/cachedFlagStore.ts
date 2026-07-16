import Redis from 'ioredis';
import { CreateFlagInput, FlagConfig, FlagRepository, RolloutConfig, TargetingRule } from './types';

const CACHE_TTL_SECONDS = 60;

function cacheKey(key: string): string {
  return `flag:key:${key}`;
}

export class CachedFlagStore implements FlagRepository {
  constructor(private inner: FlagRepository, private redis: Redis) {}

  async create(input: CreateFlagInput): Promise<FlagConfig> {
    return this.inner.create(input);
  }

  async getById(id: string): Promise<FlagConfig | undefined> {
    return this.inner.getById(id);
  }

  async getByKey(key: string): Promise<FlagConfig | undefined> {
    const cached = await this.redis.get(cacheKey(key));
    if (cached) {
      return JSON.parse(cached) as FlagConfig;
    }

    const flag = await this.inner.getByKey(key);
    if (flag) {
      await this.redis.set(cacheKey(key), JSON.stringify(flag), 'EX', CACHE_TTL_SECONDS);
    }
    return flag;
  }

  async getAll(): Promise<FlagConfig[]> {
    return this.inner.getAll();
  }

  async update(
    id: string,
    changes: Partial<Pick<FlagConfig, 'description' | 'enabled' | 'defaultValue'>>
  ): Promise<FlagConfig> {
    const flag = await this.inner.update(id, changes);
    await this.redis.del(cacheKey(flag.key));
    return flag;
  }

  async setRules(id: string, rules: TargetingRule[]): Promise<FlagConfig> {
    const flag = await this.inner.setRules(id, rules);
    await this.redis.del(cacheKey(flag.key));
    return flag;
  }

  async setRollout(id: string, rollout: RolloutConfig | null): Promise<FlagConfig> {
    const flag = await this.inner.setRollout(id, rollout);
    await this.redis.del(cacheKey(flag.key));
    return flag;
  }

  async delete(id: string): Promise<boolean> {
    const flag = await this.inner.getById(id);
    const result = await this.inner.delete(id);
    if (flag) {
      await this.redis.del(cacheKey(flag.key));
    }
    return result;
  }
}