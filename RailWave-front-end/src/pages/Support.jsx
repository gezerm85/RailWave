import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import emailjs from "@emailjs/browser";

export default function Support() {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    emailjs
      .send(
        "service_pi4sill",
        "template_s8bd4ck",
        {
          from_name: form.name,
          from_email: form.email,
          phone: form.phone,        
          message: form.message,
        },
        "dIkoCzQIUIDRnhyh3"
      )
      .then(() => {
        setShowModal(true);
        setTimeout(() => setShowModal(false), 2000);
        setForm({ name: "", email: "", phone: "", message: "" });
      })
      .catch((err) => {
        console.error("Email gönderme hatası:", err);
        alert("Mesaj gönderilemedi.");
      });
  };
  

  return (
    <div className="min-h-screen px-4 py-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-800 mb-4">
        {t("footer.support")}
      </h1>
      <p className="text-white mb-8">{t("support.content")}</p>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white shadow-md rounded-lg p-6 border border-gray-200"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t("support.name")}
          </label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t("support.email")}
          </label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t("support.phone")}
          </label>
          <input
            type="text"
            name="phone"
            required
            maxLength={11}
            pattern="[0-9]{11}"
            value={form.phone}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="05XXXXXXXXX"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t("support.message")}
          </label>
          <textarea
            name="message"
            rows="5"
            required
            value={form.message}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {t("support.send")}
        </button>
      </form>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl px-6 py-5 max-w-sm w-full text-center">
            <h2 className="text-xl font-semibold text-green-600 mb-2">
              ✅ {t("support.success")}
            </h2>
            <p className="text-gray-600 text-sm">{t("support.followup")}</p>
          </div>
        </div>
      )}
    </div>
  );
}
