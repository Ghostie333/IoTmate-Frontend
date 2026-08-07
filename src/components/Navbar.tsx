import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { logoutUser } from "../api/authApi";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  const linkClass =
    "hover:text-white transition font-medium";

  return (
    <nav className="flex items-center justify-between border-b border-slate-700 bg-slate-800 p-4 text-slate-300">
      <div className="flex items-center gap-4">
        <Link to="/" className={linkClass}>
          {t("nav.home")}
        </Link>
        <Link to="/rooms" className={linkClass}>
          {t("nav.rooms")}
        </Link>
        <Link to="/login" className={linkClass}>
          {t("nav.login")}
        </Link>
        <Link to="/register" className={linkClass}>
          {t("nav.register")}
        </Link>
        <button
          onClick={handleLogout}
          className="cursor-pointer transition hover:text-red-400"
        >
          {t("nav.logout")}
        </button>
      </div>

      {/* Language switch */}
      <div className="flex gap-2 text-xs font-bold">
        <button
          onClick={() => i18n.changeLanguage("pl")}
          className={`px-2.5 py-1 rounded transition ${
            i18n.language === "pl"
              ? "bg-blue-600 text-white"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          PL
        </button>
        <button
          onClick={() => i18n.changeLanguage("en")}
          className={`px-2.5 py-1 rounded transition ${
            i18n.language === "en"
              ? "bg-blue-600 text-white"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          EN
        </button>
      </div>
    </nav>
  );
}