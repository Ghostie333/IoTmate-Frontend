import type { RoomDevice } from "../types/devices/DeviceDto";
import type { UpdateDeviceDto } from "../types/devices/UpdateDeviceDto";
import { http } from "./http";

export const getRoomDevices = (roomId: string) =>
  http<RoomDevice[]>(`/rooms/${roomId}/devices`);

export const addDeviceToRoom = (roomId: string, deviceId: string) =>
  http<void>(`/rooms/${roomId}/devices`, {
    method: "POST",
    body: JSON.stringify(deviceId),
  });

export const updateDevice = (deviceId: string, input: UpdateDeviceDto) =>
  http<void>(`/devices/${deviceId}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });

export const deleteDeviceFromRoom = (roomId: string, deviceId: string) =>
  http<void>(`/rooms/${roomId}/devices`, {
    method: "DELETE",
    body: JSON.stringify(deviceId),
  });
