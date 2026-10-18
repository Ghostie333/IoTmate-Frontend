import { useState } from "react";
import { addDeviceToRoom } from "../../api/deviceApi";
import { toErrorMessage } from "../../api/http";
import { useTranslation } from "react-i18next";

interface AddDeviceToRoomFormProps {
  roomId: string;
  onDeviceAdded: () => void;
  onClose: () => void;
}

export default function AddDeviceToRoomForm({
  roomId,
  onDeviceAdded,
  onClose,
}: AddDeviceToRoomFormProps) {
  const { t } = useTranslation();
  const [deviceId, setDeviceId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setDeviceId(value);
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await addDeviceToRoom(roomId, deviceId);
      setDeviceId("");
      onClose();
      onDeviceAdded();
    } catch (err) {
      setError(toErrorMessage(err, t));
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-700 bg-slate-950/60 p-2.5 font-mono text-sm text-slate-100 placeholder-slate-500 uppercase transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {t("devices.addDevice")}
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
          <label
            htmlFor="deviceId"
            className="text-sm font-medium text-slate-300"
          >
            {t("devices.deviceId")}
          </label>
          <input
            type="text"
            name="deviceId"
            id="deviceId"
            value={deviceId}
            onChange={handleChange}
            required
            placeholder="E8F60A3665F0"
            className={inputClass}
          />
        </div>

        {/* Error field */}
        <p className="text-sm text-red-400">{error ? error : "\u00A0"}</p>

        {/* Submit button */}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50"
        >
          {submitting ? t("devices.adding") : t("devices.add")}
        </button>
      </form>
    </div>
  );
}