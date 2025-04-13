import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function MyTickets() {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    axios
      .get("http://localhost:8080/tickets/my-tickets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setTickets(res.data))
      .catch((err) => {
        console.error("Biletleri alırken hata:", err);
      });
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/tickets/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTickets((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Silme hatası:", err);
      alert("Bilet silinemedi.");
    }
  };

  const renderStatus = (status) => {
    if (status === "ACCEPTED") return <span className="text-green-600">✅ Onaylandı</span>;
    if (status === "PENDING" || status === null) return <span className="text-yellow-600">⏳ Onay Bekliyor</span>;
    return <span className="text-gray-500">Durum bilinmiyor</span>;
  };

  if (!isLoggedIn || user?.role?.toUpperCase() !== "USER") {
    return (
      <div className="text-center text-red-600 py-10">
        Bu sayfa sadece giriş yapan yolculara özeldir.
      </div>
    );
  }

  if (!tickets || tickets.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
        Henüz bir biletiniz bulunmuyor 🥲
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">
        🎟️ Biletlerim
      </h2>

      <div className="max-w-3xl mx-auto grid gap-4">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-white rounded-lg p-4 shadow border-l-4 border-blue-600 hover:shadow-lg transition"
          >
            <div
              className="cursor-pointer"
              onClick={() =>
                navigate(`/ticket/${ticket.id}`, { state: { ticket } })
              }
            >
              <p className="text-gray-800">
                <strong>Sefer:</strong>{" "}
                {ticket.trip.departureStation.city} →{" "}
                {ticket.trip.arrivalStation.city}
              </p>
              <p className="text-gray-600">
                <strong>Tren:</strong> {ticket.trip.train.name}
              </p>
              <p className="text-gray-600">
                <strong>Kalkış:</strong>{" "}
                {new Date(ticket.trip.departureTime).toLocaleString("tr-TR")}
              </p>
              <p className="text-gray-600">
                <strong>Varış:</strong>{" "}
                {new Date(ticket.trip.arrivalTime).toLocaleString("tr-TR")}
              </p>
              <p className="text-gray-600">
                <strong>Koltuk:</strong> {ticket.seatNumber}
              </p>
              <p className="text-gray-600">
                <strong>Durum:</strong> {renderStatus(ticket.status)}
              </p>
              <p className="text-blue-700 font-semibold mt-1">
                🎫 PNR: {ticket.id}
              </p>
            </div>

            <button
              onClick={() => handleDelete(ticket.id)}
              className="mt-3 text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
            >
              Bileti İptal Et
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
