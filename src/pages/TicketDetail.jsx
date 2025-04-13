import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import axios from "axios";

export default function TicketDetail() {
  const { state } = useLocation();
  const { ticket } = state || {};
  const navigate = useNavigate();

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const token = localStorage.getItem("token");

  if (!ticket) {
    return <p className="text-center mt-10 text-red-600">Bilet bulunamadı.</p>;
  }

  const handleDelete = async () => {
    if (!window.confirm("Bileti iptal etmek istediğinize emin misiniz?")) return;

    setIsDeleting(true);

    try {
      await axios.delete(`http://localhost:8080/tickets/${ticket.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDeleted(true);

      setTimeout(() => {
        navigate("/tickets");
      }, 2000);
    } catch (err) {
      console.error("❌ Bilet silinemedi:", err);
      alert("Bilet iptal edilemedi.");
    } finally {
      setIsDeleting(false);
    }
  };

  const renderStatus = () => {
    const status = ticket.status;
    if (status === "ACCEPTED") return <span className="text-green-600 font-semibold">✅ Onaylandı</span>;
    if (status === "PENDING" || status === null) return <span className="text-yellow-600 font-semibold">⏳ Onay Bekliyor</span>;
    return <span className="text-gray-500">Durum bilinmiyor</span>;
  };

  const qrValue = `PNR: ${ticket.id}\nSefer: ${ticket.trip.departureStation?.name} → ${ticket.trip.arrivalStation?.name}\nTarih: ${ticket.trip.departureTime?.slice(0, 10)} Saat: ${ticket.trip.departureTime?.slice(11, 16)}\nKoltuk: ${ticket.seatNumber}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-xl shadow-lg p-6 text-center space-y-4 max-w-md w-full">
        <h2 className="text-2xl font-bold text-blue-700">🎫 Bilet Detayı</h2>

        {deleted ? (
          <p className="text-green-600 font-semibold">Bilet başarıyla iptal edildi. Yönlendiriliyorsunuz...</p>
        ) : (
          <>
            <div className="text-gray-700 space-y-1 text-left">
              <p><strong>Sefer:</strong> {ticket.trip.departureStation?.name} → {ticket.trip.arrivalStation?.name}</p>
              <p><strong>Tarih:</strong> {ticket.trip.departureTime?.slice(0, 10)}</p>
              <p><strong>Saat:</strong> {ticket.trip.departureTime?.slice(11, 16)}</p>
              <p><strong>Koltuk:</strong> {ticket.seatNumber}</p>
              <p><strong>Durum:</strong> {renderStatus()}</p>
              <p><strong>PNR:</strong> <span className="text-blue-700 font-semibold">{ticket.id}</span></p>
            </div>

            <div className="flex justify-center bg-white p-4 rounded">
              <QRCode value={qrValue} size={150} />
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {isDeleting ? "İptal Ediliyor..." : "🗑️ Bileti İptal Et"}
              </button>

              <button
                onClick={() => navigate("/tickets")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Biletlerime Dön
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
