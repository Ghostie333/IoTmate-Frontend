import { useState } from "react";
import { useTranslation } from "react-i18next";
import { createRoom } from "../../api/roomApi";
import { ApiError } from "../../api/http";
import type { CreateRoomDto } from "../../types/CreateRoomDto";

interface NewRoomFormProps {
  onRoomCreated: () => void;
  onClose: () => void;
}

export default function NewRoomForm({ onRoomCreated, onClose }: NewRoomFormProps) {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await createRoom(roomForm);
      setRoomForm({ name: "", timeZoneId: "" });
      onRoomCreated();
      onClose();
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Unexpected error while creating the room.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-md border border-slate-600 bg-slate-800 p-3 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none";

  return (
    <div className="max-w-3xl mx-auto rounded-t-2xl bg-blue-600">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-xl text-white">{t("rooms.new_room")}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded bg-blue-700 px-3 py-1 text-white hover:bg-blue-500"
          >
            &times;
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="font-bold text-white">
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
          <label htmlFor="timeZoneId" className="font-bold text-white">
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

        {error && <p className="text-red-200">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-blue-800 px-4 py-2 font-semibold text-white transition hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50"
        >
          {submitting ? t("rooms.saving") : t("rooms.create_room_submit")}
        </button>
      </form>
    </div>
  );
}