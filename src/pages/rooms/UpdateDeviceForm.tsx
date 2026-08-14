import { useState } from "react";
import { updateDevice, type RoomDevice } from "../../api/deviceApi";
import { toErrorMessage } from "../../api/http";
import { useTranslation } from "react-i18next";
import type { UpdateDeviceDto } from "../../types/UpdateDeviceDto";

interface UpdateDeviceFormProps {
  device: RoomDevice;
  onUpdated: () => void | Promise<void>; // zgadza się z refresh()
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

  return (
    <div
      className="w-xl rounded-2xl border bg-slate-800"
      onClick={(e) => e.stopPropagation()}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">
        <label htmlFor="deviceId" className="font-bold text-xl">
          Device ID
        </label>
        <input
          type="text"
          name="newName"
          id="deviceId"
          value={updateForm.newName}
          onChange={handleChange}
          required
          className="border rounded p-2"
        />
        {/* Error field */}
        <p className="text-red-200">{error ? error : "\u00A0"}</p>
        {/* Submit button */}
        <button
          type="submit"
          disabled={submitting}
          className="border rounded p-3"
        >
          {submitting ? t("devices.adding") : t("devices.add")}
        </button>
      </form>
    </div>
  );
}
