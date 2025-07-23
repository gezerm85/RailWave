/* eslint-disable react-hooks/exhaustive-deps */
import { useSearchParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

export default function SearchResults() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { t } = useTranslation();

  const from = params.get("from");
  const to = params.get("to");
  const date = params.get("date");
  const passengers = params.get("passengers");

  const [trips, setTrips] = useState([]);
  const [stations, setStations] = useState([]);

  const fetchStations = async () => {
    try {
      const res = await axios.get("http://localhost:8080/stations/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStations(res.data);
    } catch (err) {
      console.error("İstasyonlar alınamadı:", err);
    }
  };

  const fetchTrips = async () => {
    try {
      const res = await axios.get("http://localhost:8080/trips/search", {
        params: {
          departureStationId: from,
          arrivalStationId: to,
          departureDate: date,
        },
        headers: {
          Authorization: `Bearer ${token}` },
      });
      console.log("Gelen Seferler:", res.data);
      setTrips(res.data);
    } catch (err) {
      console.error("Seferler alınamadı:", err);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  useEffect(() => {
    if (from && to && date) {
      fetchTrips();
    }
  }, [from, to, date]);

  const getStationName = (id) => {
    const found = stations.find((s) => s.id === parseInt(id));
    return found ? `${found.city} (${found.name})` : `ID ${id}`;
  };

  return (
    <div className="min-h-screen px-4 py-10 ">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">
        {t("searchResult.title", {
          from: getStationName(from),
          to: getStationName(to),
          date,
          passengers,
        })}
      </h2>

      {trips.length > 0 ? (
        <div className="grid gap-6 max-w-3xl mx-auto">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white rounded-lg shadow-md p-5 flex justify-between items-center hover:shadow-lg transition"
            >
              <div className="space-y-1">
                <h3 className="text-xl font-semibold text-gray-800">
                  {trip.departureTime.slice(0, 5)} {t("searchResult.train")} – {trip.train.name}
                </h3>
                <p className="text-gray-600">
                  {t("searchResult.departure")}: {trip.departureStation.name} ({trip.departureStation.city}) <br />
                  {t("searchResult.arrival")}: {trip.arrivalStation.name} ({trip.arrivalStation.city})
                </p>
                <p className="text-sm text-gray-500">
                  {t("searchResult.schedule", {
                    departureDate: trip.departureDate,
                    departureTime: trip.departureTime.slice(0, 5),
                    arrivalDate: trip.arrivalDate,
                    arrivalTime: trip.arrivalTime.slice(0, 5),
                  })}
                </p>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold text-blue-700">
                  {t("searchResult.price", { price: trip.price })}
                </p>
                <button
                  onClick={() =>
                    navigate("/seat-selection", {
                      state: { journey: trip, passengers },
                    })
                  }
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  {t("searchResult.select")}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 mt-10">{t("searchResult.noTrips")}</p>
      )}
    </div>
  );
}
