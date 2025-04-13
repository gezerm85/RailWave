import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, isLoggedIn } = useAuth();

  if (!isLoggedIn || user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
