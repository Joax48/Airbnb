import { useEffect, useMemo, useState } from 'react';
import { Inbox } from 'lucide-react';
import PendingPropertyCard from '../../components/admin/PendingPropertyCard.jsx';
import Toolbar from '../../components/admin/Toolbar.jsx';
import "../../style/Approvals.css";

export default function ApprovalsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [q, setQ] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch('/api/admin/approval/properties/pending', { credentials: 'include' })
      .then(async (r) => {
        const ct = r.headers.get('content-type') || '';
        const body = ct.includes('application/json') ? await r.json() : await r.text();
        if (!r.ok) throw new Error(typeof body === 'string' ? `HTTP ${r.status}` : (body?.message || `HTTP ${r.status}`));

        const list = Array.isArray(body)
          ? body
          : (body?.data ?? body?.rows ?? body?.properties ?? body?.pending ?? body?.items ?? []);

        if (alive) { setRows(Array.isArray(list) ? list : []); setErr(null); }
      })
      .catch(e => alive && setErr(e.message || String(e)))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [refreshKey]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter(p =>
      String(p?.name || p?.title || '').toLowerCase().includes(s) ||
      String(p?.id_property || '').toLowerCase().includes(s)
    );
  }, [rows, q]);

  const approve = async (id) => {
    await fetch(`/api/admin/approval/properties/${id}/approve`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    setRefreshKey(k => k + 1);
  };

  const reject = async (id, reason) => {
    await fetch(`/api/admin/approval/properties/${id}/reject`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    setRefreshKey(k => k + 1);
  };

  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: 24 }}>
      <h1 style={{ marginBottom: 16 }}>Aprobaciones</h1>

      <Toolbar
        filter={q}
        onFilterChange={setQ}
        onReload={() => setRefreshKey(k => k + 1)}
        loading={loading}
      />

      {!loading && !err && filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon-wrap">
            <Inbox className="empty-icon" size={28} aria-hidden="true" />
          </div>
          <h3 className="empty-title">Estás al día por ahora</h3>
          <p className="empty-text">
            Aquí se mostrarán las propiedades que requieran revisión.
          </p>
        </div>
      )}

      <div style={{ display: 'grid', gap: 16 }}>
        {filtered.map((p, i) => (
        <PendingPropertyCard
          key={p?.id_property ?? i}
          property={p}
          onApprove={approve}
          onReject={(id, reason) => {
            const r = (reason ?? '').trim();
            if (r.length < 3) return alert('Motivo muy corto (mín. 3).');
            reject(id, r);
          }}
        />
        ))}
      </div>
    </div>
  );
}
