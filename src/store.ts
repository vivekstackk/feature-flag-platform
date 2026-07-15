import { randomUUID } from 'crypto';
import { Flag, CreateFlagInput } from './types';

export class FlagStore {
  private flags: Map<string, Flag> = new Map();

  create(input: CreateFlagInput): Flag {
    const existing = this.getByKey(input.key);
    if (existing) {
      throw new Error(`Flag with key "${input.key}" already exists`);
    }

    const now = new Date().toISOString();
    const flag: Flag = {
      id: randomUUID(),
      key: input.key,
      description: input.description ?? '',
      enabled: false,
      defaultValue: input.defaultValue ?? false,
      createdAt: now,
      updatedAt: now,
    };

    this.flags.set(flag.id, flag);
    return flag;
  }

  getById(id: string): Flag | undefined {
    return this.flags.get(id);
  }

  getByKey(key: string): Flag | undefined {
    for (const flag of this.flags.values()) {
      if (flag.key === key) return flag;
    }
    return undefined;
  }

  getAll(): Flag[] {
    return Array.from(this.flags.values());
  }

  update(id: string, changes: Partial<Pick<Flag, 'description' | 'enabled' | 'defaultValue'>>): Flag {
    const flag = this.flags.get(id);
    if (!flag) {
      throw new Error(`Flag with id "${id}" not found`);
    }

    const updated: Flag = {
      ...flag,
      ...changes,
      updatedAt: new Date().toISOString(),
    };

    this.flags.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.flags.delete(id);
  }
}