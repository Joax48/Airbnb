import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { AuthContext } from "../auth/AuthContext";

export default function AdminRoute({ children }) {
  const { role } = useContext(AuthContext);
  return (
    <ProtectedRoute>
      {role === "admin" ? children : <Navigate to="/" replace />}
    </ProtectedRoute>
  );
}