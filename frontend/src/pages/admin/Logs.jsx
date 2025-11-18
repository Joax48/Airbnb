import { useEffect, useMemo, useState } from "react";
import useAuditLogsQuery from "../../hooks/useAuditLogsQuery";

import Toolbar from "../../components/admin/Toolbar.jsx";
import EmptyState from "../../components/admin/EmptyState.jsx"
import ErrorBlock from "../../components/admin/ErrorBlock.jsx";
import LogsTable from "../../components/admin/LogsTable.jsx";
import Pagination from "../../components/admin/Pagination.jsx";

import "../../style/Users.css";

export default function LogsPage() {
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, loading, error, refetch } = useAuditLogsQuery();

  useEffect(() => {
    setPage(1);
  }, [q]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return data ?? [];

    return (data ?? []).filter((log) => {
      const email = log.user_email?.toLowerCase() ?? "";
      const role = log.user_role?.toLowerCase() ?? "";
      const action = log.action?.toLowerCase() ?? "";
      const idStr = String(log.user_id ?? "").toLowerCase();

      return (
        email.includes(term) ||
        role.includes(term) ||
        action.includes(term) ||
        idStr.includes(term)
      );
    });
  }, [data, q]);

  const sorted = useMemo(() => {
    const arr = [...filtered];

    arr.sort((a, b) => {
      let va;
      let vb;

      switch (sortBy) {
        case "name":
          va = a.user_id ?? "";
          vb = b.user_id ?? "";
          break;
        case "email":
          va = a.user_email ?? "";
          vb = b.user_email ?? "";
          break;
        case "role":
          va = a.user_role ?? "";
          vb = b.user_role ?? "";
          break;
        case "action":
          va = a.action ?? "";
          vb = b.action ?? "";
          break;
        case "timestamp":
          va = a.timestamp ? new Date(a.timestamp).getTime() : 0;
          vb = b.timestamp ? new Date(b.timestamp).getTime() : 0;
          break;
        case "id":
        default:
          va = a.id_log ?? 0;
          vb = b.id_log ?? 0;
          break;
      }

      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return arr;
  }, [filtered, sortBy, sortDir]);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * limit;
  const end = start + limit;
  const pageSlice = sorted.slice(start, end);

  const rows = useMemo(
    () =>
      pageSlice.map((log) => ({
        id: log.id_log,
        name: log.user_id ?? "",
        email: log.user_email ?? "",
        role: log.user_role ?? "",
        action: log.action ?? "",
        timestamp: log.timestamp
          ? new Date(log.timestamp).toLocaleString("es-CR", {
              dateStyle: "short",
              timeStyle: "medium",
            })
          : "",
      })),
    [pageSlice]
  );

  const toggleSort = (key) => {
    if (key === sortBy) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortDir("asc");
    }
    setPage(1);
  };

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: 24 }}>
      <h1 style={{ marginBottom: 16 }}>Registros</h1>

      <Toolbar
        filter={q}
        onFilterChange={setQ}
        onReload={refetch}
        loading={loading}
        placeholder="Buscar por acción, email o rol..."
        buttonLabel="Recargar"
        loadingLabel="Cargando…"
      />

      {error && <ErrorBlock>{String(error)}</ErrorBlock>}

      {!loading && !error && rows.length === 0 ? (
        <EmptyState
          title="No hay registros"
          description="Aún no se han registrado acciones en el sistema."
        />
      ) : (
        <LogsTable
          rows={rows}
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={toggleSort}
          loading={loading}
        />
      )}

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
        limit={limit}
        onLimitChange={setLimit}
        total={total}
      />
    </div>
  );
}
