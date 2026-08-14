import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRooms } from "../../hooks/useRooms";
import NewRoomForm from "./NewRoomForm";
import Modal from "../../components/Modal";

export default function RoomsPage() {
  const { t } = useTranslation();
  const { rooms, loading, error, refresh } = useRooms();
  const [formOpen, setFormOpen] = useState(false);

  if (loading)
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
        {t("rooms.loading")}
      </div>
    );

  if (error)
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-red-400">
        <p className="mb-2">{error}</p>
        <Link className="text-blue-400 underline" to="/login">
          {t("nav.login")}
        </Link>
      </div>
    );

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">
          {t("rooms.your_rooms")}
        </h1>
        <button
          onClick={() => setFormOpen(true)}
          className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-500 active:scale-[0.98]"
        >
          {t("rooms.create_room")}
        </button>
      </div>

      {/* Create room modal */}
      <Modal open={formOpen} onClose={() => setFormOpen(false)}>
        <NewRoomForm
          onRoomCreated={refresh}
          onClose={() => setFormOpen(false)}
        />
      </Modal>

      {/* Room grid */}
      {rooms.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-8 text-center text-slate-500">
          {t("rooms.you_dont_have_rooms")}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <Link
              to={room.id}
              key={room.id}
              className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-sm transition-colors hover:border-slate-700 hover:bg-slate-900/80"
            >
              <h2 className="text-lg font-semibold text-white">{room.name}</h2>
              <p className="mt-1 text-sm text-slate-400">
                {t("rooms.timezone")}: {room.timeZoneId}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {t("rooms.created_at")}:{" "}
                {new Date(room.createdAt).toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}