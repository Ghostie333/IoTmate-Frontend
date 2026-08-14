import { useTranslation } from "react-i18next";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold text-white">{t("home.title")}</h1>
      <p className="mt-3 text-slate-400">{t("home.welcome")}</p>
    </div>
  );
}