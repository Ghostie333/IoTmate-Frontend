import { useCallback, useEffect, useState } from "react";
import { toErrorMessage } from "../api/http";
import { useTranslation } from "react-i18next";
import { getRoomDevices, type RoomDevice } from "../api/deviceApi";

export function useRoomDevices(roomId: string | undefined) {
  const { t } = useTranslation();
  const [devices, setDevices] = useState<RoomDevice[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch when the URL changes
  useEffect(() => {
    if (!roomId) return;

    let ignore = false;

    getRoomDevices(roomId)
      .then((data) => {
        if (!ignore) {
          setDevices(data);
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
      setDevices(await getRoomDevices(roomId));
    } catch (err) {
      setError(toErrorMessage(err, t));
    } finally {
      setLoading(false);
    }
  }, [roomId, t]);

  return { devices, loading, error, refresh };
}
