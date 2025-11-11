import { pool } from "../config/db.js";

export async function logAction(clientOrNull, payload) {
  const sql = `
    INSERT INTO "AuditLog" (user_id, action, "timestamp", ip_address)
    VALUES ($1, $2, $3, $4)
    RETURNING id_log
  `;

  const params = [
    payload?.actor?.id ?? null,
    payload?.action ?? null,
    payload?.at ? new Date(payload.at) : new Date(),
    payload?.actor?.ip ?? null,
  ];

  if (clientOrNull?.query) {
    await clientOrNull.query(sql, params);
    return;
  }

  const client = await pool.connect();
  try {
    await client.query(sql, params);
  } finally {
    client.release();
  }
}