import "../../style/UsersTable.css";

import { ArrowUpDown } from "lucide-react";

const HEADERS = [
  { key: "id",         label: "ID" },
  { key: "name",       label: "Nombre" },
  { key: "email",      label: "Email" },
  { key: "role",       label: "Rol" },
];

export default function UsersTable({ rows = [], sortBy, sortDir, onSort, loading }) {
  return (
    <div className="users-table-wrap">
      <table className="users-table">
        <thead>
          <tr>
            {HEADERS.map((h) => {
              const active = sortBy === h.key;
              return (
                <th key={h.key}>
                  <button
                    onClick={() => onSort?.(h.key)}
                    className={`th-sort-btn${active ? " active" : ""}`}
                    aria-sort={active ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                    title={`Ordenar por ${h.label}`}
                  >
                    <span>{h.label}</span>
                    <ArrowUpDown size={14} aria-hidden="true" />
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody aria-busy={loading}>
          {loading ? (
            <tr>
              <td className="users-table-loading" colSpan={HEADERS.length}>Cargando…</td>
            </tr>
          ) : (
            rows.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td className="capitalize">{u.role}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
