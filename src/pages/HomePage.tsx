import { useTranslation } from "react-i18next";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white">{t("home.title")}</h1>
      <p className="mt-2 text-slate-300">{t("home.welcome")}</p>
    </div>
  );
}