import { useLocation, useNavigate } from "react-router-dom";
import React, { useState } from "react";

export default function PassengerInfo() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const journey = state?.journey;
  const seat = state?.seat;

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const passenger = { name, surname, email };

    navigate("/payment", {
      state: { journey, seat, passenger },
    });
  };

  if (!journey || !seat) {
    return (
      <p className="text-center mt-10 text-red-600">
        Sefer veya koltuk bilgisi eksik.
      </p>
    );
  }

  const formatTime = (isoTime) => {
    if (!isoTime) return "-";
    const date = new Date(isoTime);
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 py-10">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-blue-800 text-center">
          🧍‍♂️ Yolcu Bilgileri
        </h2>

        <p className="mb-4 text-gray-600 text-center">
          {journey.departureStation?.name} → {journey.arrivalStation?.name} <br />
          Saat: <strong>{formatTime(journey.departureTime)}</strong> - Koltuk:{" "}
          <strong>{seat}</strong> - Ücret:{" "}
          <strong>{journey.price}₺</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Ad"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Soyad"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            💳 Ödeme Sayfasına Geç
          </button>
        </form>
      </div>
    </div>
  );
}
