import type { CreateRuleDto } from "../types/rules/CreateRuleDto";
import type { RuleDto } from "../types/rules/RuleDto";
import type { UpdateRuleDto } from "../types/rules/UpdateRuleDto";
import { http } from "./http";

// #####################

// #####################
// Rule Requests

export const getRoomRules = (roomId: string) =>
  http<RuleDto[]>(`/rooms/${roomId}/rules`);

export const createRule = (roomId: string, input: CreateRuleDto) =>
  http<RuleDto>(`/rooms/${roomId}/rules`, {
    method: "POST",
    body: JSON.stringify(input),
  });

export const updateRule = (
  roomId: string,
  ruleId: string,
  input: UpdateRuleDto,
) =>
  http<RuleDto>(`/rooms/${roomId}/rules/${ruleId}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });

export const deleteRule = (roomId: string, ruleId: string) =>
  http<void>(`/rooms/${roomId}/rules/${ruleId}`, {
    method: "DELETE",
  });
