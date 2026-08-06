import { useEffect, useState } from "react";
import { GetUserRooms, type Room } from "../../api/roomApi";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    GetUserRooms()
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 401) throw new Error("Nie jesteś zalogowany.");
          throw new Error(`Błąd serwera (${res.status})`);
        }
        setRooms(await res.json());
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-slate-400">Ładowanie…</div>;

  if (error) return <div className="p-8 text-red-400">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold text-white">Twoje pokoje</h1>

      {rooms.length === 0 ? (
        <p className="text-slate-400">Nie masz jeszcze żadnych pokoi.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="rounded-xl border border-slate-800 bg-slate-800/60 p-5"
            >
              <h2 className="text-lg font-semibold text-white">{room.name}</h2>
              <p className="mt-1 text-sm text-slate-400">
                Strefa: {room.timeZoneId}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Utworzono: {new Date(room.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
