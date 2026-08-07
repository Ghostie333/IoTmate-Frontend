import { API_BASE_URL } from "../config";
import type { LoginUserDto } from "../types/LoginUserDto";
import type { RegisterUserDto } from "../types/RegisterUserDto";

export interface AuthResult {
  succeeded: boolean;
  errors: string[];
}

/** POSTs JSON and returns the auth result without throwing (auth endpoints report failures via body). */
async function postAuth(path: string, body: object): Promise<AuthResult> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  const data = (await response.json().catch(() => null)) as AuthResult | null;
  return data ?? { succeeded: response.ok, errors: [] };
}

export const loginUser = (data: LoginUserDto) => postAuth("/auth/login", data);

export const registerUser = (data: RegisterUserDto) => postAuth("/auth/register", data);

export const logoutUser = async (): Promise<void> => {
  await fetch(`${API_BASE_URL}/auth/logout`, { method: "POST", credentials: "include" });
};