// src/pages/Trips.jsx
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Trips() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [stations, setStations] = useState([]);
  const [trains, setTrains] = useState([]);
  const { t } = useTranslation();

  // Helper to get local YYYY-MM-DD for date inputs
  const getCurrentDateLocal = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const local = new Date(now.getTime() - offset * 60000);
    return local.toISOString().slice(0, 10);
  };
  const todayDate = getCurrentDateLocal();

  // Set up form and schema
  const tripSchema = z
    .object({
      trainId: z.string().min(1, { message: t("trips.trainRequired") }),
      departureStationId: z
        .string()
        .min(1, { message: t("trips.departureRequired") }),
      arrivalStationId: z
        .string()
        .min(1, { message: t("trips.arrivalRequired") }),
      departureDate: z
        .string()
        .min(1, { message: t("trips.departureDateRequired") }),
      departureTime: z
        .string()
        .min(1, { message: t("trips.departureTimeRequired") }),
      arrivalDate: z
        .string()
        .min(1, { message: t("trips.arrivalDateRequired") }),
      arrivalTime: z
        .string()
        .min(1, { message: t("trips.arrivalTimeRequired") }),
      price: z
        .string()
        .min(1, { message: t("trips.priceRequired") })
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
          message: t("trips.priceInvalid"),
        }),
    })
    // 1) Departure and arrival date cannot be identical
    .refine((data) => data.departureDate !== data.arrivalDate, {
      message: t("trips.dateNotSame"),
      path: ["arrivalDate"],
    })
    // 2) Arrival datetime must be after departure datetime
    .refine(
      (data) =>
        new Date(`${data.arrivalDate}T${data.arrivalTime}`) >
        new Date(`${data.departureDate}T${data.departureTime}`),
      {
        message: t("trips.arrivalAfterDeparture"),
        path: ["arrivalTime"],
      }
    )
    // 3) Departure and arrival stations must differ
    .refine((data) => data.departureStationId !== data.arrivalStationId, {
      message: t("trips.sameStationError"),
      path: ["arrivalStationId"],
    });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(tripSchema),
  });

  // Watch fields
  const departureStationId = watch("departureStationId");
  const departureDateWatch = watch("departureDate");

  // Compute min arrival date = departureDate + 1 day
  const getMinArrivalDate = () => {
    if (!departureDateWatch) return todayDate;
    const d = new Date(departureDateWatch);
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  };

  // Only ADMINs may access
  useEffect(() => {
    if (!user || user.role !== "ADMIN") navigate("/");
  }, [user, navigate]);

  // Fetch trips, stations, trains
  const fetchAll = async () => {
    try {
      const [tripsRes, stationsRes, trainsRes] = await Promise.all([
        axios.get("http://localhost:8080/trips/", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:8080/stations/", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:8080/trains/", {
          headers: { Authorization: `Bearer ${token}` },
        }),
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

  // Submit handler
  const onSubmit = async (data) => {
    try {
      const payload = {
        trainId: parseInt(data.trainId, 10),
        departureStationId: parseInt(data.departureStationId, 10),
        arrivalStationId: parseInt(data.arrivalStationId, 10),
        departureDate: data.departureDate,
        departureTime: data.departureTime, // string: "HH:mm"
        arrivalDate: data.arrivalDate,
        arrivalTime: data.arrivalTime, // string: "HH:mm"
        price: parseFloat(data.price),
      };

      await axios.post("http://localhost:8080/trips/", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAll();
      reset();
    } catch (err) {
      console.error("Sefer eklenemedi:", err);
      alert("Sefer eklenemedi, bilgileri kontrol edin.");
    }
  };

  // Delete handler
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/trips/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAll();
    } catch (err) {
      console.error("Silme hatası:", err);
      alert("Sefer silinemedi.");
    }
  };

  const sectionStyle =
    "bg-white/90 backdrop-blur-md rounded-xl shadow-xl p-6 space-y-6";
  const inputStyle =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="min-h-screen  px-4 py-10">
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-10">
        {t("trips.title")}
      </h1>

      <div className="max-w-xl mx-auto">
        <div className={sectionStyle}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <select className={inputStyle} {...register("trainId")}>
                <option value="">{t("trips.selectTrain")}</option>
                {trains.map((tr) => (
                  <option key={tr.id} value={tr.id}>
                    {tr.name}
                  </option>
                ))}
              </select>
              {errors.trainId && (
                <p className="text-red-500 text-sm">{errors.trainId.message}</p>
              )}
            </div>

            <div>
              <select
                className={inputStyle}
                {...register("departureStationId")}
              >
                <option value="">{t("trips.selectDepartureStation")}</option>
                {stations.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} – {st.city}
                  </option>
                ))}
              </select>
              {errors.departureStationId && (
                <p className="text-red-500 text-sm">
                  {errors.departureStationId.message}
                </p>
              )}
            </div>

            <div>
              <select className={inputStyle} {...register("arrivalStationId")}>
                <option value="">{t("trips.selectArrivalStation")}</option>
                {stations
                  .filter((st) => st.id.toString() !== departureStationId)
                  .map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} – {st.city}
                    </option>
                  ))}
              </select>
              {errors.arrivalStationId && (
                <p className="text-red-500 text-sm">
                  {errors.arrivalStationId.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">
                  {t("trips.departureDate")}
                </label>
                <input
                  className={inputStyle}
                  type="date"
                  min={todayDate}
                  {...register("departureDate")}
                />
                {errors.departureDate && (
                  <p className="text-red-500 text-sm">
                    {errors.departureDate.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm mb-1">
                  {t("trips.departureTime")}
                </label>
                <input
                  className={inputStyle}
                  type="time"
                  {...register("departureTime")}
                />
                {errors.departureTime && (
                  <p className="text-red-500 text-sm">
                    {errors.departureTime.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">
                  {t("trips.arrivalDate")}
                </label>
                <input
                  className={inputStyle}
                  type="date"
                  min={getMinArrivalDate()}
                  {...register("arrivalDate")}
                />
                {errors.arrivalDate && (
                  <p className="text-red-500 text-sm">
                    {errors.arrivalDate.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm mb-1">
                  {t("trips.arrivalTime")}
                </label>
                <input
                  className={inputStyle}
                  type="time"
                  {...register("arrivalTime")}
                />
                {errors.arrivalTime && (
                  <p className="text-red-500 text-sm">
                    {errors.arrivalTime.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <input
                className={inputStyle}
                type="number"
                step="0.01"
                placeholder={t("trips.pricePlaceholder")}
                {...register("price")}
              />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              {t("trips.add")}
            </button>
          </form>

          <div className="mt-6">
            <h3 className="text-md font-semibold text-gray-700 mb-4">
              {t("trips.listTitle")}
            </h3>
            {trips.length > 0 ? (
              <ul className="space-y-4">
                {trips.map((trip) => (
                  <li
                    key={trip.id}
                    className="bg-white shadow-sm rounded-lg p-4 flex justify-between items-center hover:shadow-md transition"
                  >
                    <div className="space-y-1">
                      <p className="text-lg font-semibold text-blue-700">
                        {trip.departureStation.name} (
                        {trip.departureStation.city}) →{" "}
                        {trip.arrivalStation.name} ({trip.arrivalStation.city})
                      </p>

                      <div className="text-sm text-gray-600 flex gap-6 mt-2">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{t("trips.departureLabel")}</span>
                          <span>
                            {trip.departureDate} – {trip.departureTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{t("trips.arrivalLabel")}:</span>
                          <span>
                            {trip.arrivalDate} – {trip.arrivalTime}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-800 mt-1">
                      {t("trips.priceLabel")} <strong>{trip.price} TL</strong>
                      </p>
                    </div>

                    <button
                      onClick={() => handleDelete(trip.id)}
                      className="text-red-500 hover:underline text-sm ml-4"
                    >
                      {t("trips.delete")}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">{t("trips.empty")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
