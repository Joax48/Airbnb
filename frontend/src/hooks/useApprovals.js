import { useEffect, useMemo, useState } from 'react';
import { approve as apiApprove, reject as apiReject, fetchPendingAll } from '../api/approvalsClient';

export default function useApprovals() {
  const [active, setActive] = useState('properties');
  const [properties, setProperties] = useState([]);
  const [activities, setActivities] = useState([]);
  const [services, setServices] = useState([]);

  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const data = await fetchPendingAll();
        if (!alive) return;
        setProperties(data.properties);
        setActivities(data.activities);
        setServices(data.services);
      } catch (e) {
        if (!alive) return;
        setErr(e.message || String(e));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [refreshKey]);

  const rows = active === 'properties' ? properties : active === 'activities' ? activities : services;

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter(row => {
      const name = String(row?.name || row?.title || '').toLowerCase();
      const ids = [
        String(row?.id_property ?? '').toLowerCase(),
        String(row?.id_activity ?? '').toLowerCase(),
        String(row?.id_service ?? '').toLowerCase(),
      ];
      return name.includes(s) || ids.some(x => x && x.includes(s));
    });
  }, [rows, q]);

  async function approve(item) {
    const type = active;
    const id =
      type === 'properties' ? item.id_property :
      type === 'activities' ? item.id_activity : item.id_service;
    await apiApprove(type, id);
    setRefreshKey(k => k + 1);
  }

  async function reject(item, reason) {
    const type = active;
    const id =
      type === 'properties' ? item.id_property :
      type === 'activities' ? item.id_activity : item.id_service;
    await apiReject(type, id, reason);
    setRefreshKey(k => k + 1);
  }

  return {
    active, setActive,
    properties, activities, services,
    rows, filtered,
    counts: { properties: properties.length, activities: activities.length, services: services.length },
    q, setQ,
    loading, err,
    refresh: () => setRefreshKey(k => k + 1),
    approve, reject,
  };
}
