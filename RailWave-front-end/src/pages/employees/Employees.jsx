import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

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

  const { t } = useTranslation();


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
      setEmployees((prev) => [...prev, res.data]); 
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
    <div className="min-h-screen  px-4 py-10">
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-10">
        {t("employees.title")}
      </h1>

      <div className="max-w-xl mx-auto">
        <div className={sectionStyle}>
          <form onSubmit={handleAddEmployee} className="space-y-3">
            <input className={inputStyle} placeholder={t("employees.firstName")} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
            <input className={inputStyle} placeholder={t("employees.lastName")} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
            <input className={inputStyle} type="number" placeholder={t("employees.age")} value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} required />
            <select className={inputStyle} value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
              <option value="MALE">{t("employees.male")}</option>
              <option value="FEMALE">{t("employees.female")}</option>
            </select>
            <input className={inputStyle} placeholder={t("employees.phone")} value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} required />
            <input className={inputStyle} placeholder={t("employees.address")} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
              {t("employees.add")}
            </button>
          </form>

          <div className="mt-6">
            <h3 className="text-md font-semibold text-gray-700 mb-2">{t("employees.listTitle")}</h3>
            {employees.length > 0 ? (
              <ul className="text-sm text-gray-800 list-disc list-inside space-y-1">
                {employees.map((e) => (
                  <li key={e.id} className="flex justify-between items-center">
                    <span className={titleStyle}>{t("employees.summary", { name: `${e.firstName} ${e.lastName}`, age: e.age, gender: t(`employees.${e.gender.toLowerCase()}`) })}
                    </span>
                    <button onClick={() => handleDelete(e.id)} className="text-red-600 hover:underline text-xs cursor-pointer">{t("employees.fire")}</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">{t("employees.empty")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
