import React, { useContext, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, refreshSession } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    refreshSession();
  }, []);

  if(loading) return <div>Cargando sesión...</div>;
  if (!isAuthenticated) return <Navigate to="/" state={{ from: location}} replace />;
  return children;
}
