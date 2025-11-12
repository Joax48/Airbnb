import { useCallback, useEffect, useMemo, useState } from "react";

const BASE_URL = "/api/admin/users";

export default function useUsersQuery({ page, q, role, sortBy, sortDir, limit = 10 }) {
  const [state, setState] = useState({ data: [], meta: null, loading: false, error: null });

  const query = useMemo(() => {
  const p = new URLSearchParams();
  if (page) p.set("page", String(page));
  if (limit) p.set("limit", String(limit));
  if (q) p.set("q", q);
  if (role) p.set("role", role);
  if (sortBy) p.set("sortBy", sortBy);
  if (sortDir) p.set("sortDir", sortDir);
  return p.toString();
  }, [page, q, role, sortBy, sortDir, limit]);

  const fetchUsers = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await fetch(`${BASE_URL}?${query}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || `HTTP ${res.status}`);
      }
      const json = await res.json();
      setState({ data: json?.data ?? [], meta: json?.meta ?? null, loading: false, error: null });
    } catch (e) {
      setState({ data: [], meta: null, loading: false, error: e });
    }
  }, [query]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  return { ...state, refetch: fetchUsers };
};