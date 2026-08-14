import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { logoutUser } from "../api/authApi";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isAuthenticated, refresh } = useAuth();

  const handleLogout = async () => {
    await logoutUser();
    await refresh();
    navigate("/");
  };

  const linkClass =
    "rounded-md px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800/60 hover:text-white";

  const activeLinkClass = (path: string) =>
    pathname === path
      ? "rounded-md px-3 py-2 text-sm font-medium text-white bg-slate-800/60"
      : linkClass;

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-1">
          <Link to="/" className={activeLinkClass("/")}>
            {t("nav.home")}
          </Link>
          <Link to="/rooms" className={activeLinkClass("/rooms")}>
            {t("nav.rooms")}
          </Link>
        </div>

        <div className="flex items-center gap-1">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-red-950/50 hover:text-red-400"
            >
              {t("nav.logout")}
            </button>
          ) : (
            <>
              <Link to="/login" className={activeLinkClass("/login")}>
                {t("nav.login")}
              </Link>
              <Link to="/register" className={activeLinkClass("/register")}>
                {t("nav.register")}
              </Link>
            </>
          )}
          {/* Language switch */}
          <div className="ml-2 flex gap-1">
            <button
              onClick={() => i18n.changeLanguage("pl")}
              className={`rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                i18n.language === "pl"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
              }`}
            >
              PL
            </button>
            <button
              onClick={() => i18n.changeLanguage("en")}
              className={`rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                i18n.language === "en"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
