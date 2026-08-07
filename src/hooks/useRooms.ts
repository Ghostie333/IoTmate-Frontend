import { useCallback, useEffect, useState } from "react";
import { getUserRooms, type Room } from "../api/roomApi";
import { ApiError } from "../api/http";

/**
 * Loads and owns the current user's rooms.
 * Centralizes room data access so a SignalR subscription can be added later
 * without changing the pages that consume it.
 */
export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /** Re-fetches the list; leaves `loading` untouched so the UI does not flicker. */
  const refresh = useCallback(async () => {
    try {
      setRooms(await getUserRooms());
      setError(null);
    } catch (err) {
      setError(toErrorMessage(err));
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    getUserRooms()
      .then((data) => {
        if (!ignore) {
          setRooms(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (!ignore) setError(toErrorMessage(err));
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  return { rooms, loading, error, refresh };
}

function toErrorMessage(err: unknown): string {
  if (err instanceof ApiError && err.status === 401)
    return "You must be logged in to see your rooms.";
  if (err instanceof Error) return err.message;
  return "An unexpected error occurred.";
}