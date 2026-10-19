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

export const ReadingLabelKey: Record<string, string> = {
  temperature: "devices.readingTemperature",
  humidity: "devices.readingHumidity",
};

export const ReadingUnit: Record<string, string> = {
  temperature: "°C",
  humidity: "%",
};

export interface RoomDevice {
  deviceId: string;
  name: string;
  deviceType: DeviceType;
  isOnline: boolean;
  lastSeenAt: Date;
  lastReading: Record<string, number> | null;
  outletsState: boolean[] | null;
}

// Device state and status dtos
export interface DeviceStatusUpdateDto {
  deviceId: string;
  isOnline: boolean;
  lastSeenAt: string;
}

export interface DeviceStateUpdateDto extends DeviceStatusUpdateDto {
  outletsState: boolean[];
}

export interface SensorReadingUpdateDto {
  deviceId: string;
  data: Record<string, number>;
  timestamp: string;
}
