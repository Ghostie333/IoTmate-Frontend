import { useState } from "react";
import { useTranslation } from "react-i18next";
import { createRoom } from "../../api/roomApi";
import { toErrorMessage } from "../../api/http";
import type { CreateRoomDto } from "../../types/rooms/CreateRoomDto";

interface NewRoomFormProps {
  onRoomCreated: () => void;
  onClose: () => void;
}

export default function NewRoomForm({
  onRoomCreated,
  onClose,
}: NewRoomFormProps) {
  const { t } = useTranslation();
  const [roomForm, setRoomForm] = useState<CreateRoomDto>({
    name: "",
    timeZoneId: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRoomForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await createRoom(roomForm);
      setRoomForm({ name: "", timeZoneId: "" });
      onRoomCreated();
      onClose();
    } catch (err) {
      setError(toErrorMessage(err, t));
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-700 bg-slate-950/60 p-2.5 text-slate-100 placeholder-slate-500 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {t("rooms.new_room")}
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

        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium text-slate-300">
            {t("rooms.room_name")}
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={roomForm.name}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="timeZoneId"
            className="text-sm font-medium text-slate-300"
          >
            {t("rooms.timezone")}
          </label>
          <input
            id="timeZoneId"
            type="text"
            name="timeZoneId"
            value={roomForm.timeZoneId}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        <p className="text-sm text-red-400">{error ? error : "\u00A0"}</p>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50"
        >
          {submitting ? t("rooms.saving") : t("rooms.create_room_submit")}
        </button>
      </form>
    </div>
  );
}
