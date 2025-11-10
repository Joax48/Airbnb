import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <p>Cargando...</p>;

  if (!isAuthenticated) return <Navigate to="/" replace />;

  return children;
};
export default ProtectedRoute;