import { http } from "./http";
import type { CreateRoomDto } from "../types/rooms/CreateRoomDto";
import type { RoomDto, RoomMemberDto } from "../types/rooms/RoomDto";

export const getUserRooms = () => http<RoomDto[]>("/rooms");

export const getRoomById = (roomId: string) =>
  http<RoomDto>(`/rooms/${roomId}`);

export const createRoom = (input: CreateRoomDto) =>
  http<RoomDto>("/rooms/new", { method: "POST", body: JSON.stringify(input) });

export const updateRoom = (roomId: string, input: CreateRoomDto) =>
  http<void>(`/rooms/${roomId}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });

export const deleteRoom = (roomId: string) =>
  http<void>(`/rooms/${roomId}`, { method: "DELETE" });

export const getRoomMembers = (roomId: string) =>
  http<RoomMemberDto[]>(`/rooms/${roomId}/members`);
