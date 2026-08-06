import { API_BASE_URL } from "../main"

export interface Room {
  id: string;
  name: string;
  timeZoneId: string;
  createdAt: string;
}

export const GetUserRooms = async (): Promise<Response> => {
  const response = await fetch(`${API_BASE_URL}/rooms`, {
    method: 'GET',
    credentials: 'include', // send .NET Identity auth cookie
  });

  return response;
};
