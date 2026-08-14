import { http } from "./http";

// Device type
export const DeviceType = {
  PowerStrip: 1,
  Sensor: 2,
} as const;
export type DeviceType = (typeof DeviceType)[keyof typeof DeviceType];

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

export const deleteDeviceFromRoom = (roomId: string, deviceId: string) =>
  http<void>(`/rooms/${roomId}/devices`, {
    method: "DELETE",
    body: JSON.stringify(deviceId),
  });
