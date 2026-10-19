import {
  HubConnectionBuilder,
  LogLevel,
  type HubConnection,
} from "@microsoft/signalr";
import { API_BASE_URL } from "../config";
import type {
  DeviceStateUpdateDto,
  DeviceStatusUpdateDto,
  SensorReadingUpdateDto,
} from "../types/devices/DeviceDto";

export class DeviceHubConnection {
  private readonly hubConnection: HubConnection;

  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/hubs/devices`, {
        withCredentials: true,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(LogLevel.Warning)
      .build();
  }

  start(): Promise<void> {
    return this.hubConnection.start();
  }

  stop(): Promise<void> {
    return this.hubConnection.stop();
  }

  joinRoom(roomId: string): Promise<void> {
    return this.hubConnection.invoke("JoinRoom", roomId);
  }

  leaveRoom(roomId: string): Promise<void> {
    return this.hubConnection.invoke("LeaveRoom", roomId);
  }

  onStatusChanged(handler: (update: DeviceStatusUpdateDto) => void): void {
    this.hubConnection.on("DeviceStatusChanged", handler);
  }

  offStatusChanged(handler: (update: DeviceStatusUpdateDto) => void): void {
    this.hubConnection.off("DeviceStatusChanged", handler);
  }

  onStateChanged(handler: (update: DeviceStateUpdateDto) => void): void {
    this.hubConnection.on("DeviceStateChanged", handler);
  }

  offStateChanged(handler: (update: DeviceStateUpdateDto) => void): void {
    this.hubConnection.off("DeviceStateChanged", handler);
  }

  onReadingReceived(handler: (update: SensorReadingUpdateDto) => void): void {
    this.hubConnection.on("SensorReadingReceived", handler);
  }

  offReadingReceived(handler: (update: SensorReadingUpdateDto) => void): void {
    this.hubConnection.off("SensorReadingReceived", handler);
  }

  onReconnected(handler: () => void): void {
    this.hubConnection.onreconnected(handler);
  }

  onClosed(handler: (error?: Error) => void): void {
    this.hubConnection.onclose(handler);
  }
}
