/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import emailjs from "@emailjs/browser";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function AdminTickets() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    if (!user || user.role !== "ADMIN") navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    emailjs.init("V8FK0Tg5-SPgKTUED");
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await axios.get("http://localhost:8080/tickets/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const backend = res.data;
  
      const localRefunded = JSON.parse(localStorage.getItem("refundedTickets")) || [];
  
      const map = {};
      backend.forEach((t) => (map[t.id] = t));
      localRefunded.forEach((t) => (map[t.id] = t));
  
      let combined = Object.values(map);
  
      combined = combined.sort((a, b) => {
        if (a.status === "REFUNDED" && b.status !== "REFUNDED") return 1;
        if (a.status !== "REFUNDED" && b.status === "REFUNDED") return -1;
  
        const dateA = new Date(`${a.trip.departureDate}T${a.trip.departureTime}`);
        const dateB = new Date(`${b.trip.departureDate}T${b.trip.departureTime}`);
        return dateB - dateA;
      });
  
      setTickets(combined);
    } catch (err) {
      console.error("Biletler alınırken hata:", err);
    }
  };
  

  const handleRefund = async (ticket) => {
    try {
      await axios.delete(`http://localhost:8080/tickets/${ticket.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await emailjs.send(
        "service_qc0vmaa",
        "service_pi4sill",
        {
          to_name: `${ticket.user.firstName} ${ticket.user.lastName}`,
          to_email: ticket.user.email,
          ticket_id: ticket.id,
          route: `${ticket.trip.departureStation.city} → ${ticket.trip.arrivalStation.city}`,
          datetime: `${ticket.trip.departureDate} ${ticket.trip.departureTime} → ${ticket.trip.arrivalDate} ${ticket.trip.arrivalTime}`,
          seat: ticket.seatNumber,
          price: ticket.trip.price,
          message: t("adminTickets.emailMessage"),
        },
        "dIkoCzQIUIDRnhyh3"
      );

      const stored = JSON.parse(localStorage.getItem("refundedTickets")) || [];
      if (!stored.find((t) => t.id === ticket.id)) {
        stored.push({ ...ticket, status: "REFUNDED" });
        localStorage.setItem("refundedTickets", JSON.stringify(stored));
      }

      fetchTickets();
    } catch (err) {
      console.error("Bilet iadesi yapılamadı:", err);
    }
  };

  const renderStatus = (status) => {
    if (status === "REFUNDED") {
      return <span className="text-red-600 font-semibold">{t("adminTickets.refunded")}</span>;
    }
    return <span className="text-green-600 font-semibold">{t("adminTickets.accepted")}</span>;
  };

  return (
    <div className="min-h-screen p-6">
      <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">
        {t("adminTickets.title")}
      </h2>

      <div className="max-w-5xl mx-auto space-y-4">
        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-600"
            >
              <p>
                <strong>{t("adminTickets.user")}</strong>{" "}
                {ticket.user.firstName} {ticket.user.lastName} ({ticket.user.email})
              </p>
              <p>
                <strong>{t("adminTickets.route")}</strong>{" "}
                {ticket.trip.departureStation.city} → {ticket.trip.arrivalStation.city}
              </p>
              <p>
                <strong>{t("adminTickets.dateTime")}</strong>{" "}
                {ticket.trip.departureDate} {ticket.trip.departureTime} → {ticket.trip.arrivalDate} {ticket.trip.arrivalTime}
              </p>
              <p>
                <strong>{t("adminTickets.train")}</strong> {ticket.trip.train.name} |{" "}
                <strong>{t("adminTickets.seat")}</strong> {ticket.seatNumber}
              </p>
              <p>
                <strong>{t("adminTickets.price")}</strong> {ticket.trip.price} TL
              </p>
              <p>
                <strong>{t("adminTickets.status")}</strong> {renderStatus(ticket.status)}
              </p>

              {ticket.status !== "REFUNDED" && (
                <div className="mt-3">
                  <button
                    onClick={() => handleRefund(ticket)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                  >
                    {t("adminTickets.refund")}
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">{t("adminTickets.empty")}</p>
        )}
      </div>
    </div>
  );
}
