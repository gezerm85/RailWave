import React from "react";
import { useAuth } from "../context/AuthContext";
import SearchForm from "../components/SearchForm";

export default function UserDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-100 to-white flex flex-col justify-center items-center px-4 py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/train-bg.jpg')] bg-cover bg-center opacity-10 blur-sm"></div>

      <div className="relative z-10 text-center mb-10">
        <h1 className="text-5xl md:text-7xl font-extrabold text-blue-800 drop-shadow-lg">
        RailWave
        </h1>
        <p className="mt-4 text-lg md:text-2xl text-gray-700 max-w-xl mx-auto">
          Kolayca tren biletini bul, karşılaştır ve rezervasyonunu anında yap!
        </p>

        {user?.firstName && (
          <p className="mt-4 text-md text-blue-700">
            👋 Hoş geldin, <strong>{user.firstName}</strong>!
          </p>
        )}
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <SearchForm />
      </div>
    </div>
  );
}
