const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function validateSession(token) {
  return Promise.resolve({ ok: !!token, role: getRoleFromToken(token) });
}

function getRoleFromToken(token) {
  try {
    const payload = JSON.parse(decodeJWT(token));
    return payload?.role || payload?.roles?.[0] || "USER";
  } catch {
    return "USER";
  }
}

export async function getRegisteredUsers() {
  return Promise.resolve({ data: [], total: 0 });
}

export async function getPendingContent() {
  return Promise.resolve({ lodgings: [], activities: [], services: [] });
}

export async function getAuditLogs() {
  return Promise.resolve({ data: [] });
}

function decodeJWT(token) {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("JWT inválido");
  const base64Url = parts[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const json = decodeURIComponent(
    atob(base64)
      .split("")
      .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  return json;
}
