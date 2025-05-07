/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { HiArrowsRightLeft } from "react-icons/hi2"; 
import { useTranslation } from "react-i18next";

export default function SearchForm() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [stations, setStations] = useState([]);

  const [isSwapping, setIsSwapping] = useState(false); 

  const navigate = useNavigate();
  const { token } = useAuth();

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

  const today = new Date().toISOString().split("T")[0];
  

  
  const { t } = useTranslation();

  useEffect(() => {
    fetchStations();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const queryParams = new URLSearchParams({
      from,
      to,
      date,
      passengers,
    }).toString();

    navigate(`/search-results?${queryParams}`);
  };

  const handleSwap = () => {
    setIsSwapping(true); 
    const temp = from;
    setFrom(to);
    setTo(temp);
    setTimeout(() => {
      setIsSwapping(false); 
    }, 500); 
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/90 backdrop-blur-md p-6 md:p-8 rounded-xl shadow-xl w-full max-w-2xl space-y-6 transition-all"
    >

      <div className="flex flex-col md:flex-row gap-4 items-center">
  
        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium text-gray-700">
          {t('search.from')}
          </label>
          <select
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
              if (e.target.value === to) {
                setTo("");
              }
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">	{t('search.selectStation')}</option>
            {stations
              .filter((station) => station.id !== to)
              .map((station) => (
                <option key={station.id} value={station.id}>
                  {station.name} - {station.city}
                </option>
              ))}
          </select>
        </div>

        {/* Swap Button */}
        <button
          type="button"
          onClick={handleSwap}
          className="p-2 mt-6 rounded-full bg-gray-100 hover:bg-gray-300 transition text-3xl flex items-center justify-center"
          title="Nereden ↔ Nereye değiştir"
        >
          <HiArrowsRightLeft
            className={`transition-transform duration-500 ${
              isSwapping ? "rotate-180" : ""
            }`}
            size={28}
          />
        </button>

        {/* Nereye */}
        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium text-gray-700">
          {t('search.to')}
          </label>
          <select
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
              if (e.target.value === from) {
                setFrom("");
              }
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">	{t('search.selectStation')}</option>
            {stations
              .filter((station) => station.id !== from)
              .map((station) => (
                <option key={station.id} value={station.id}>
                  {station.name} - {station.city}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Tarih - Saat - Yolcu Sayısı */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium text-gray-700">
          {t('search.date')}
          </label>
          <input
            type="date"
            value={date}
            min={today} 
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>



        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium text-gray-700">
          {t('search.passengers')}
          </label>
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
       	{t('search.searchTicket')}
      </button>
    </form>
  );
}
