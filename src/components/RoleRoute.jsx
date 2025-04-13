// components/RoleRoute.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const RoleRoute = ({ allowedRoles, children }) => {
  const { isLoggedIn, user } = useAuth();
  const role = user?.role?.toUpperCase();

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(role)) return <Navigate to="/" replace />;

  return children;
};

export default RoleRoute;
