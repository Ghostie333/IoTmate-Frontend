// Rule type
export const RuleType = {
  Reading: 1,
  Time: 2,
} as const;
export type RuleType = (typeof RuleType)[keyof typeof RuleType];

// Rule type for display
export const RuleTypeKey: Record<RuleType, string> = {
  [RuleType.Reading]: "rules.typeReading",
  [RuleType.Time]: "rules.typeTime",
};

// #####################
// Rule action
export const RuleAction = {
  TurnOn: 1,
  TurnOff: 2,
} as const;
export type RuleAction = (typeof RuleAction)[keyof typeof RuleAction];

// Rule action for display
export const RuleActionKey: Record<RuleAction, string> = {
  [RuleAction.TurnOn]: "rules.actionTurnOn",
  [RuleAction.TurnOff]: "rules.actionTurnOff",
};

// #####################
// Rule operation
export const RuleOperation = {
  GreaterThan: 1,
  GreaterThanOrEqual: 2,
  Equal: 3,
  LessThan: 4,
  LessThanOrEqual: 5,
} as const;
export type RuleOperation = (typeof RuleOperation)[keyof typeof RuleOperation];

// Rule operation for display
export const RuleOperationKey: Record<RuleOperation, string> = {
  [RuleOperation.GreaterThan]: ">",
  [RuleOperation.GreaterThanOrEqual]: "≥",
  [RuleOperation.Equal]: "=",
  [RuleOperation.LessThan]: "<",
  [RuleOperation.LessThanOrEqual]: "≤",
};

// #####################
// Dto
export interface RuleDto {
  id: string;
  name: string;
  isEnabled: boolean;
  ruleType: RuleType;
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
