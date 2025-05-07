import { useLocation, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function PassengerInfo() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const journey = state?.journey;
  const seats = state?.seats || [];
  const passengers = state?.passengers || 1;
  const { t } = useTranslation();

  const [passengerList, setPassengerList] = useState(
    seats.map(() => ({ name: "", surname: "", email: "" }))
  );
  const [error, setError] = useState("");

  const updatePassenger = (index, newData) => {
    const updated = [...passengerList];
    updated[index] = newData;
    setPassengerList(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = passengerList.every(
      (p) => p.name && p.surname && p.email
    );

    if (!isValid) {
      setError(t("passenger.error"));
      return;
    }

    setError("");

    navigate("/payment", {
      state: {
        journey,
        seats,
        passengers,
        passengerList,
      },
    });
  };

  if (!journey || !seats.length) {
    return (
      <p className="text-center mt-10 text-red-600">
        {t("passenger.missingInfo")}
      </p>
    );
  }

  const totalPrice = journey.price * passengers;

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-screen-xl mx-auto bg-white/50 p-6 rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-blue-800 text-center">
          🧍‍♂️ {t("passenger.title")}
        </h2>

        <p className="mb-6 text-gray-600 text-center">
          {journey.departureStation?.city} → {journey.arrivalStation?.city} <br />
          {t("passenger.time")} : {journey.departureTime} → {journey.arrivalTime} <br />
          {t("passenger.price")} : <strong>{totalPrice}₺</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-3 gap-6">
            {passengerList.map((p, i) => (
              <div
                key={i}
                className="bg-white border border-gray-300 shadow-md h-full p-4 rounded-lg flex flex-col"
              >
                <h3 className="font-semibold mb-2">
                  {t("ticket.passenger")} {i + 1} — {t("passenger.seat")} : {seats[i]}
                </h3>
                <input
                  type="text"
                  placeholder={t("passenger.name")}
                  value={p.name}
                  onChange={(e) =>
                    updatePassenger(i, { ...p, name: e.target.value })
                  }
                  required
                  className="w-full mb-2 px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder={t("passenger.surname")}
                  value={p.surname}
                  onChange={(e) =>
                    updatePassenger(i, { ...p, surname: e.target.value })
                  }
                  required
                  className="w-full mb-2 px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                />
                <input
                  type="email"
                  placeholder={t("passenger.email")}
                  value={p.email}
                  onChange={(e) =>
                    updatePassenger(i, { ...p, email: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                />
              </div>
            ))}
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            💳 {t("passenger.continue")}
          </button>
        </form>
      </div>
    </div>
  );
}
