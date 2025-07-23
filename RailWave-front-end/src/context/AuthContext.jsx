/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const { t } = useTranslation();

  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("token"));
  const [tickets, setTickets] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [token]);

  useEffect(() => {
    const autoLogin = async () => {
      const tokenInStorage = localStorage.getItem("token");
      if (!tokenInStorage || user) {
        setIsReady(true);
        return;
      }

      try {
        const response = await axios.get("http://localhost:8080/users/profile", {
          headers: {
            Authorization: `Bearer ${tokenInStorage}`,
          },
        });

        login(response.data);
        setToken(tokenInStorage);
      } catch (err) {
        console.error("Otomatik giriş başarısız:", err);
        logout();
      } finally {
        setIsReady(true);
      }
    };

    autoLogin();
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const setAuthToken = (tokenValue) => {
    setToken(tokenValue);
    localStorage.setItem("token", tokenValue);
    axios.defaults.headers.common["Authorization"] = `Bearer ${tokenValue}`;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsLoggedIn(false);
    setTickets([]);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  };

  const addTicket = (ticket) => {
    setTickets((prev) => [...prev, ticket]);
  };

  const value = {
    user,
    token,
    isLoggedIn,
    login,
    setAuthToken,
    logout,
    tickets,
    setTickets,
    addTicket,
  };

  return isReady ? (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  ) : (
    <div className="p-10 text-center text-blue-600 font-semibold">{t("auth.loading")}</div>
  );
};

export const useAuth = () => useContext(AuthContext);
