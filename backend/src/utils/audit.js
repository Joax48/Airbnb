import { pool } from "../config/db.js";

export async function logAction(clientOrNull, payload) {
  const actor = payload?.actor || {};

  const userId =
    actor.id ??
    actor.id_user ??
    actor.user_id ??
    payload.userId ??
    payload.user_id ??
    actor.Id ??
    null;

  const ip =
    actor.ip ??
    payload.ip ??
    null;

  const sql = `
    INSERT INTO "AuditLog" (user_id, user_email, user_role, action, "timestamp", ip_address)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id_log
  `;

  const params = [
    userId,
    actor.email ?? null,
    actor.role ?? null,
    payload?.action ?? null,
    payload?.at ? new Date(payload.at) : new Date(),
    ip,
  ];

  if (clientOrNull?.query) {
    const { rows } = await clientOrNull.query(sql, params);
    return rows[0];
  } else {
    const client = await pool.connect();
    try {
      const { rows } = await client.query(sql, params);
      return rows[0];
    } finally {
      client.release();
    }
  }
}
