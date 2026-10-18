import { useState } from "react";
import {
  updateRule,
  RuleType,
  RuleAction,
  RuleOperation,
  type RoomRule,
} from "../../api/ruleApi";
import { toErrorMessage } from "../../api/http";
import { useTranslation } from "react-i18next";
import { useRoomDevices } from "../../hooks/useRoomDevices";
import type { UpdateRuleDto } from "../../types/rules/UpdateRuleDto";

interface UpdateRuleFormProps {
  roomId: string;
  rule: RoomRule;
  onUpdated: () => void;
  onClose: () => void;
}

const DAYS_OF_WEEK_LABELS = [
  "rules.monday",
  "rules.tuesday",
  "rules.wednesday",
  "rules.thursday",
  "rules.friday",
  "rules.saturday",
  "rules.sunday",
];

export function UpdateRuleForm({
  roomId,
  rule,
  onUpdated,
  onClose,
}: UpdateRuleFormProps) {
  const { t } = useTranslation();
  const { devices } = useRoomDevices(roomId);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<UpdateRuleDto>({
    id: rule.id,
    name: rule.name,
    isEnabled: rule.isEnabled,
    targetDeviceId: rule.targetDeviceId ?? null,
    targetOutletNumber: rule.targetOutletNumber ?? null,
    action: rule.action ?? null,
    sourceDeviceId: rule.sourceDeviceId ?? null,
    sensorFieldName: rule.sensorFieldName ?? null,
    operation: rule.operation ?? null,
    sensorRuleValue: rule.sensorRuleValue ?? null,
    timeHour: rule.timeHour ?? null,
    timeMinute: rule.timeMinute ?? null,
    daysOfWeek: rule.daysOfWeek ?? [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "action" || name === "operation") {
      setForm((prev) => ({
        ...prev,
        [name]: value === "" ? null : Number(value),
      }));
    } else if (
      name === "targetOutletNumber" ||
      name === "sensorRuleValue" ||
      name === "timeHour" ||
      name === "timeMinute"
    ) {
      setForm((prev) => ({
        ...prev,
        [name]: value === "" ? null : Number(value),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value === "" ? null : value }));
    }
  };

  const handleDayChange = (index: number, checked: boolean) => {
    setForm((prev) => {
      const currentDays = prev.daysOfWeek
        ? [...prev.daysOfWeek]
        : [false, false, false, false, false, false, false];
      currentDays[index] = checked;
      return { ...prev, daysOfWeek: currentDays };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await updateRule(roomId, rule.id, form);
      onClose();
      onUpdated();
    } catch (err) {
      setError(toErrorMessage(err, t));
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-700 bg-slate-950/60 p-2.5 text-sm text-slate-100 placeholder-slate-500 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 shadow-xl max-h-[90vh] overflow-y-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {t("rules.editRule")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2.5 py-1 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Name */}
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium text-slate-300">
            {t("rules.columnName")}
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={form.name}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>

        {/* Is Enabled */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isEnabled"
            id="isEnabled"
            checked={form.isEnabled}
            onChange={handleChange}
            className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor="isEnabled"
            className="text-sm font-medium text-slate-300"
          >
            {t("rules.enabled")}
          </label>
        </div>

        {/* Time rules fields */}
        {rule.ruleType === RuleType.Time && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="timeHour"
                  className="text-sm font-medium text-slate-300"
                >
                  {t("rules.timeHour")} (0-23)
                </label>
                <input
                  type="number"
                  name="timeHour"
                  id="timeHour"
                  min="0"
                  max="23"
                  value={form.timeHour ?? ""}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="timeMinute"
                  className="text-sm font-medium text-slate-300"
                >
                  {t("rules.timeMinute")} (0-59)
                </label>
                <input
                  type="number"
                  name="timeMinute"
                  id="timeMinute"
                  min="0"
                  max="59"
                  value={form.timeMinute ?? ""}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Days of week */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-300">
                {t("rules.daysOfWeek")}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950/40 p-3 rounded-lg border border-slate-800">
                {DAYS_OF_WEEK_LABELS.map((dayKey, idx) => (
                  <label
                    key={dayKey}
                    className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={form.daysOfWeek?.[idx] ?? false}
                      onChange={(e) => handleDayChange(idx, e.target.checked)}
                      className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500"
                    />
                    {t(dayKey)}
                  </label>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Reading rules fields */}
        {rule.ruleType === RuleType.Reading && (
          <>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="sourceDeviceId"
                className="text-sm font-medium text-slate-300"
              >
                {t("rules.sourceDevice")}
              </label>
              <select
                name="sourceDeviceId"
                id="sourceDeviceId"
                value={form.sourceDeviceId ?? ""}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">{t("common.selectDevice")}</option>
                {devices?.map((d) => (
                  <option key={d.deviceId} value={d.deviceId}>
                    {d.name} ({d.deviceId})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="sensorFieldName"
                className="text-sm font-medium text-slate-300"
              >
                {t("rules.sensorFieldName")}
              </label>
              <input
                type="text"
                name="sensorFieldName"
                id="sensorFieldName"
                placeholder="temperature, humidity..."
                value={form.sensorFieldName ?? ""}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="operation"
                  className="text-sm font-medium text-slate-300"
                >
                  {t("rules.operation")}
                </label>
                <select
                  name="operation"
                  id="operation"
                  value={form.operation ?? ""}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">{t("common.select")}</option>
                  <option value={RuleOperation.GreaterThan}>&gt;</option>
                  <option value={RuleOperation.GreaterThanOrEqual}>&ge;</option>
                  <option value={RuleOperation.Equal}>=</option>
                  <option value={RuleOperation.LessThan}>&lt;</option>
                  <option value={RuleOperation.LessThanOrEqual}>&le;</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="sensorRuleValue"
                  className="text-sm font-medium text-slate-300"
                >
                  {t("rules.sensorRuleValue")}
                </label>
                <input
                  type="number"
                  step="any"
                  name="sensorRuleValue"
                  id="sensorRuleValue"
                  value={form.sensorRuleValue ?? ""}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </>
        )}

        {/* Target and action */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="targetDeviceId"
            className="text-sm font-medium text-slate-300"
          >
            {t("rules.targetDevice")}
          </label>
          <select
            name="targetDeviceId"
            id="targetDeviceId"
            value={form.targetDeviceId ?? ""}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">{t("common.selectDevice")}</option>
            {devices?.map((d) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.name} ({d.deviceId})
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="targetOutletNumber"
            className="text-sm font-medium text-slate-300"
          >
            {t("rules.targetOutletNumber")}
          </label>
          <input
            type="number"
            name="targetOutletNumber"
            id="targetOutletNumber"
            min="1"
            value={form.targetOutletNumber ?? ""}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        {/* Action */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="action"
            className="text-sm font-medium text-slate-300"
          >
            {t("rules.action")}
          </label>
          <select
            name="action"
            id="action"
            value={form.action ?? ""}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">{t("common.none")}</option>
            <option value={RuleAction.TurnOn}>{t("rules.actionTurnOn")}</option>
            <option value={RuleAction.TurnOff}>
              {t("rules.actionTurnOff")}
            </option>
          </select>
        </div>

        {/* Error field */}
        <p className="text-sm text-red-400">{error ? error : "\u00A0"}</p>

        {/* Submit button */}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50"
        >
          {submitting ? t("rules.saving") : t("rules.save")}
        </button>
      </form>
    </div>
  );
}
