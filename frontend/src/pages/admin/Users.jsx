import { useEffect, useMemo, useState } from "react";
import useUsersQuery from "../../hooks/useUsersQuery.js";

import Toolbar from "../../components/admin/Toolbar.jsx";
import RoleFilter from "../../components/admin/RoleFilter.jsx";
import UsersTable from "../../components/admin/UsersTable.jsx";
import Pagination from "../../components/admin/Pagination.jsx";
import EmptyState from "../../components/admin/EmptyState.jsx";
import ErrorBlock from "../../components/admin/ErrorBlock.jsx";

import "../../style/Users.css";

export default function UsersPage() {
  const [q, setQ] = useState("");
  const [role, setRole] = useState("all"); 
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => { setPage(1); }, [q, role]);

  const { data, meta, loading, error, refetch } = useUsersQuery({
    page, q: q.trim() || undefined,
    role: role === "all" ? undefined : role,
    sortBy, sortDir, limit
  });

  const m = useMemo(() => ({
    page: meta?.page ?? page,
    totalPages: meta?.totalPages ?? 1,
    total: meta?.total ?? (data?.length ?? 0),
    limit: meta?.limit ?? limit
  }), [meta, data, page, limit]);

  const toggleSort = (key) => {
    if (key === sortBy) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortBy(key); setSortDir("asc"); }
    setPage(1);
  };

  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: 24 }}>
      <h1 style={{ marginBottom: 16 }}>Usuarios</h1>

      <RoleFilter role={role} onChange={setRole} />
      <Toolbar
        filter={q}
        onFilterChange={setQ}
        onReload={refetch}
        loading={loading}
        placeholder="Buscar por nombre o email…"
        buttonLabel="Recargar"
        loadingLabel="Cargando…"
      />



      {error && <ErrorBlock>{String(error)}</ErrorBlock>}

      {!loading && !error && (data?.length ?? 0) === 0 ? (
        <EmptyState
          title="No hay usuarios"
          description="Ajusta el término de búsqueda o el rol para ver resultados."
        />
      ) : (
        <UsersTable
          rows={data ?? []}
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={toggleSort}
          loading={loading}
        />
      )}

      <Pagination
        page={m.page}
        totalPages={m.totalPages}
        onPageChange={setPage}
        limit={m.limit}
        onLimitChange={setLimit}
        total={m.total}
      />
    </div>
  );
}
