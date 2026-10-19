import type { RuleType } from "./RuleDto";

export interface CreateRuleDto {
  name: string;
  ruleType: RuleType;
}
