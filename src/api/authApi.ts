import type { LoginUserDto } from "../types/LoginUserDto";
import { API_BASE_URL } from "../main"
// const API_BASE_URL = 'http://localhost:7070/api'; // Backend address

// Interfejs opisujący strukturę danych logowania/rejestracji
export interface AuthRequest {
  email: string;
  password: string;
}

export const registerUser = async (credentials: AuthRequest): Promise<Response> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  return response;
};

export const loginUser = async (data: LoginUserDto): Promise<Response> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Send .NET Identity cookies
    body: JSON.stringify(data),
  });

  return response;
};

export const logoutUser = async (): Promise<Response> => {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json'},
  });

  alert("wylogowano")
  return response
}