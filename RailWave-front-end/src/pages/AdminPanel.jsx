import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
    const { user } = useAuth();
  const [counts, setCounts] = useState({
    stations: 0,
    trains: 0,
    tickets: 0,
    trips: 0,
  });
  const [data, setData] = useState({
    stations: [],
    trains: [],
    tickets: [],
    trips: [],
  });
  const [activeModal, setActiveModal] = useState(null);
  const { t } = useTranslation();
  const API = "http://localhost:8080";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stationRes, trainRes, tickets, tripRes,] = await Promise.all([
          axios.get(`${API}/stations/`),
          axios.get(`${API}/trains/`),
          axios.get(`${API}/tickets/`),
          axios.get(`${API}/trips/`),
 
        ]);


      console.log();
      

        setCounts({
          stations: stationRes.data.length,
          trains: trainRes.data.length,
          tickets: tickets.data.length,
          trips: tripRes.data.length,
        });

        setData({
          stations: stationRes.data,
          trains: trainRes.data,
          tickets: tickets.data,
          trips: tripRes.data,
        });
      } catch (err) {
        console.error("Veriler çekilemedi:", err);
      }
    };

    fetchData();
  }, []);


  

  const chartData = [
    { name: t("adminDashboard.stations"), key: "stations", count: counts.stations },
    { name: t("adminDashboard.trains"), key: "trains", count: counts.trains },
    { name: t("adminDashboard.tickets"), key: "tickets", count: counts.tickets },
    { name: t("adminDashboard.trips"), key: "trips", count: counts.trips },
  ];

  const cardStyle =
    "flex flex-col items-center justify-center bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition cursor-pointer";

    const renderItemContent = (key, item) => {
      switch (key) {
        case "stations":
          return (
            <div className="flex justify-between">
              <span>📍 {item.name}</span>
              <span className="text-gray-500 italic">{item.city}</span>
            </div>
          );
        case "trains":
          return (
            <div className="flex justify-between">
              <span>🚆 {item.name}</span>
              <span className="text-gray-500 italic">{item.seatCount} koltuk</span>
            </div> 
          );
          case "tickets":
            return (
              <div className="flex flex-col gap-1">
                <div>🎟️ {t("adminTickets.seat")} {item.seatNumber}</div>
                <div>👤 {item.user?.firstName} {item.user?.lastName}</div>
                <div>🛤️ {item.trip?.departureStation?.name} → {item.trip?.arrivalStation?.name}</div>
                <div>📅 {item.trip?.departureDate} ({item.trip?.price}₺)</div>
                <div className="italic text-green-500">Durum: {item.status || t("adminTickets.accepted")}</div>
              </div>
            );
        case "trips":
          return (
            <div className="flex flex-col">
              <span>🛤️ {item.departureStation?.name} → {item.arrivalStation?.name}</span>
              <span className="text-gray-500">
                📅 {item.departureDate} ({item.price}₺)
              </span>
            </div>
          );
        default:
          return JSON.stringify(item, null, 2);
      }
    };
    

  return (
    <div className="min-h-screen  px-6 py-10">
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">
      {user?.role === "ADMIN" ? t("adminDashboard.title") : t("adminDashboard.manager")}

      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
        {chartData.map((item, index) => (
          <div
            key={index}
            className={cardStyle}
            onClick={() => setActiveModal(item.key)}
          >
            <span className="text-blue-600 text-lg font-semibold">{item.name}</span>
            <span className="text-2xl font-bold text-gray-800">{item.count}</span>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-xl max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">
          📊 {t("adminDashboard.chart")}
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* MODAL */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white max-w-2xl w-full rounded-lg p-6 relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-2 right-4 text-xl font-bold text-red-500 hover:text-red-700"
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold text-blue-800 mb-4">
              {t(`adminDashboard.${activeModal}`)}
            </h3>

            <ul className="max-h-[400px] overflow-y-auto divide-y text-sm text-gray-700">
            {data[activeModal]?.length > 0 ? (
              data[activeModal].map((item, idx) => (
                <li key={item.id || idx} className="py-2">
                  {renderItemContent(activeModal, item)}
                </li>
              ))
            ) : (
              <li className="text-center text-gray-500 italic">
                {t("adminDashboard.noData")}
              </li>
            )}

            </ul>
          </div>
        </div>
      )}

    </div>
  );
}