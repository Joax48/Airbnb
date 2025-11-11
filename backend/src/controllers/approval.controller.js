import { pool } from "../config/db.js";
import { logAction } from "../utils/audit.js";

// To normalize and validate ID
function parseId(param) {
  const id = Number(param);
  if (!Number.isInteger(id) || id <= 0) {
    const err = new Error("ID inválido");
    err.status = 400;
    throw err;
  }
  return id;
}

export const getPendingProperties = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT *
      FROM "Property"
      WHERE approved = FALSE AND status = 'pending'
      ORDER BY "id_property" DESC`
    );
    return res.status(200).json(rows);
  } catch (error) {
    console.error("Error al obtener alojamientos pendientes:", error);
    return res
      .status(500)
      .json({ message: "Error al cargar alojamientos pendientes" });
  }
};

export const approveProperty = async (req, res, next) => {
  const id = parseId(req.params.id);
  const actor = req.user || {};
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { rows: beforeRows } = await client.query(
      'SELECT id_property, status, approved FROM "Property" WHERE id_property = $1 FOR UPDATE',
      [id]
    );
    const before = beforeRows[0];
    if (!before) {
      const err = new Error("Recurso no encontrado");
      err.status = 404;
      throw err;
    }
    if (before.status !== "pending") {
      const err = new Error(`Operación inválida: estado actual es '${before.status}'.`);
      err.status = 409;
      throw err;
    }

    const { rows: afterRows } = await client.query(
      'UPDATE "Property" SET approved = TRUE, status = $2 WHERE id_property = $1 RETURNING *',
      [id, "approved"]
    );
    const after = afterRows[0];

    await logAction(client, {
      action: "APPROVE_PROPERTY",
      entityType: "Property",
      entityId: id,
      before: { status: before.status, approved: before.approved },
      after: { status: after.status, approved: after.approved },
      reason: null,
      actor: {
        id: actor.id_user ?? actor.id ?? null,
        email: actor.email ?? null,
        role: actor.role ?? null,
        ip: req.ip ?? null,
      },
      at: new Date().toISOString(),
    });

    await client.query("COMMIT");
    res.status(200).json({ ok: true, data: after });
  } catch (error) {
    await client.query("ROLLBACK");
    next(error);
  } finally {
    client.release();
  }
};

export const rejectProperty = async (req, res, next) => {
  const id = parseId(req.params.id);
  const actor = req.user || {};
  const { reason } = req.body || {};
  const cleanReason = (reason || "").toString().trim();

  if (cleanReason.length < 3) {
    const err = new Error("Motivo de rechazo requerido (mín. 3 caracteres).");
    err.status = 400;
    return next(err);
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { rows: beforeRows } = await client.query(
      'SELECT id_property, status, approved FROM "Property" WHERE id_property = $1 FOR UPDATE',
      [id]
    );
    const before = beforeRows[0];
    if (!before) {
      const err = new Error("Recurso no encontrado");
      err.status = 404;
      throw err;
    }
    if (before.status !== "pending") {
      const err = new Error(`Operación inválida: estado actual es '${before.status}'.`);
      err.status = 409;
      throw err;
    }

    const { rows: afterRows } = await client.query(
      'UPDATE "Property" SET approved = FALSE, status = $2 WHERE id_property = $1 RETURNING *',
      [id, "rejected"]
    );
    const after = afterRows[0];

    await logAction(client, {
      action: "REJECT_PROPERTY",
      entityType: "Property",
      entityId: id,
      before: { status: before.status, approved: before.approved },
      after: { status: after.status, approved: after.approved },
      reason: cleanReason,
      actor: {
        id: actor.id_user ?? actor.id ?? null,
        email: actor.email ?? null,
        role: actor.role ?? null,
        ip: req.ip ?? null,
      },
      at: new Date().toISOString(),
    });

    await client.query("COMMIT");
    res.status(200).json({ ok: true, data: after });
  } catch (error) {
    await client.query("ROLLBACK");
    next(error);
  } finally {
    client.release();
  }
};
