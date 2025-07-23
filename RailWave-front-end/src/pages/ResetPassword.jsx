import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      await axios.post(`http://localhost:8080/auth/reset-password`, null, {
        params: { token, newPassword: password },
      });
      setStatus("success");
      navigate("/login")
    } catch (err) {
      console.error("Şifre yenileme başarısız:", err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-4">
          {t("reset.title")}
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          {t("reset.subtitle")}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("reset.placeholder")}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
          >
            {loading ? t("reset.loading") : t("reset.button")}
          </button>
        </form>

        {status === "success" && (
          <p className="mt-4 text-sm text-green-600 text-center">
            ✅ {t("reset.success")}
          </p>
        )}
        {status === "error" && (
          <p className="mt-4 text-sm text-red-600 text-center">
            ❌ {t("reset.error")}
          </p>
        )}
      </div>
    </div>
  );
}
