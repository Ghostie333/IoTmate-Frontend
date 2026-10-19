import { useCallback, useEffect, useState } from "react";
import { getRoomById } from "../api/roomApi";
import type { RoomDto } from "../types/rooms/RoomDto";
import { toErrorMessage } from "../api/http";
import { useTranslation } from "react-i18next";

export function useRoom(roomId: string | undefined) {
  const { t } = useTranslation();
  const [room, setRoom] = useState<RoomDto>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch when the URL changes
  useEffect(() => {
    if (!roomId) return;

    let ignore = false;

    getRoomById(roomId)
      .then((data) => {
        if (!ignore) {
          setRoom(data);
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
  }, [roomId, t]);

  // Manual refetch, after update/delete
  const refresh = useCallback(async () => {
    if (!roomId) return;

    setLoading(true);
    setError(null);
    try {
      setRoom(await getRoomById(roomId));
    } catch (err) {
      setError(toErrorMessage(err, t));
    } finally {
      setLoading(false);
    }
  }, [roomId, t]);

  return { room, loading, error, refresh };
}
