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

  return (
    <div
      className="max-w-3xl mx-auto rounded-t-2xl bg-blue-600"
      onClick={(e) => e.stopPropagation()}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">
        <label htmlFor="deviceId" className="font-bold text-xl">
          Device ID
        </label>
        <input
          type="text"
          name="deviceId"
          id="deviceId"
          value={deviceId}
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
