import { API_BASE_URL } from "../config";
import { type TFunction } from "i18next";

// Error carrying the HTTP status of a failed API call
export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

// Convert to error message to display for user
export function toErrorMessage(err: unknown, t: TFunction): string {
  if (err instanceof ApiError) {
    if (err.status === 401) return t("auth.mustBeLoggedIn");
    if (err.code) return t(`errors.${err.code}`, { defaultValue: err.code });
    return err.message;
  }
  if (err instanceof Error) return err.message;
  return t("errors.unexpectedError");
}

// Fetch wrapper, adds cookies and base url
export async function http<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const hasBody = init.body !== undefined;
  const headers = new Headers(init.headers);
  if (hasBody) headers.set("Content-Type", "application/json");

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const { message, code } = await readError(response);
    throw new ApiError(response.status, message, code);
  }

  const content = await response.text();
  if (!content) return undefined as T;
  return JSON.parse(content) as T;
}

// Tries to read a ProblemDetails body from an error response. The backend
// sends a stable error code in "detail" (e.g. "device.notFound") which the
// frontend maps to a translation key. The message falls back to statusText
// when no ProblemDetails body is present.
async function readError(response: Response): Promise<{ message: string; code?: string }> {
  if (response.status === 500) {
    return { message: "An unexpected server error occurred." };
  }

  try {
    const body = (await response.json()) as { detail?: string; title?: string };
    const detail = body.detail || body.title;
    return {
      message: detail || response.statusText,
      code: body.detail,
    };
  } catch {
    return { message: response.statusText };
  }
}
