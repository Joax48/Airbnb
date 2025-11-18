import { useState, useEffect } from "react";
import axios from "axios";

const API = import.meta.env.VITE_IP_SERVER;

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get(`${API}/api/users/me`, {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const logout = async () => {
    await axios.post(`${API}/api/users/logout`, {}, { withCredentials: true });
    setUser(null);
    window.location.href = "/";
  };

  return {
    user,
    role: user?.role,
    isAuthenticated: !!user,
    loading,
    logout,
  };
};
