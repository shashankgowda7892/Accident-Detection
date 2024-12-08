import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("authToken"); // Check for authentication token

  if (!token) {
    return <Navigate to="/" replace />; // Redirect to Login if not authenticated
  }

  return children; // Render the protected component
}

export default ProtectedRoute;
