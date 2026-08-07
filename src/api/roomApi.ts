import { http } from "./http";
import type { CreateRoomDto } from "../types/CreateRoomDto";

export interface Room {
  id: string;
  name: string;
  timeZoneId: string;
  createdAt: string;
}

export const getUserRooms = () => http<Room[]>("/rooms");

export const createRoom = (input: CreateRoomDto) =>
  http<Room>("/rooms/new", { method: "POST", body: JSON.stringify(input) });