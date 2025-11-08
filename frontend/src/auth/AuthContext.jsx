import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { getToken, clearToken } from "./auth";
import { validateSession } from "../api/client";

export const AuthContext = createContext({
  isAuthenticated: false,
  role: "user",
  loading: true,
  refreshSession: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState("user");

  // Check if token's saved
  const refreshSession = useCallback(async () => {
    setLoading(true);
    const token = getToken();
    try {
      const res = await validateSession(token);
      setIsAuthenticated(!!res?.ok);
      setRole(res?.role || "user");
    } catch {
      setIsAuthenticated(false);
      setRole("user");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const logout = useCallback(() => {
    clearToken();
    setIsAuthenticated(false);
    setRole("user");
  }, []);

  // Group all values globally available
  const value = useMemo(() => ({
    isAuthenticated,
    role,
    loading,
    refreshSession,
    logout,
  }), [isAuthenticated, role, loading, refreshSession, logout]);

  // By this, any component can access this context
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
