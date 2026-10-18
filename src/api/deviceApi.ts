import type { UpdateDeviceDto } from "../types/UpdateDeviceDto";
import { http } from "./http";

// Device type
export const DeviceType = {
  PowerStrip: 1,
  Sensor: 2,
} as const;
export type DeviceType = (typeof DeviceType)[keyof typeof DeviceType];

// Device type for display
export const DeviceTypeKey: Record<DeviceType, string> = {
  [DeviceType.PowerStrip]: "devices.typePowerStrip",
  [DeviceType.Sensor]: "devices.typeSensor",
};

// Room device
export interface RoomDevice {
  deviceId: string;
  name: string;
  deviceType: DeviceType;
  isOnline: boolean;
  lastSeenAt: Date;
}

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
