/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

const trainSchema = z.object({
  name: z.string().min(2, "Tren adı en az 2 karakter olmalıdır."),
  seatCount: z
    .number({ invalid_type_error: "Koltuk sayısı zorunludur." })
    .min(1, "Koltuk sayısı en az 1 olmalı")
});

export default function Trains() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [trains, setTrains] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(trainSchema)
  });

  useEffect(() => {
    if (!user || user.role !== "ADMIN") navigate("/");
  }, [user, navigate]);

  const fetchTrains = async () => {
    try {
      const res = await axios.get("http://localhost:8080/trains/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTrains(res.data);
    } catch (err) {
      console.error("Trenleri alırken hata oluştu:", err);
    }
  };

  useEffect(() => {
    fetchTrains();
  }, []);

  const onSubmit = async (data) => {
    try {
      await axios.post("http://localhost:8080/trains/", data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTrains();
      reset();
    } catch (err) {
      console.error("Tren eklenemedi:", err);
      alert("Tren eklenemedi, bilgileri kontrol edin.");
    }
  };

  const handleDeleteTrain = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/trains/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTrains();
    } catch (err) {
      console.error("Silme hatası:", err);
      alert("Tren silinemedi.");
    }
  };

  const sectionStyle =
    "bg-white/90 backdrop-blur-md rounded-xl shadow-xl p-6 space-y-6";
  const titleStyle = "text-xl font-semibold text-blue-700 mb-2";
  const inputStyle =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 py-10">
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-10">
        🚆 Tren Yönetimi
      </h1>

      <div className="max-w-xl mx-auto">
        <div className={sectionStyle}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tren Adı</label>
              <input
                className={inputStyle}
                type="text"
                placeholder="Tren Adı"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Koltuk Sayısı</label>
              <input
                className={inputStyle}
                type="number"
                placeholder="0"
                {...register("seatCount", { valueAsNumber: true })}
              />
              {errors.seatCount && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.seatCount.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              ➕ Ekle
            </button>
          </form>

          <div className="mt-6">
            <h3 className="text-md font-semibold text-gray-700 mb-2">📋 Kayıtlı Trenler</h3>
            {trains.length > 0 ? (
              <ul className="text-sm text-gray-800 list-disc list-inside space-y-1">
                {trains.map((t) => (
                  <li key={t.id} className="flex justify-between items-center">
                    <span className={titleStyle}>{t.name} ({t.seatCount} koltuk)</span>
                    <button
                      onClick={() => handleDeleteTrain(t.id)}
                      className="text-red-600 hover:underline text-xs"
                    >
                      Sil
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">Henüz tren eklenmedi.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
