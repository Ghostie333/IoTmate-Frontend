// Room
export interface RoomDto {
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
export interface RoomMemberDto {
  userId: string;
  username: string;
  role: RoomRole;
}
