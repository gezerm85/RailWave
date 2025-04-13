import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center bg-gray-100 px-4">
      <div>
        <h1 className="text-4xl font-bold text-blue-700 mb-4">404 - Sayfa Bulunamadı</h1>
        <p className="text-gray-600 mb-6">
          Aradığınız sayfa mevcut değil veya yetkiniz yok.
        </p>
        <Link
          to="/user"
          className="inline-block bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          Anasayfaya Dön
        </Link>
      </div>
    </div>
  );
}
