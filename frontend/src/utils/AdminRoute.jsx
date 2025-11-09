import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const AdminRoute = ({ children }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return <p>Cargando...</p>;

  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (role !== "admin") return <Navigate to="/unauthorized" replace />;

  return children;
};
