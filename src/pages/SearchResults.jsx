/* eslint-disable react-hooks/exhaustive-deps */
import { useSearchParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function SearchResults() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const from = params.get("from");
  const to = params.get("to");
  const date = params.get("date");        
  const time = params.get("time");        
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
    const departureDate = `${date}T${time}:00`; 

    try {
      const res = await axios.get("http://localhost:8080/trips/search", {
        params: {
          departureStationId: from,
          arrivalStationId: to,
          departureDate,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTrips(res.data);
    } catch (err) {
      console.error("Seferler alınamadı:", err);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  useEffect(() => {
    if (from && to && date && time) {
      fetchTrips();
    }
  }, [from, to, date, time]);

  const getStationName = (id) => {
    const found = stations.find((s) => s.id === parseInt(id));
    return found ? `${found.city} (${found.name})` : `ID ${id}`;
  };

  return (
    <div className="min-h-screen px-4 py-10 bg-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">
        {getStationName(from)} → {getStationName(to)} | {date} {time} | {passengers} Yolcu
      </h2>

      {trips.length > 0 ? (
        <div className="grid gap-6 max-w-3xl mx-auto">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white rounded-lg shadow-md p-5 flex justify-between items-center"
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {trip.departureTime.slice(11, 16)} Treni
                </h3>
                <p className="text-gray-600">
                  Kalkış: {trip.departureStation.name} | Varış: {trip.arrivalStation.name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-700">
                  {trip.price}₺
                </p>
                <button
                  onClick={() =>
                    navigate("/seat-selection", {
                      state: { journey: trip, passengers },
                    })
                  }
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Seç
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 mt-10">Uygun sefer bulunamadı.</p>
      )}
    </div>
  );
}
