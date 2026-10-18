import { API_BASE_URL } from "../config";
import type { LoginUserDto } from "../types/LoginUserDto";
import type { RegisterUserDto } from "../types/RegisterUserDto";
import { http } from "./http";

export interface AuthResult {
  succeeded: boolean;
  errors: string[];
}

export interface CurrentUser {
  userId: string;
  userName: string;
  email: string;
}

async function postAuth(path: string, body: object): Promise<AuthResult> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  const data = (await response.json().catch(() => null)) as {
    succeeded?: boolean;
    errors?: unknown;
  } | null;

  return {
    succeeded: data?.succeeded ?? response.ok,
    errors: normalizeErrors(data?.errors, response),
  };
}

function normalizeErrors(errors: unknown, response: Response): string[] {
  if (Array.isArray(errors)) {
    return errors.filter((error): error is string => typeof error === "string");
  }

  if (errors && typeof errors === "object") {
    return Object.values(errors).flatMap((value) =>
      Array.isArray(value)
        ? value.filter((error): error is string => typeof error === "string")
        : [],
    );
  }

  if (!response.ok) {
    return [response.statusText || `HTTP ${response.status}`];
  }

  return [];
}

export const loginUser = (data: LoginUserDto) => postAuth("/auth/login", data);

export const registerUser = (data: RegisterUserDto) =>
  postAuth("/auth/register", data);

export const getCurrentUser = () => http<CurrentUser>("/auth/me");

export const logoutUser = async (): Promise<void> => {
  await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
};
