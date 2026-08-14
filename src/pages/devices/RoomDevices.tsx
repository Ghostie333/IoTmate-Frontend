import { useTranslation } from "react-i18next";
import { useRoomDevices } from "../../hooks/useRoomDevices";
import { useState } from "react";
import AddDeviceToRoomForm from "../rooms/AddDeviceToRoomForm";

export function RoomDevices({ roomId }: { roomId: string | undefined }) {
  const { t } = useTranslation();
  const { devices, loading, error, refresh } = useRoomDevices(roomId);
  const [open, setOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  if (!roomId) return;
  return (
    <div
      className="border p-3 my-3 select-none w-1/2"
      onClick={(e) => {
        e.stopPropagation();
        setOpen(!open);
      }}
    >
      <div className="flex flex-row justify-between">
        {/* Widget title */}
        <div className="font-bold text-xl">
          {t("devices.title")} ({devices?.length ?? 0})
        </div>
        {/* Add device button */}
        <button
          className="border rounded p-1"
          onClick={(e) => {
            e.stopPropagation();
            setFormOpen(!formOpen);
          }}
        >
          {t("devices.addDevice")}
        </button>
      </div>

      {/* Slide-out add device to room form */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 transition-transform duration-300 ${
          formOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <AddDeviceToRoomForm
          roomId={roomId}
          onDeviceAdded={refresh}
          onClose={() => setFormOpen(false)}
        />
      </div>

      {/* Device list */}
      {open && (
        <div className="mt-2">
          {loading ? (
            <div>{t("devices.loading")}</div>
          ) : error ? (
            <div className="text-red-400">{error}</div>
          ) : devices?.length === 0 ? (
            <p>{t("devices.noDevicesInRoom")}</p>
          ) : (
            <ul>
              {devices?.map((d) => (
                <li key={d.deviceId}>
                  {d.name} {d.deviceId}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
