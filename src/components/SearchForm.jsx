/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function SearchForm() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [stations, setStations] = useState([]);
  const [time, setTime] = useState("");

  const navigate = useNavigate();

  const { token } = useAuth();

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
    }, [])

  const handleSubmit = (e) => {
    e.preventDefault();

    const queryParams = new URLSearchParams({
      from,
      to,
      date,
      time, 
      passengers,
    }).toString();
    
    navigate(`/search-results?${queryParams}`);
    
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/90 backdrop-blur-md p-6 md:p-8 rounded-xl shadow-xl w-full max-w-2xl space-y-6 transition-all"
    >
      {/* Nereden - Nereye */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium text-gray-700">Nereden</label>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">İstasyon seç</option>
            {stations.map((station) => (
              <option key={station.id} value={station.id}>
                {station.name} - {station.city}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium text-gray-700">Nereye</label>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">İstasyon seç</option>
            {stations.map((station) => (
              <option key={station.id} value={station.id}>
                {station.name} - {station.city}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tarih - Yolcu Sayısı */}
      <div className="flex flex-col md:flex-row gap-4">
  <div className="flex-1">
    <label className="block mb-1 text-sm font-medium text-gray-700">Tarih</label>
    <input
      type="date"
      value={date}
      onChange={(e) => setDate(e.target.value)}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>

  <div className="flex-1">
    <label className="block mb-1 text-sm font-medium text-gray-700">Saat</label>
    <input
      type="time"
      value={time}
      onChange={(e) => setTime(e.target.value)}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>

  <div className="flex-1">
    <label className="block mb-1 text-sm font-medium text-gray-700">Yolcu Sayısı</label>
    <input
      type="number"
      min="1"
      value={passengers}
      onChange={(e) => setPassengers(e.target.value)}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>
</div>

      {/* Submit Buton */}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
      >
        🚄 Bilet Ara
      </button>
    </form>
  );
}
