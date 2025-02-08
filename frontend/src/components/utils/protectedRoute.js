import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role"); // Get role from sessionStorage

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles are provided, check if the user has one of the allowed roles
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />; // Redirect to home if role not allowed
  }

  return children;
};

export default ProtectedRoute;
