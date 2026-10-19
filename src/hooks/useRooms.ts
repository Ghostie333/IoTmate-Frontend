import { useCallback, useEffect, useState } from "react";
import { getUserRooms } from "../api/roomApi";
import type { RoomDto } from "../types/rooms/RoomDto";
import { toErrorMessage } from "../api/http";
import { useTranslation } from "react-i18next";

export function useRooms() {
  const { t } = useTranslation();
  const [rooms, setRooms] = useState<RoomDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Refresh room list
  const refresh = useCallback(async () => {
    try {
      setRooms(await getUserRooms());
      setError(null);
    } catch (err) {
      setError(toErrorMessage(err, t));
    }
  }, [t]);

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
        if (!ignore) setError(toErrorMessage(err, t));
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [t]);

  return { rooms, loading, error, refresh };
}
