import { Link } from "react-router-dom";
import { logoutUser } from "../api/authApi";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="bg-slate-800 border-b border-slate-700 text-slate-300 p-4 flex justify-between items-center">
      <div className="flex gap-4 items-center">
        <Link to="/" className="hover:text-white transition font-medium">
          {t("nav.home")}
        </Link>
        <Link to="/login" className="hover:text-white transition font-medium">
          {t("nav.login")}
        </Link>
        <Link
          to="/register"
          className="hover:text-white transition font-medium"
        >
          {t("nav.register")}
        </Link>
        <button
          onClick={logoutUser}
          className="hover:text-red-400 transition cursor-pointer"
        >
          {t("nav.logout")}
        </button>
      </div>

      {/* Przełącznik języków PL / EN */}
      <div className="flex gap-2 text-xs font-bold">
        <button
          onClick={() => changeLanguage("pl")}
          className={`px-2.5 py-1 rounded transition ${
            i18n.language === "pl"
              ? "bg-blue-600 text-white"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          PL
        </button>
        <button
          onClick={() => changeLanguage("en")}
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
