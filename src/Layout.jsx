import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import BackgroundSlider from "./components/BackgroundSlider"; 

export default function Layout() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundSlider /> 

      <div className="relative z-10">
        <Header />
        <main className="min-h-[80vh]">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
