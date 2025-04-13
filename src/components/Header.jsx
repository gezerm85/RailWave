/* eslint-disable no-unused-vars */
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from '../assets/images/logo.jpeg'

export default function Header() {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const role = user?.role?.toUpperCase?.(); 

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
      <Link
        to={isLoggedIn && role === "ADMIN" ? "/admin" : "/"}
        className="flex items-center gap-2"
      >
        <img
          src={logo}
          alt="RailWave Logo"
          width={60}
          height={60}
          className="rounded-full"
        />
        <span className="text-xl font-bold text-blue-700 tracking-wide">
        RailWave
        </span>
      </Link>

        <nav className="flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Giriş
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 transition text-sm"
              >
                Kayıt Ol
              </Link>
            </>
          ) : (
            <>
              {user?.firstName || user?.name ? (
                <span className="text-gray-600 text-sm hidden md:inline">
                  👋 Merhaba,{" "}
                  <strong>{user.firstName || user.name}</strong>
                </span>
              ) : null}

              {role === "ADMIN" && (
                <>
                  <Link
                    to="/admin"
                    className="text-red-600 hover:underline font-semibold"
                  >
                    Admin Panel
                  </Link>
                  <div className="hidden md:flex gap-2 items-center">
                    <Link
                      to="/admin/stations"
                      className="text-sm text-blue-700 hover:underline"
                    >
                      İstasyonlar
                    </Link>
                    <Link
                      to="/admin/trains"
                      className="text-sm text-blue-700 hover:underline"
                    >
                      Trenler
                    </Link>
                    <Link
                      to="/admin/trips"
                      className="text-sm text-blue-700 hover:underline"
                    >
                      Seferler
                    </Link>
                    <Link
                      to="/admin/AdminTickets"
                      className="text-sm text-blue-700 hover:underline"
                    >
                      Bilet Kontrol
                    </Link>
                  </div>
                </>
              )}

              {role === "MANAGER" && (
                <Link
                  to="/manager/employees"
                  className="text-sm text-blue-700 hover:underline font-medium"
                >
                  Personel
                </Link>
              )}

              {role === "USER" && (
                <Link
                  to="/tickets"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Biletlerim
                </Link>
              )}

              <button
                onClick={logout}
                className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300 transition text-sm"
              >
                Çıkış
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
