import { useCallback, useEffect, useState } from "react";

export default function useAuditLogsQuery() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/admin/audit-logs", {
        method: "GET",
        credentials: "include", 
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Error al cargar logs de auditoría");
      }

      const body = await res.json();

      setData(Array.isArray(body) ? body : body.data ?? []);
    } catch (err) {
      console.error("Error cargando audit logs:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    data,
    loading,
    error,
    refetch: fetchLogs,
  };
}
