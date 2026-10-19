import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useRoomRules } from "../../hooks/useRoomRules";
import Modal from "../../components/Modal";
import { deleteRule } from "../../api/ruleApi";
import { RuleTypeKey, type RuleDto } from "../../types/rules/RuleDto";
import { CreateRuleForm } from "./CreateRuleForm";
import { UpdateRuleForm } from "./UpdateRuleForm";

export function RoomRules({ roomId }: { roomId: string | undefined }) {
  const { t } = useTranslation();
  const { rules, loading, error, refresh } = useRoomRules(roomId);
  const [open, setOpen] = useState(false);
  const [addRuleFormOpen, setAddRuleFormOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<RuleDto | null>(null);

  if (!roomId) return null;

  // Delete rule from room
  const handleDeleteRule = async (rule: RuleDto) => {
    await deleteRule(roomId, rule.id);
    refresh();
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-sm">
      {/* Widget header */}
      <div
        className="flex cursor-pointer flex-row items-center justify-between select-none border-b border-slate-800 px-6 py-4 transition-colors hover:bg-slate-900/80"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-white">
            {t("rules.title")}
          </span>
          <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-400">
            {rules?.length ?? 0}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Add rule button */}
          <button
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-500 active:scale-[0.98]"
            onClick={(e) => {
              e.stopPropagation();
              setAddRuleFormOpen(true);
            }}
          >
            {t("rules.addRule")}
          </button>
          <span
            className={`text-slate-500 transition-transform ${
              open ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          >
            &#9660;
          </span>
        </div>
      </div>

      {/* Create new rule form modal */}
      <Modal open={addRuleFormOpen} onClose={() => setAddRuleFormOpen(false)}>
        <CreateRuleForm
          roomId={roomId}
          onRuleCreated={refresh}
          onClose={() => setAddRuleFormOpen(false)}
        />
      </Modal>

      {/* Update rule modal */}
      <Modal open={editingRule !== null} onClose={() => setEditingRule(null)}>
        {editingRule && (
          <UpdateRuleForm
            roomId={roomId}
            rule={editingRule}
            onUpdated={refresh}
            onClose={() => setEditingRule(null)}
          />
        )}
      </Modal>

      {/* Rules list */}
      {open && (
        <div>
          {loading ? (
            <div className="p-6 text-sm text-slate-500">
              {t("rules.loading")}
            </div>
          ) : error ? (
            <div className="p-6 text-sm text-red-400">{error}</div>
          ) : rules?.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">
              {t("rules.noRulesInRoom")}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-800 bg-slate-950/60">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-slate-400">
                      {t("rules.columnId")}
                    </th>
                    <th className="px-6 py-3 font-semibold text-slate-400">
                      {t("rules.columnName")}
                    </th>
                    <th className="px-6 py-3 font-semibold text-slate-400">
                      {t("rules.columnType")}
                    </th>
                    <th className="px-6 py-3 font-semibold text-slate-400">
                      {t("rules.columnStatus")}
                    </th>
                    <th className="px-6 py-3 text-right font-semibold text-slate-400">
                      {t("rules.columnActions")}
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {rules?.map((d) => (
                    <tr
                      key={d.id}
                      className="transition-colors hover:bg-slate-950/60"
                    >
                      <td className="whitespace-nowrap px-6 py-4 font-mono text-xs text-slate-500">
                        {d.id}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-100">
                        {d.name}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-slate-400">
                        {t(RuleTypeKey[d.ruleType])}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${
                            d.isEnabled
                              ? "bg-emerald-950 text-emerald-400"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${
                              d.isEnabled ? "bg-emerald-400" : "bg-slate-500"
                            }`}
                          />
                          {d.isEnabled
                            ? t("rules.enabled")
                            : t("rules.disabled")}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            className="rounded-md border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-slate-700 hover:bg-transparent"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingRule(d);
                            }}
                          >
                            {t("rules.edit")}
                          </button>

                          <button
                            type="button"
                            className="rounded-md border border-red-800 bg-red-950 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:border-red-900 hover:bg-transparent"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteRule(d);
                            }}
                          >
                            {t("rules.delete")}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
