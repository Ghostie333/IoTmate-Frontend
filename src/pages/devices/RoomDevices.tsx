import { useTranslation } from "react-i18next";
import { useRoomDevices } from "../../hooks/useRoomDevices";
import { useState } from "react";
import AddDeviceToRoomForm from "../rooms/AddDeviceToRoomForm";
import {
  deleteDeviceFromRoom,
  DeviceTypeKey,
  type RoomDevice,
} from "../../api/deviceApi";
import UpdateDeviceForm from "../rooms/UpdateDeviceForm";
import Modal from "../../components/Modal";

export function RoomDevices({ roomId }: { roomId: string | undefined }) {
  const { t } = useTranslation();
  const { devices, loading, error, refresh } = useRoomDevices(roomId);
  const [open, setOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<RoomDevice | null>(null);

  if (!roomId) return null;

  // Delete device from room
  const deleteDevice = async (device: RoomDevice) => {
    await deleteDeviceFromRoom(roomId, device.deviceId);
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
            {t("devices.title")}
          </span>
          <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-400">
            {devices?.length ?? 0}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Add device button */}
          <button
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-500 active:scale-[0.98]"
            onClick={(e) => {
              e.stopPropagation();
              setFormOpen(true);
            }}
          >
            {t("devices.addDevice")}
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

      {/* Add device to room form */}
      <Modal open={formOpen} onClose={() => setFormOpen(false)}>
        <AddDeviceToRoomForm
          roomId={roomId}
          onDeviceAdded={refresh}
          onClose={() => setFormOpen(false)}
        />
      </Modal>

      {/* Edit device */}
      <Modal
        open={editingDevice !== null}
        onClose={() => setEditingDevice(null)}
      >
        {editingDevice && (
          <UpdateDeviceForm
            device={editingDevice}
            onUpdated={refresh}
            onClose={() => setEditingDevice(null)}
          />
        )}
      </Modal>

      {/* Device list */}
      {open && (
        <div>
          {loading ? (
            <div className="p-6 text-sm text-slate-500">{t("devices.loading")}</div>
          ) : error ? (
            <div className="p-6 text-sm text-red-400">{error}</div>
          ) : devices?.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">
              {t("devices.noDevicesInRoom")}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-800 bg-slate-950/60">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-slate-400">
                      {t("devices.columnId")}
                    </th>
                    <th className="px-6 py-3 font-semibold text-slate-400">
                      {t("devices.columnName")}
                    </th>
                    <th className="px-6 py-3 font-semibold text-slate-400">
                      {t("devices.columnType")}
                    </th>
                    <th className="px-6 py-3 font-semibold text-slate-400">
                      {t("devices.columnStatus")}
                    </th>
                    <th className="px-6 py-3 text-right font-semibold text-slate-400">
                      {t("devices.columnActions")}
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {devices?.map((d) => (
                    <tr
                      key={d.deviceId}
                      className="transition-colors hover:bg-slate-950/60"
                    >
                      <td className="whitespace-nowrap px-6 py-4 font-mono text-xs text-slate-500">
                        {d.deviceId}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-100">
                        {d.name}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-slate-400">
                        {t(DeviceTypeKey[d.deviceType])}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${
                            d.isOnline
                              ? "bg-emerald-950 text-emerald-400"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${
                              d.isOnline ? "bg-emerald-400" : "bg-slate-500"
                            }`}
                          />
                          {d.isOnline
                            ? t("devices.online")
                            : t("devices.offline")}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            className="rounded-md border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-slate-700 hover:bg-transparent"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingDevice(d);
                            }}
                          >
                            {t("devices.edit")}
                          </button>

                          <button
                            type="button"
                            className="rounded-md border border-red-800 bg-red-950 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:border-red-900 hover:bg-transparent"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteDevice(d);
                            }}
                          >
                            {t("devices.delete")}
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