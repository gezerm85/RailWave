/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

const tripSchema = z.object({
  trainId: z.string().min(1, "Tren seçilmelidir."),
  departureStationId: z.string().min(1, "Kalkış istasyonu seçilmelidir."),
  arrivalStationId: z.string().min(1, "Varış istasyonu seçilmelidir."),
  departureTime: z.string().min(1, "Kalkış zamanı zorunludur."),
  arrivalTime: z.string().min(1, "Varış zamanı zorunludur."),
  price: z
    .string()
    .min(1, "Fiyat zorunludur.")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Fiyat geçerli bir sayı olmalı."
    })
});

export default function Trips() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [stations, setStations] = useState([]);
  const [trains, setTrains] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(tripSchema)
  });

  useEffect(() => {
    if (!user || user.role !== "ADMIN") navigate("/");
  }, [user, navigate]);

  const fetchAll = async () => {
    try {
      const [tripsRes, stationsRes, trainsRes] = await Promise.all([
        axios.get("http://localhost:8080/trips/", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("http://localhost:8080/stations/", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("http://localhost:8080/trains/", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setTrips(tripsRes.data);
      setStations(stationsRes.data);
      setTrains(trainsRes.data);
    } catch (err) {
      console.error("Veriler alınamadı:", err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        trainId: parseInt(data.trainId),
        departureStationId: parseInt(data.departureStationId),
        arrivalStationId: parseInt(data.arrivalStationId),
        price: parseFloat(data.price)
      };

      await axios.post("http://localhost:8080/trips/", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAll();
      reset();
    } catch (err) {
      console.error("Sefer eklenemedi:", err);
      alert("Sefer eklenemedi, bilgileri kontrol edin.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/trips/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAll();
    } catch (err) {
      console.error("Silme hatası:", err);
      alert("Sefer silinemedi.");
    }
  };

  const sectionStyle = "bg-white/90 backdrop-blur-md rounded-xl shadow-xl p-6 space-y-6";
  const inputStyle = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 py-10">
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-10">
        🧭 Sefer Yönetimi
      </h1>

      <div className="max-w-xl mx-auto">
        <div className={sectionStyle}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <select className={inputStyle} {...register("trainId")}>
              <option value="">Tren Seç</option>
              {trains.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            {errors.trainId && <p className="text-red-600 text-sm">{errors.trainId.message}</p>}

            <select className={inputStyle} {...register("departureStationId")}>              
              <option value="">Kalkış İstasyonu</option>
              {stations.map((s) => (
                <option key={s.id} value={s.id}>{s.name} - {s.city}</option>
              ))}
            </select>
            {errors.departureStationId && <p className="text-red-600 text-sm">{errors.departureStationId.message}</p>}

            <select className={inputStyle} {...register("arrivalStationId")}>              
              <option value="">Varış İstasyonu</option>
              {stations.map((s) => (
                <option key={s.id} value={s.id}>{s.name} - {s.city}</option>
              ))}
            </select>
            {errors.arrivalStationId && <p className="text-red-600 text-sm">{errors.arrivalStationId.message}</p>}

            <input className={inputStyle} type="datetime-local" {...register("departureTime")} />
            {errors.departureTime && <p className="text-red-600 text-sm">{errors.departureTime.message}</p>}

            <input className={inputStyle} type="datetime-local" {...register("arrivalTime")} />
            {errors.arrivalTime && <p className="text-red-600 text-sm">{errors.arrivalTime.message}</p>}

            <input className={inputStyle} type="number" step="0.01" placeholder="Fiyat" {...register("price")} />
            {errors.price && <p className="text-red-600 text-sm">{errors.price.message}</p>}

            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
              ➕ Ekle
            </button>
          </form>

          <div className="mt-6">
            <h3 className="text-md font-semibold text-gray-700 mb-2">📋 Sefer Listesi</h3>
            {trips.length > 0 ? (
              <ul className="text-sm text-gray-800 space-y-4">
                {trips.map((t) => (
                  <li key={t.id} className="flex flex-col border-b pb-3">
                    <span className="text-blue-900 font-medium">
                      🚆 Tren {t.train?.name} — {t.departureStation?.name} → {t.arrivalStation?.name}
                    </span>
                    <span className="text-blue-700">
                      🕓 {new Date(t.departureTime).toLocaleString()} - {new Date(t.arrivalTime).toLocaleString()} — {t.price}₺
                    </span>
                    <button onClick={() => handleDelete(t.id)} className="text-red-600 hover:underline text-xs self-end mt-1">Sil</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">Henüz sefer eklenmedi.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
