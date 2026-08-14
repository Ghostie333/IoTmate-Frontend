import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRoom } from "../../hooks/useRoom";
import { RoomDevices } from "../devices/RoomDevices";

export default function RoomPage() {
  const { roomId } = useParams();
  const { t } = useTranslation();
  const { room, loading: roomLoading, error: roomError } = useRoom(roomId);

  if (roomLoading) return <div>Loading room...</div>;

  if (roomError)
    return (
      <div className="p-8 text-red-400">
        <p className="mb-2">{roomError}</p>
        <Link className="underline text-blue-400" to="/login">
          {t("nav.login")}
        </Link>
      </div>
    );

  return (
    <div className="p-8">
      {/* Header (room name and id) */}
      <div className="flex flex-row justify-between text-3xl border p-3 items-center rounded">
        <div className="font-bold">{room?.name}</div>
        <div>{room?.id}</div>
      </div>
      {/* Dropdown devices list */}
      <RoomDevices roomId={roomId} />
    </div>
  );
}
