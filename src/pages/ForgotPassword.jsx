/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      await axios.post(`http://localhost:8080/auth/forgot-password`, null, {
        params: { email },
      });
      setStatus("success");
    } catch (err) {
      console.error("Şifre sıfırlama isteği başarısız:", err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-4">
          {t("forgot.title")}
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          {t("forgot.subtitle")}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("forgot.placeholder")}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
          >
            {loading ? t("forgot.loading") : t("forgot.button")}
          </button>
        </form>

        {/* Durum Mesajları */}
        {status === "success" && (
          <p className="mt-4 text-sm text-green-600 text-center">
            ✅ {t("forgot.success") || "E-posta adresinize sıfırlama bağlantısı gönderildi."}
          </p>
        )}

        {status === "error" && (
          <p className="mt-4 text-sm text-red-600 text-center">
            ❌ {t("forgot.error")}
          </p>
        )}
      </div>
    </div>
  );
}
