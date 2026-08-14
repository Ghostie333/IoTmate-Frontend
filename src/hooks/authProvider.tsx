import { useEffect, useState } from "react";
import { getCurrentUser, type CurrentUser } from "../api/authApi";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      setUser(await getCurrentUser());
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    getCurrentUser()
      .then((u) => {
        if (!ignore) setUser(u);
      })
      .catch(() => {
        if (!ignore) setUser(null);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: user !== null, loading, refresh }}
    >
      {children}
    </AuthContext.Provider>
  );
}
