/* eslint-disable no-unused-vars */
import React, {useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from '../assets/images/railwave_logo_padded.png'
import { useTranslation } from "react-i18next";
import Select from "react-select";
import trFlag from "../assets/flags/tr.png";
import enFlag from "../assets/flags/en.png";
import frFlag from "../assets/flags/fr.png";
import ptFlag from "../assets/flags/pt.png";
import esFlag from "../assets/flags/es.png";
import deFlag from "../assets/flags/de.png"; 
import ruFlag from "../assets/flags/ru.png";
import arFlag from "../assets/flags/ar.png";
import { FaUserCircle } from "react-icons/fa";  
import { FiLogOut } from "react-icons/fi";


export default function Header() {
  const { isLoggedIn, user, logout } = useAuth();

  

  const role = user?.role?.toUpperCase?.(); 

  const { i18n, t } = useTranslation();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);
  

  const languageOptions = [
    {
      value: "tr",
      label: (
        <div className="flex items-center gap-2">
          <img src={trFlag} alt="TR" className="w-5 h-5 rounded-full" />
          <span>Türkçe</span>
        </div>
      ),
    },
    {
      value: "en",
      label: (
        <div className="flex items-center gap-2">
          <img src={enFlag} alt="EN" className="w-5 h-5 rounded-full" />
          <span>İngilizce</span>
        </div>
      ),
    },

  ];
  

  return (
    <header className="bg-white/70 shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
      <Link
        to={isLoggedIn && role === "ADMIN" ? "/admin" : "/"}
        className="flex items-center gap-2"
      >
        <img
          src={logo}
          alt="RailWave Logo"
          width={250}
          height={150}
          className="rounded-full p-4"
        />
    
      </Link>

        <nav className="flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                {t('header.login')}
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 transition text-sm"
              >
                {t('header.register')}
              </Link>

              <Select
                options={languageOptions}
                defaultValue={languageOptions.find(opt => opt.value === i18n.language)}
                onChange={(selectedOption) => {
                  i18n.changeLanguage(selectedOption.value);
                  localStorage.setItem('language', selectedOption.value);
                }}
                className="min-w-[120px]"
                classNamePrefix="react-select"
                isSearchable={false}
              />


            </>
          ) : (
            <>
              {user?.firstName || user?.name ? (
                <span className="text-gray-600 text-sm hidden md:inline">
                  	{t('header.hello')} {" "}
                  <strong className=" capitalize ">{user.firstName || user.name}</strong>
                </span>
              ) : null}

              {role === "ADMIN" && (
                <>
                  <Link
                    to="/admin"
                    className="text-red-600 hover:underline font-semibold"
                  >
                   {t('header.adminPanel')}
                  </Link>
                  <div className="hidden md:flex gap-2 items-center">
                    <Link
                      to="/admin/stations"
                      className="text-sm text-blue-700 hover:underline"
                    >
                     {t('header.stations')}
                    </Link>
                    <Link
                      to="/admin/trains"
                      className="text-sm text-blue-700 hover:underline"
                    >
                     	{t('header.trains')}
                    </Link>
                    <Link
                      to="/admin/trips"
                      className="text-sm text-blue-700 hover:underline"
                    >
                      {t('header.trips')}
                    </Link>
                    <Link
                      to="/admin/AdminTickets"
                      className="text-sm text-blue-700 hover:underline"
                    >
                      {t('header.ticketControl')}
                    </Link>
                  </div>
                </>
              )}

              {role === "MANAGER" && (
                <Link
                  to="/manager/employees"
                  className="text-sm text-blue-700 hover:underline font-medium"
                >
                  	{t('header.staff')}
                </Link>
              )}

              {role === "USER" && (
                <Link
                  to="/tickets"
                  className="text-blue-600 font-medium hover:underline"
                >
                 {t('header.myTickets')}
                </Link>
              )}

              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-blue-600 rounded-full text-blue-700 hover:bg-blue-50 transition text-sm font-medium shadow-sm"
              >
                <FaUserCircle className="text-lg" />
                {t("header.profile", "Profil")}
              </Link>
              <Select
                options={languageOptions}
                defaultValue={languageOptions.find(opt => opt.value === i18n.language)}
                onChange={(selectedOption) => {
                  i18n.changeLanguage(selectedOption.value);
                  localStorage.setItem('language', selectedOption.value);
                }}
                className="min-w-[120px]"
                classNamePrefix="react-select"
                isSearchable={false}
              />

              <button
                onClick={logout}
                className="bg-red-500 flex items-center gap-2 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm"
              >
                <FiLogOut size={16} />
                {t('header.logout')}
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
