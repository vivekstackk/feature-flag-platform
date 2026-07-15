import { randomUUID } from 'crypto';
import { CreateFlagInput, FlagConfig, RolloutConfig, TargetingRule } from './types';

export class FlagStore {
  private flags: Map<string, FlagConfig> = new Map();

  create(input: CreateFlagInput): FlagConfig {
    const existing = this.getByKey(input.key);
    if (existing) {
      throw new Error(`Flag with key "${input.key}" already exists`);
    }

    const now = new Date().toISOString();
    const flag: FlagConfig = {
      id: randomUUID(),
      key: input.key,
      description: input.description ?? '',
      enabled: false,
      defaultValue: input.defaultValue ?? false,
      createdAt: now,
      updatedAt: now,
      rules: [],
      rollout: null,
    };

    this.flags.set(flag.id, flag);
    return flag;
  }

  getById(id: string): FlagConfig | undefined {
    return this.flags.get(id);
  }

  getByKey(key: string): FlagConfig | undefined {
    for (const flag of this.flags.values()) {
      if (flag.key === key) return flag;
    }
    return undefined;
  }

  getAll(): FlagConfig[] {
    return Array.from(this.flags.values());
  }

  update(
    id: string,
    changes: Partial<Pick<FlagConfig, 'description' | 'enabled' | 'defaultValue'>>
  ): FlagConfig {
    const flag = this.flags.get(id);
    if (!flag) {
      throw new Error(`Flag with id "${id}" not found`);
    }

    const updated: FlagConfig = {
      ...flag,
      ...changes,
      updatedAt: new Date().toISOString(),
    };

    this.flags.set(id, updated);
    return updated;
  }

  setRules(id: string, rules: TargetingRule[]): FlagConfig {
    const flag = this.flags.get(id);
    if (!flag) {
      throw new Error(`Flag with id "${id}" not found`);
    }

    const updated: FlagConfig = { ...flag, rules, updatedAt: new Date().toISOString() };
    this.flags.set(id, updated);
    return updated;
  }

  setRollout(id: string, rollout: RolloutConfig | null): FlagConfig {
    const flag = this.flags.get(id);
    if (!flag) {
      throw new Error(`Flag with id "${id}" not found`);
    }

    const updated: FlagConfig = { ...flag, rollout, updatedAt: new Date().toISOString() };
    this.flags.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.flags.delete(id);
  }
}