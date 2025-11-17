import { Inbox, Home, CalendarClock, Wrench } from 'lucide-react';
import useApprovals from '../../hooks/useApprovals';
import PendingPropertyCard from '../../components/admin/PendingPropertyCard.jsx';
import PendingActivityCard from '../../components/admin/PendingActivityCard.jsx';
import PendingServiceCard from '../../components/admin/PendingServiceCard.jsx';
import Toolbar from '../../components/admin/Toolbar.jsx';
import "../../style/Approvals.css";

const TABS = [
  { key: 'properties', label: 'Alojamientos', Icon: Home, tone: 'properties' },
  { key: 'activities', label: 'Actividades', Icon: CalendarClock, tone: 'activities' },
  { key: 'services',  label: 'Servicios',   Icon: Wrench, tone: 'services' },
];

export default function ApprovalsPage() {
  const {
    active, setActive,
    filtered, counts,
    q, setQ, loading, err, refresh,
    approve, reject,
  } = useApprovals();

  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: 24 }}>
      <h1 style={{ marginBottom: 16 }}>Aprobaciones</h1>

      <div className="tabs">
        {TABS.map(t => {
          const isActive = active === t.key;
          const CIcon = t.Icon;
          const count = counts[t.key] || 0;
          return (
            <button
              key={t.key}
              className={`tab-btn tone-${t.tone} ${isActive ? 'active' : ''}`}
              onClick={() => setActive(t.key)}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="tab-icon" aria-hidden="true"><CIcon size={16} /></span>
              <span className="tab-label">{t.label}</span>
              <span className="tab-count" aria-label={`${count} pendientes`}>{count}</span>
            </button>
          );
        })}
      </div>

      <Toolbar
        filter={q}
        onFilterChange={setQ}
        onReload={refresh}
        loading={loading}
      />

      {err && (
        <div className="error" role="alert" style={{ margin: '12px 0', color: 'var(--danger, #c1121f)' }}>
          {String(err)}
        </div>
      )}

      {!loading && !err && filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon-wrap">
            <Inbox className="empty-icon" size={28} aria-hidden="true" />
          </div>
          <h3 className="empty-title">Estás al día por ahora</h3>
          <p className="empty-text">Aquí se mostrarán los ítems que requieran revisión.</p>
        </div>
      )}

      <div style={{ display: 'grid', gap: 16 }}>
        {filtered.map((item, i) => {
          if ('id_property' in (item || {})) {
            return (
              <PendingPropertyCard
                key={item?.id_property ?? i}
                property={item}
                onApprove={() => approve(item)}
                onReject={(_id, r) => r?.trim()?.length >= 3 && reject(item, r)}
              />
            );
          }
          if ('id_activity' in (item || {})) {
            return (
              <PendingActivityCard
                key={item?.id_activity ?? i}
                activity={item}
                onApprove={() => approve(item)}
                onReject={(_id, r) => r?.trim()?.length >= 3 && reject(item, r)}
              />
            );
          }
          return (
            <PendingServiceCard
              key={item?.id_service ?? i}
              service={item}
              onApprove={() => approve(item)}
              onReject={(_id, r) => r?.trim()?.length >= 3 && reject(item, r)}
            />
          );
        })}
      </div>
    </div>
  );
}
