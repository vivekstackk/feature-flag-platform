export interface Flag {
  id: string;
  key: string;
  description: string;
  enabled: boolean;
  defaultValue: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFlagInput {
  key: string;
  description?: string;
  defaultValue?: boolean;
}
export interface UserContext {
  userId: string;
  attributes?: Record<string, string | number | boolean>;
}

export type RuleOperator = 'equals' | 'notEquals' | 'in' | 'contains';

export interface TargetingRule {
  attribute: string;
  operator: RuleOperator;
  value: string | number | boolean | (string | number)[];
  serveValue: boolean;
}

export interface RolloutConfig {
  percentage: number;
  serveValue: boolean;
}

export interface FlagConfig extends Flag {
  rules: TargetingRule[];
  rollout: RolloutConfig | null;
}