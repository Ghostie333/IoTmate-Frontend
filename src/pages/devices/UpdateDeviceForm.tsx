import { useState } from "react";
import { updateDevice } from "../../api/deviceApi";
import type { RoomDevice } from "../../types/devices/DeviceDto";
import { toErrorMessage } from "../../api/http";
import { useTranslation } from "react-i18next";
import type { UpdateDeviceDto } from "../../types/devices/UpdateDeviceDto";

interface UpdateDeviceFormProps {
  device: RoomDevice;
  onUpdated: () => void | Promise<void>;
  onClose: () => void;
}

export default function UpdateDeviceForm({
  device,
  onUpdated,
  onClose,
}: UpdateDeviceFormProps) {
  const { t } = useTranslation();
  const [updateForm, setUpdateForm] = useState<UpdateDeviceDto>({
    newName: device.name,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await updateDevice(device.deviceId, updateForm);
      onClose();
      onUpdated();
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
            {t("devices.edit")}: {device.name}
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
            htmlFor="newName"
            className="text-sm font-medium text-slate-300"
          >
            {t("devices.name")}
          </label>
          <input
            type="text"
            name="newName"
            id="newName"
            value={updateForm.newName}
            onChange={handleChange}
            required
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
          {submitting ? t("devices.saving") : t("devices.save")}
        </button>
      </form>
    </div>
  );
}
