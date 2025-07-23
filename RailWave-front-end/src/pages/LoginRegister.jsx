import React, { useState, useEffect } from "react";
import Login from "./Login";
import Register from "./Register"; 
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";



export default function LoginRegister() {
    const location = useLocation();
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState(
      location.pathname.includes("register") ? "register" : "login"
    );

    const navigate = useNavigate();

    const switchTab = (tab) => {
    setActiveTab(tab);
    navigate(tab === "login" ? "/login" : "/register", { replace: true });
    };

    useEffect(() => {
        if (location.pathname === "/register") {
          setActiveTab("register");
        } else {
          setActiveTab("login");
        }
      }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center  px-4 py-10">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        {/* Tabs */}
        <div className="flex justify-center mb-4 border-b border-gray-200">
          <button
            className={`px-4 py-2 text-lg font-semibold transition ${
              activeTab === "login"
                ? "border-b-2 border-blue-600 text-blue-700"
                : "text-gray-500 hover:text-blue-600"
            }`}
            onClick={() => switchTab("login")}
          >
             {t("auth.loginTitle")}
          </button>
          <button
            className={`px-4 py-2 text-lg font-semibold transition ${
              activeTab === "register"
                ? "border-b-2 border-blue-600 text-blue-700"
                : "text-gray-500 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("register")}
          >
            {t("register.title")}
          </button>
        </div>
        <div className=" w-full text-center text-4xl">
        RailWave
        </div>
        {/* Content */}
        <div>
          {activeTab === "login" ? <Login embedded /> : <Register embedded />}
        </div>
      </div>
    </div>
  );
}
