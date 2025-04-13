import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

const stationSchema = z.object({
  name: z.string().min(2, "İstasyon adı en az 2 karakter olmalı"),
  city: z.string().min(2, "Şehir seçimi zorunludur")
});

export default function Stations() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [stations, setStations] = useState([]);

  const cities = [
    "İstanbul", "Ankara", "İzmir", "Bursa", "Eskişehir", "Konya",
    "Adana", "Antalya", "Gaziantep", "Samsun", "Kayseri", "Trabzon",
    "Diyarbakır", "Mersin", "Malatya", "Erzurum", "Sakarya", "Kocaeli",
    "Denizli", "Şanlıurfa"
  ];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ resolver: zodResolver(stationSchema) });

  useEffect(() => {
    if (!user || user.role !== "ADMIN") navigate("/");
  }, [user, navigate]);

  const fetchStations = async () => {
    try {
      const res = await axios.get("http://localhost:8080/stations/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStations(res.data);
    } catch (err) {
      console.error("İstasyonlar alınamadı:", err);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const onSubmit = async (data) => {
    try {
      await axios.post("http://localhost:8080/stations/", data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchStations();
      reset();
    } catch (err) {
      console.error("İstasyon eklenemedi:", err);
      alert("İstasyon eklenemedi. Bilgileri kontrol edin.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/stations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchStations();
    } catch (err) {
      console.error("Silme hatası:", err);
      alert("İstasyon silinemedi.");
    }
  };

  const sectionStyle = "bg-white/90 backdrop-blur-md rounded-xl shadow-xl p-6 space-y-6";
  const titleStyle = "text-xl font-semibold text-blue-700 mb-2";
  const inputStyle = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 py-10">
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-10">
        🚉 İstasyon Yönetimi
      </h1>

      <div className="max-w-xl mx-auto">
        <div className={sectionStyle}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">İstasyon Adı</label>
              <input
                className={inputStyle}
                type="text"
                placeholder="İstasyon Adı"
                {...register("name")}
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Şehir</label>
              <select
                className={inputStyle}
                {...register("city")}
              >
                <option value="">Şehir seç</option>
                {cities.map((city, index) => (
                  <option key={index} value={city}>{city}</option>
                ))}
              </select>
              {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              ➕ Ekle
            </button>
          </form>

          <div className="mt-6">
            <h3 className="text-md font-semibold text-gray-700 mb-2">📋 Kayıtlı İstasyonlar</h3>
            {stations.length > 0 ? (
              <ul className="text-sm text-gray-800 list-disc list-inside space-y-1">
                {stations.map((s) => (
                  <li key={s.id} className="flex justify-between items-center">
                    <span className={titleStyle}>{s.name} - {s.city}</span>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="text-red-600 hover:underline text-xs"
                    >
                      Sil
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">Henüz istasyon eklenmedi.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}