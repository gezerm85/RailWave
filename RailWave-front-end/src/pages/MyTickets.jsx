import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function MyTickets() {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);

  const token = localStorage.getItem("token");

  const { t } = useTranslation();

  useEffect(() => {
    if (!token) return;

    axios
      .get("http://localhost:8080/tickets/my-tickets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("gelen veri", res.data);
        setTickets(res.data);

        console.log("----->",res.data);

      })
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
      alert(t("tickets.deleteError"));
    }
  };

  const renderStatus = (status) => {
    if (status === "ACCEPTED") return <span className="text-green-600">{t("tickets.accepted")}</span>;
    if (status === "PENDING" || status === null) return <span className="text-green-600">{t("tickets.accepted")}</span>;
    return <span className="text-gray-500">{t("tickets.unknown")}</span>;
  };

  const formatTime = (timeString) => {
    const [hour, minute] = timeString.split(":");
    return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
  };

  if (!isLoggedIn || user?.role?.toUpperCase() !== "USER") {
    return <div className="text-center text-red-600 py-10">{t("tickets.onlyUsers")}</div>;
  }

  if (!tickets || tickets.length === 0) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">{t("tickets.empty")}</div>;
  }

  return (
    <div className="min-h-screen  px-4 py-10">
      <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">{t("tickets.title")}</h2>

      <div className="max-w-3xl mx-auto grid gap-4">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-white rounded-lg p-4 shadow border-l-4 border-blue-600 hover:shadow-lg transition"
          >
            <div
              className="cursor-pointer"
              onClick={() => navigate(`/ticket/${ticket.id}`, { state: { ticket } })}
            >
              <p className="text-gray-800">
                <strong>{t("tickets.trip")}</strong> {ticket.trip.departureStation.city} → {ticket.trip.arrivalStation.city}
              </p>
              <p className="text-gray-600">
                <strong>{t("tickets.train")}</strong> {ticket.trip.train.name}
              </p>
              <p className="text-gray-600">
                <strong>{t("tickets.departure")}</strong> {ticket.trip.departureDate} - {formatTime(ticket.trip.departureTime)}
              </p>
              <p className="text-gray-600">
                <strong>{t("tickets.arrival")}</strong> {ticket.trip.arrivalDate} - {formatTime(ticket.trip.arrivalTime)}
              </p>
              <p className="text-gray-600">
                <strong>{t("tickets.seat")}</strong> {ticket.seatNumber}
              </p>
              <p className="text-gray-600">
                <strong>{t("tickets.status")}</strong> {renderStatus(ticket.status)}
              </p>
              <p className="text-blue-700 font-semibold mt-1">
                {t("tickets.pnr")} {ticket.id}
              </p>
            </div>

            <button
              onClick={() => handleDelete(ticket.id)}
              className="mt-3 text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
            >
              {t("adminTickets.refund")}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}