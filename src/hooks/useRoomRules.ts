import { useCallback, useEffect, useState } from "react";
import { toErrorMessage } from "../api/http";
import { useTranslation } from "react-i18next";
import { getRoomRules, type RoomRule } from "../api/ruleApi";

export function useRoomRules(roomId: string | undefined) {
  const { t } = useTranslation();
  const [rules, setRules] = useState<RoomRule[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch when the URL changes
  useEffect(() => {
    if (!roomId) return;

    let ignore = false;

    getRoomRules(roomId)
      .then((data) => {
        if (!ignore) {
          setRules(data);
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

  // Manual refetch, after update/delete/create
  const refresh = useCallback(async () => {
    if (!roomId) return;

    setLoading(true);
    setError(null);
    try {
      setRules(await getRoomRules(roomId));
    } catch (err) {
      setError(toErrorMessage(err, t));
    } finally {
      setLoading(false);
    }
  }, [roomId, t]);

  return { rules, loading, error, refresh };
}
