import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Ticket() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();

  const { journey, seat, passenger, pnr, ticketId } = state || {};
  const [status, setStatus] = useState("LOADING");

  useEffect(() => {
    const fetchTicketStatus = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/tickets/${ticketId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("🎟️ Ticket detail:", res.data);

        // null ise PENDING say
        const fetchedStatus = res.data.status ?? "PENDING";
        setStatus(fetchedStatus);
      } catch (err) {
        console.error("Ticket fetch error:", err);
        setStatus("UNKNOWN");
      }
    };

    if (ticketId) {
      fetchTicketStatus();
    }
  }, [ticketId, token]);

  if (!journey || !seat || !passenger || !pnr) {
    return (
      <p className="text-center text-red-600 mt-10">
        Bilet bilgisi eksik. Ana sayfaya yönlendiriliyorsunuz...
      </p>
    );
  }

  const qrData = `PNR: ${pnr}
Ad: ${passenger.name} ${passenger.surname}
Sefer: ${journey.departureStation?.name || journey.departure} → ${journey.arrivalStation?.name || journey.arrival}
Saat: ${journey.departureTime?.slice(11, 16) || journey.time}
Koltuk: ${seat}`;

  const renderStatus = () => {
    switch (status) {
      case "PENDING":
        return <span className="text-yellow-600 font-semibold">⏳ Onay Bekliyor</span>;
      case "ACCEPTED":
        return <span className="text-green-600 font-semibold">✅ Onaylandı</span>;
      default:
        return <span className="text-gray-600">Durum alınamadı</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex items-center justify-center px-4 py-10">
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-xl p-8 w-full max-w-md text-center space-y-6">
        <h2 className="text-3xl font-bold text-blue-700">🎫 Biletiniz Hazır!</h2>

        <div className="text-left text-gray-700 space-y-2 border border-blue-100 rounded-lg bg-blue-50 p-4 shadow">
          <p><strong>🚄 Sefer:</strong> {journey.departureStation?.name || journey.departure} → {journey.arrivalStation?.name || journey.arrival}</p>
          <p><strong>🕐 Saat:</strong> {journey.departureTime?.slice(11, 16) || journey.time}</p>
          <p><strong>💺 Koltuk:</strong> {seat}</p>
          <p><strong>👤 Yolcu:</strong> {passenger.name} {passenger.surname}</p>
          <p><strong>📩 E-posta:</strong> {passenger.email}</p>
          <p><strong>🎟️ PNR:</strong> <span className="text-blue-700 font-semibold">{pnr}</span></p>
          <p><strong>📌 Durum:</strong> {renderStatus()}</p>
        </div>

        <div className="flex justify-center bg-white p-4 rounded">
          <QRCode value={qrData} size={160} />
        </div>

        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition"
        >
          Ana Sayfaya Dön
        </button>
      </div>
    </div>
  );
}
