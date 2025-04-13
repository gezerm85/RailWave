import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white text-center text-gray-500 text-sm py-4 border-t mt-10">
      © {new Date().getFullYear()} TrainBooker • Tüm Hakları Saklıdır.
    </footer>
  );
}
