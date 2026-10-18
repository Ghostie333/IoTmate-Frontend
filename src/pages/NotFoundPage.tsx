import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <h1 className="text-5xl font-bold text-white">404</h1>
      <p className="text-slate-400">{t("errors.pageNotFound")}</p>
      <Link
        to="/"
        className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-500"
      >
        {t("nav.home")}
      </Link>
    </div>
  );
}
