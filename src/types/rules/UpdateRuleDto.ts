import type { RuleAction, RuleOperation } from "../../api/ruleApi";

export interface UpdateRuleDto {
  id: string;
  name: string;
  isEnabled: boolean;
  targetDeviceId?: string | null;
  targetOutletNumber?: number | null;
  action?: RuleAction | null;
  sourceDeviceId?: string | null;
  sensorFieldName?: string | null;
  operation?: RuleOperation | null;
  sensorRuleValue?: number | null;
  timeHour?: number | null;
  timeMinute?: number | null;
  daysOfWeek?: boolean[] | null;
}
