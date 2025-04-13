import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "MALE",
    phoneNumber: "",
    address: "",
  });

  const API_BASE = "http://localhost:8080/employees"; // Gerekirse değiştir

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_BASE}/`);
      setEmployees(res.data);
    } catch (err) {
      console.error("Personel verisi çekilemedi:", err);
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/`, form);
      setEmployees((prev) => [...prev, res.data]); // backend'den dönen personeli listeye ekle
      setForm({
        firstName: "",
        lastName: "",
        age: "",
        gender: "MALE",
        phoneNumber: "",
        address: "",
      });
    } catch (err) {
      console.error("Personel eklenemedi:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/${id}`);
      setEmployees((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Personel silinemedi:", err);
    }
  };

  const sectionStyle = "bg-white/90 backdrop-blur-md rounded-xl shadow-xl p-6 space-y-6";
  const titleStyle = "text-xl font-semibold text-blue-700 mb-2";
  const inputStyle = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 py-10">
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-10">
        👤 Personel Yönetimi
      </h1>

      <div className="max-w-xl mx-auto">
        <div className={sectionStyle}>
          <form onSubmit={handleAddEmployee} className="space-y-3">
            <input className={inputStyle} placeholder="Ad" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
            <input className={inputStyle} placeholder="Soyad" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
            <input className={inputStyle} type="number" placeholder="Yaş" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} required />
            <select className={inputStyle} value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
              <option value="MALE">Erkek</option>
              <option value="FEMALE">Kadın</option>
            </select>
            <input className={inputStyle} placeholder="Telefon" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} required />
            <input className={inputStyle} placeholder="Adres" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
              ➕ Ekle
            </button>
          </form>

          <div className="mt-6">
            <h3 className="text-md font-semibold text-gray-700 mb-2">📋 Personel Listesi</h3>
            {employees.length > 0 ? (
              <ul className="text-sm text-gray-800 list-disc list-inside space-y-1">
                {employees.map((e) => (
                  <li key={e.id} className="flex justify-between items-center">
                    <span className={titleStyle}>{e.firstName} {e.lastName} - {e.age} yaş - {e.gender}</span>
                    <button onClick={() => handleDelete(e.id)} className="text-red-600 hover:underline text-xs cursor-pointer">Kov</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">Henüz personel eklenmedi.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
