import { API_BASE_URL } from "../config";

/** Error carrying the HTTP status of a failed API call. */
export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * Thin typed wrapper around `fetch`.
 * Adds the base URL and auth cookie, and throws `ApiError` on non-2xx.
 */
export async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const hasBody = init.body !== undefined;
  const headers = new Headers(init.headers);
  if (hasBody) headers.set("Content-Type", "application/json");

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    throw new ApiError(response.status, await readDetail(response));
  }

  const content = await response.text();
  if (!content) return undefined as T;
  return JSON.parse(content) as T;
}

/** Tries to read a ProblemDetails `detail` message from an error response. */
async function readDetail(response: Response): Promise<string> {
  if (response.status === 500) return "Unexpected server error.";
  try {
    const body = (await response.json()) as { detail?: string };
    return body.detail || response.statusText;
  } catch {
    return response.statusText;
  }
}