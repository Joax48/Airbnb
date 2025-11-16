// controllers/auditLog.controller.js
import { pool } from "../config/db.js";

export const getAuditLogs = async (req, res, next) => {
  try {

    const { rows } = await pool.query(
      `SELECT id_log, user_id, user_email, user_role, action, "timestamp", ip_address
      FROM "AuditLog"
      ORDER BY "timestamp" DESC`
    );

    const { rows: countRows } = await pool.query(
      `SELECT COUNT(*) AS total FROM "AuditLog"`
    );

    return res.status(200).json({
      data: rows,
    });
  } catch (error) {
    console.error("Error al obtener audit logs:", error);
    next(error);
  }
};
