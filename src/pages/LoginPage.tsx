import { useState } from "react";
import { loginUser } from "../api/authApi";
import type { LoginUserDto } from "../types/LoginUserDto";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginUserDto>({
    email: "",
    password: "",
    isPersistent: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("wysyłanie LoginDto: ", formData);
    const response = await loginUser(formData);

    if (response.ok) {
      console.log("Zalogowano pomyślnie!", response);
      navigate("/");
    } else {
      const errorData = await response.json().catch(() => null);
      console.log("Login error (400):", errorData || response.statusText);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-800/60 p-8 shadow-xl backdrop-blur-sm">
        <h1 className="mb-6 text-center text-2xl font-bold text-white">
          {t("auth.loginTitle")}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">
              {t("auth.email")}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="twoj@email.com"
              className="w-full rounded-lg border border-slate-700 bg-slate-950/60 p-2.5 text-slate-100 placeholder-slate-500 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">
              {t("auth.password")}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-700 bg-slate-950/60 p-2.5 text-slate-100 placeholder-slate-500 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isPersistent"
              name="isPersistent"
              checked={formData.isPersistent}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
            />
            <label
              htmlFor="isPersistent"
              className="text-sm font-medium text-slate-300 cursor-pointer select-none"
            >
              {t("auth.rememberMe")}
            </label>
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white shadow-md transition hover:bg-blue-500 active:scale-[0.98]"
          >
            {t("auth.loginBtn")}
          </button>
        </form>
      </div>
    </div>
  );
}
