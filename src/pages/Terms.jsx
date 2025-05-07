import React from "react";
import { useTranslation } from "react-i18next";

export default function Terms() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen px-4 py-10 ">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">
          {t("footer.terms")}
        </h1>

        <p className="text-gray-700 whitespace-pre-line leading-relaxed text-sm md:text-base space-y-4">
          {t("terms.content")}
        </p>
      </div>
    </div>
  );
}
