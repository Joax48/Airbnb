const BASE = '/api/admin/approval';

function pathOf(type) {
  if (type === 'properties') return `${BASE}/properties`;
  if (type === 'activities') return `${BASE}/activities`;
  if (type === 'services')  return `${BASE}/services`;
  throw new Error('Tipo inválido');
}

async function parse(res) {
  const ct = res.headers.get('content-type') || '';
  const body = ct.includes('application/json') ? await res.json() : await res.text();
  if (!res.ok) throw new Error(typeof body === 'string' ? `HTTP ${res.status}` : (body?.message || `HTTP ${res.status}`));
  const items = Array.isArray(body) ? body : (body?.data ?? body?.rows ?? body?.items ?? body?.pending ?? []);
  return Array.isArray(items) ? items : [];
}

export async function fetchPendingAll() {
  const [p, a, s] = await Promise.all([
    fetch(`${BASE}/properties/pending`, { credentials: 'include' }),
    fetch(`${BASE}/activities/pending`, { credentials: 'include' }),
    fetch(`${BASE}/services/pending`,   { credentials: 'include' }),
  ]);
  const [properties, activities, services] = await Promise.all([parse(p), parse(a), parse(s)]);
  return { properties, activities, services };
}

export async function approve(type, id) {
  const res = await fetch(`${pathOf(type)}/${id}/approve`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('No se pudo aprobar');
  return res.json().catch(() => ({}));
}

export async function reject(type, id, reason) {
  const res = await fetch(`${pathOf(type)}/${id}/reject`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason }),
  });
  if (!res.ok) throw new Error('No se pudo rechazar');
  return res.json().catch(() => ({}));
}
