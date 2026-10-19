import { useState } from "react";
import { createRule } from "../../api/ruleApi";
import { RuleType } from "../../types/rules/RuleDto";
import { toErrorMessage } from "../../api/http";
import { useTranslation } from "react-i18next";
import type { CreateRuleDto } from "../../types/rules/CreateRuleDto";

interface CreateRuleFormProps {
  roomId: string;
  onRuleCreated: () => void;
  onClose: () => void;
}

export function CreateRuleForm({
  roomId,
  onRuleCreated,
  onClose,
}: CreateRuleFormProps) {
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<CreateRuleDto>({
    name: "",
    ruleType: RuleType.Time,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "ruleType") {
      setForm((prev) => ({ ...prev, [name]: Number(value) as RuleType }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await createRule(roomId, form);
      onClose();
      onRuleCreated();
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
          <h2 className="text-xl font-bold text-white">{t("rules.addRule")}</h2>
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

        {/* Rule Type */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="ruleType"
            className="text-sm font-medium text-slate-300"
          >
            {t("rules.columnType")}
          </label>
          <select
            name="ruleType"
            id="ruleType"
            value={form.ruleType}
            onChange={handleChange}
            className={inputClass}
          >
            <option value={RuleType.Time}>{t("rules.typeTime")}</option>
            <option value={RuleType.Reading}>{t("rules.typeReading")}</option>
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
          {submitting ? t("rules.adding") : t("rules.add")}
        </button>
      </form>
    </div>
  );
}
