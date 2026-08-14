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
    <div className="border p-3 my-3 w-1/2 rounded-lg">
      <div
        className="flex flex-row justify-between items-center pb-1 border-b select-none"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
      >
        {/* Widget header/title */}
        <div className="font-bold text-xl">
          {t("devices.title")} ({devices?.length ?? 0})
        </div>
        {/* Add device button */}
        <button
          className="border-2 rounded-md p-2 font-bold"
          onClick={(e) => {
            e.stopPropagation();
            setFormOpen(!formOpen);
          }}
        >
          {t("devices.addDevice")}
        </button>
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
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
          {loading ? (
            <div className="p-6 text-sm text-slate-500 dark:text-slate-400">
              {t("devices.loading")}
            </div>
          ) : error ? (
            <div className="p-6 text-sm text-red-500 dark:text-red-400">
              {error}
            </div>
          ) : devices?.length === 0 ? (
            <p className="p-6 text-sm text-slate-500 dark:text-slate-400">
              {t("devices.noDevicesInRoom")}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-slate-600 dark:text-slate-300">
                      Device ID
                    </th>
                    <th className="px-6 py-3 font-semibold text-slate-600 dark:text-slate-300">
                      Device name
                    </th>
                    <th className="px-6 py-3 font-semibold text-slate-600 dark:text-slate-300">
                      Device type
                    </th>
                    <th className="px-6 py-3 font-semibold text-slate-600 dark:text-slate-300">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right font-semibold text-slate-600 dark:text-slate-300">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {devices?.map((d) => (
                    <tr
                      key={d.deviceId}
                      className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-900"
                    >
                      <td className="whitespace-nowrap px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">
                        {d.deviceId}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                        {d.name}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-slate-600 dark:text-slate-400">
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
                            className="rounded-md border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-slate-600 hover:bg-slate-800"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingDevice(d);
                            }}
                          >
                            {t("devices.edit")}
                          </button>

                          <button
                            type="button"
                            className="rounded-md border border-red-900 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:border-red-800 hover:bg-red-950"
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
