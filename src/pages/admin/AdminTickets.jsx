import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminTickets() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    if (!user || user.role !== "ADMIN") navigate("/");
  }, [user, navigate]);

  const fetchTickets = async () => {
    const test = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyQGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzQ0NTM5OTIyLCJleHAiOjE3NDQ2MjYzMjJ9.NJmuWn7jNkaoelTA1ZLN0ImDCkshi0uOqc4p4S8yoVM"
    try {
      const res = await axios.get("http://localhost:8080/tickets/my-tickets", {
        headers: { Authorization: `Bearer ${test}` },
      });
      setTickets(res.data);
    } catch (err) {
      console.error("Biletler alınırken hata: ", err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/tickets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTickets();
    } catch (err) {
      console.error("Bilet silinemedi:", err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.patch(
        `http://localhost:8080/tickets/${id}`,
        { status: "ACCEPTED" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchTickets();
    } catch (err) {
      console.error("Bilet onaylanamadı:", err);
    }
  };

  const renderStatus = (status) => {
    if (status === "ACCEPTED") return <span className="text-green-600 font-semibold">✅ Onaylandı</span>;
    if (status === "PENDING" || status === null) return <span className="text-yellow-600 font-semibold">⏳ Bekliyor</span>;
    return <span className="text-gray-500">Bilinmiyor</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">
        🎟️ Bilet Talepleri
      </h2>

      <div className="max-w-5xl mx-auto space-y-4">
        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-600"
            >
              <p>
                <strong>Kullanıcı:</strong>{" "}
                {ticket.user.firstName} {ticket.user.lastName} ({ticket.user.email})
              </p>
              <p>
                <strong>Sefer:</strong>{" "}
                {ticket.trip.departureStation.city} → {ticket.trip.arrivalStation.city}
              </p>
              <p>
                <strong>Tren:</strong> {ticket.trip.train.name} |{" "}
                <strong>Koltuk:</strong> {ticket.seatNumber}
              </p>
              <p>
                <strong>Fiyat:</strong> {ticket.trip.price} TL
              </p>
              <p>
                <strong>Durum:</strong> {renderStatus(ticket.status)}
              </p>

              {ticket.status !== "ACCEPTED" && ticket.status !== "REJECTED" && (
                <div className="mt-3 flex gap-3">
                  <button
                    onClick={() => handleApprove(ticket.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                  >
                    ✅ Onayla
                  </button>
                  <button
                    onClick={() => handleDelete(ticket.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                  >
                    🗑️ İptal Et
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Bekleyen bilet talebi bulunmuyor.</p>
        )}
      </div>
    </div>
  );
}
