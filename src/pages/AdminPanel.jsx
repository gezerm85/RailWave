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
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({
    stations: 0,
    trains: 0,
    employees: 0,
    trips: 0,
  });

  const API = "http://localhost:8080"; // Gerekirse değiştir

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stationRes, trainRes, employeeRes, tripRes] = await Promise.all([
          axios.get(`${API}/stations/`),
          axios.get(`${API}/trains/`),
          axios.get(`${API}/employees/`),
          axios.get(`${API}/trips/`),
        ]);

        setCounts({
          stations: stationRes.data.length,
          trains: trainRes.data.length,
          employees: employeeRes.data.length,
          trips: tripRes.data.length,
        });
      } catch (err) {
        console.error("Veriler çekilemedi:", err);
      }
    };

    fetchData();
  }, []);

  const chartData = [
    { name: "İstasyonlar", key: "stations", count: counts.stations },
    { name: "Trenler", key: "trains", count: counts.trains },
    { name: "Personeller", key: "employees", count: counts.employees },
    { name: "Seferler", key: "trips", count: counts.trips },
  ];

  const cardStyle =
    "flex flex-col items-center justify-center bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-6 py-10">
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">
        🎛️ Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
        {chartData.map((item, index) => (
          <Link
            key={index}
            to={`/admin/${item.key}`}
            className={cardStyle}
          >
            <span className="text-blue-600 text-lg font-semibold">{item.name}</span>
            <span className="text-2xl font-bold text-gray-800">{item.count}</span>
          </Link>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-xl max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">📊 Genel Dağılım</h2>
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
    </div>
  );
}
