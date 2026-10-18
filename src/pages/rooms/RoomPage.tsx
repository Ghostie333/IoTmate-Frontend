import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRoom } from "../../hooks/useRoom";
import { RoomDevices } from "../devices/RoomDevices";
import { RoomRules } from "../rules/RoomRules";

export default function RoomPage() {
  const { roomId } = useParams();
  const { t } = useTranslation();
  const { room, loading: roomLoading, error: roomError } = useRoom(roomId);

  if (roomLoading)
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
        {t("rooms.loading")}
      </div>
    );

  if (roomError)
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-red-400">
        <p className="mb-2">{roomError}</p>
        <Link className="text-blue-400 underline" to="/login">
          {t("nav.login")}
        </Link>
      </div>
    );

  return (
    <div>
      {/* Header (room name and id) */}
      <div className="mb-6 flex flex-row items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-6 py-4">
        <div className="text-xl font-bold text-white">{room?.name}</div>
        <div className="font-mono text-xs text-slate-500">{room?.id}</div>
      </div>

      {/* Dropdown devices list */}
      <RoomDevices roomId={roomId} />

      {/* Dropdown rules list */}
      <RoomRules roomId={roomId} />
    </div>
  );
}
