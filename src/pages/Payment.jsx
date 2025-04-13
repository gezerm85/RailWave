import { useLocation, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Lottie from "lottie-react";
import successAnimation from "../assets/lottie/check .json";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { journey, seat, passenger } = state || {}; 

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [showModal, setShowModal] = useState(false);

  const { addTicket } = useAuth();

  const handlePayment = async (e) => {
    e.preventDefault();
  
    try {
      const ticketPayload = {
        tripId: journey.id,
        seatNumber: seat,
      };
  
      const res = await axios.post("http://localhost:8080/tickets/", ticketPayload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      console.log("🎟️ Bilet başarıyla oluşturuldu:", res.data);
  
      setShowModal(true);
  
      const pnr = generatePNR();
  
      const ticketData = {
        id: res.data.id, 
        from: journey.departureStation.name,
        to: journey.arrivalStation.name,
        time: journey.departureTime,
        seat,
        passenger,
        date: new Date().toISOString().split("T")[0],
      };
  
      addTicket(ticketData);
  
      setTimeout(() => {
        navigate("/ticket", {
          state: {
            ticketId: res.data.id,
            journey,
            seat,
            passenger,
            pnr,
          },
        });
      }, 2500);
    } catch (err) {
      console.error("❌ Bilet oluşturulamadı:", err);
      alert("Ödeme başarısız. Lütfen tekrar deneyin.");
    }
  };
  
  

  const generatePNR = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from({ length: 6 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");
  };

  const formatCardNumber = (value) => {
    return value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19);
  };

  const formatCVV = (value) => {
    return value.replace(/\D/g, "").slice(0, 3);
  };

  const formatExpiry = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 4);
    if (cleaned.length < 3) return cleaned;
    return cleaned.slice(0, 2) + "/" + cleaned.slice(2);
  };

  if (!journey || !seat || !passenger) {
    return <p className="text-center mt-10 text-red-600">Ödeme için bilgi eksik.</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4 py-10">
      <div className="max-w-xl mx-auto bg-white/90 backdrop-blur-lg p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-blue-800 text-center mb-2">Ödeme Yap</h2>
        <p className="text-center text-gray-600 mb-6">
          Sefer ve yolcu bilgilerini kontrol edin, ardından ödeme bilgilerinizi girin.
        </p>

        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
          <h3 className="text-md font-semibold text-gray-800 mb-1">📍 Sefer:</h3>
          <p className="text-sm text-gray-700">
            {journey.departure} → {journey.arrival} - {journey.time} ({journey.price}₺)
          </p>
          <p className="text-sm text-gray-700">🎫 Koltuk No: {seat}</p>

          <h3 className="text-md font-semibold text-gray-800 mt-4 mb-1">👤 Yolcu:</h3>
          <p className="text-sm text-gray-700">
            {passenger.name} {passenger.surname} - {passenger.email}
          </p>
        </div>

        <form onSubmit={handlePayment} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">Kart Numarası</label>
            <input
              type="text"
              placeholder="XXXX XXXX XXXX XXXX"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">Kart Üzerindeki İsim</label>
            <input
              type="text"
              placeholder="Ad Soyad"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1 flex flex-col space-y-2">
              <label className="text-sm font-medium text-gray-700">Son Kullanma</label>
              <input
                type="text"
                placeholder="AA/YY"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex-1 flex flex-col space-y-2">
              <label className="text-sm font-medium text-gray-700">CVV</label>
              <input
                type="text"
                placeholder="CVV"
                value={cvv}
                onChange={(e) => setCvv(formatCVV(e.target.value))}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            💳 Ödemeyi Tamamla
          </button>
        </form>
      </div>


      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl px-8 py-6 flex flex-col items-center w-[300px]">
            <Lottie animationData={successAnimation} loop={false} style={{ width: 160, height: 160 }} />
            <p className="text-2xl font-bold text-green-600 mt-2">Ödeme Başarılı!</p>
            <p className="text-sm text-gray-500 mt-1 text-center">Bilet ekranına yönlendiriliyorsunuz...</p>
          </div>
        </div>
      )}
    </div>
  );
}
