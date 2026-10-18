import type { RuleType } from "../../api/ruleApi";

export interface CreateRuleDto {
  name: string;
  ruleType: RuleType;
}
