import { useCallback, useEffect, useRef, useState } from "react";
import { toErrorMessage } from "../api/http";
import { useTranslation } from "react-i18next";
import { getRoomDevices } from "../api/deviceApi";
import type { RoomDevice } from "../types/devices/DeviceDto";
import type {
  DeviceStateUpdateDto,
  DeviceStatusUpdateDto,
  SensorReadingUpdateDto,
} from "../types/devices/DeviceDto";
import { DeviceHubConnection } from "../api/deviceHub";

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

  // Manual refetch after update/delete
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

  const refreshRef = useRef(refresh);

  useEffect(() => {
    refreshRef.current = refresh;
  }, [refresh]);

  useEffect(() => {
    if (!roomId) return;

    const connection = new DeviceHubConnection();

    const handleStatus = (update: DeviceStatusUpdateDto) => {
      setDevices((prev) =>
        prev?.map((device) =>
          device.deviceId === update.deviceId
            ? {
                ...device,
                isOnline: update.isOnline,
                lastSeenAt: new Date(update.lastSeenAt),
              }
            : device,
        ),
      );
    };

    const handleReading = (update: SensorReadingUpdateDto) => {
      setDevices((prev) =>
        prev?.map((device) =>
          device.deviceId === update.deviceId
            ? {
                ...device,
                lastReading: update.data,
                lastSeenAt: new Date(update.timestamp),
              }
            : device,
        ),
      );
    };

    const handleState = (update: DeviceStateUpdateDto) => {
      setDevices((prev) =>
        prev?.map((device) =>
          device.deviceId === update.deviceId
            ? {
                ...device,
                isOnline: update.isOnline,
                lastSeenAt: new Date(update.lastSeenAt),
                outletsState: update.outletsState,
              }
            : device,
        ),
      );
    };

    connection.onStatusChanged(handleStatus);
    connection.onReadingReceived(handleReading);
    connection.onStateChanged(handleState);

    connection.onReconnected(() => {
      connection
        .joinRoom(roomId)
        .catch((err) => console.error("Failed to rejoin the devices room", err));
      refreshRef.current();
    });

    let disposed = false;

    const startTimer = setTimeout(() => {
      connection
        .start()
        .then(() => {
          if (!disposed) return connection.joinRoom(roomId);
        })
        .catch((err) => {
          if (!disposed) console.error("Failed to connect to the devices hub", err);
        });
    }, 0);

    return () => {
      disposed = true;
      clearTimeout(startTimer);
      connection.offStatusChanged(handleStatus);
      connection.offReadingReceived(handleReading);
      connection.offStateChanged(handleState);
      connection.stop();
    };
  }, [roomId]);

  return { devices, loading, error, refresh };
}
