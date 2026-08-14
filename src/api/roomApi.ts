import { http } from "./http";
import type { CreateRoomDto } from "../types/CreateRoomDto";

// Room
export interface Room {
  id: string;
  name: string;
  timeZoneId: string;
  createdAt: string;
}

// Room role
export const RoomRole = {
  Owner: 1,
  Member: 2,
} as const;
export type RoomRole = (typeof RoomRole)[keyof typeof RoomRole];

// Room member
export interface RoomMember {
  userId: string;
  username: string;
  role: RoomRole;
}

export const getUserRooms = () => http<Room[]>("/rooms");

export const getRoomById = (roomId: string) => http<Room>(`/rooms/${roomId}`);

export const createRoom = (input: CreateRoomDto) =>
  http<Room>("/rooms/new", { method: "POST", body: JSON.stringify(input) });

export const updateRoom = (roomId: string, input: CreateRoomDto) =>
  http<void>(`/rooms/${roomId}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });

export const deleteRoom = (roomId: string) =>
  http<void>(`/rooms/${roomId}`, { method: "DELETE" });

export const getRoomMembers = (roomId: string) =>
  http<RoomMember[]>(`/rooms/${roomId}/members`);


