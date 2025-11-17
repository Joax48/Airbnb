import { pool } from "../config/db.js";
import { logAction } from "../utils/audit.js";
import { actorFromReq } from "../utils/actor.js";

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

function cleanReason(str) {
  return (str || "").toString().trim();
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
  const actor = actorFromReq(req);
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
      action: "APPROVE on PROPERTY",
      entityType: "Property",
      entityId: id,
      before: { status: before.status, approved: before.approved },
      after: { status: after.status, approved: after.approved },
      reason: null,
      actor,
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
  const actor = actorFromReq(req);
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
      action: "REJECT on PROPERTY",
      entityType: "Property",
      entityId: id,
      before: { status: before.status, approved: before.approved },
      after: { status: after.status, approved: after.approved },
      reason: cleanReason,
      actor,
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

export const getPendingActivities = async (_res, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT *
       FROM "Activity"
       WHERE approved = FALSE AND status = 'pending'
       ORDER BY "id_activity" DESC`
    );
    return res.status(200).json(rows);
  } catch (error) {
    console.error("Error al obtener actividades pendientes:", error);
    return res
      .status(500)
      .json({ message: "Error al cargar actividades pendientes" });
  }
};

export const approveActivity = async (req, res, next) => {
  const id = parseId(req.params.id);
  const actor = actorFromReq(req);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows: beforeRows } = await client.query(
      'SELECT id_activity, status, approved FROM "Activity" WHERE id_activity = $1 FOR UPDATE',
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
      'UPDATE "Activity" SET approved = TRUE, status = $2 WHERE id_activity = $1 RETURNING *',
      [id, "approved"]
    );
    const after = afterRows[0];

    await logAction(client, {
      action: "APPROVE on ACTIVITY",
      entityType: "Activity",
      entityId: id,
      before: { status: before.status, approved: before.approved },
      after: { status: after.status, approved: after.approved },
      reason: null,
      actor,
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

export const rejectActivity = async (req, res, next) => {
  const id = parseId(req.params.id);
  const actor = actorFromReq(req);
  const reason = cleanReason(req.body?.reason);
  if (reason.length < 3) {
    const err = new Error("Motivo de rechazo requerido (mín. 3 caracteres).");
    err.status = 400;
    return next(err);
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows: beforeRows } = await client.query(
      'SELECT id_activity, status, approved FROM "Activity" WHERE id_activity = $1 FOR UPDATE',
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
      'UPDATE "Activity" SET approved = FALSE, status = $2 WHERE id_activity = $1 RETURNING *',
      [id, "rejected"]
    );
    const after = afterRows[0];

    await logAction(client, {
      action: "REJECT on ACTIVITY",
      entityType: "Activity",
      entityId: id,
      before: { status: before.status, approved: before.approved },
      after: { status: after.status, approved: after.approved },
      reason,
      actor,
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

export const getPendingServices = async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT *
       FROM "Service"
       WHERE approved = FALSE
       ORDER BY "id_service" DESC`
    );
    return res.status(200).json(rows);
  } catch (error) {
    console.error("Error al obtener servicios pendientes:", error);
    return res
      .status(500)
      .json({ message: "Error al cargar servicios pendientes" });
  }
};

export const approveService = async (req, res, next) => {
  const id = parseId(req.params.id);
  const actor = actorFromReq(req);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows: beforeRows } = await client.query(
      'SELECT id_service, approved FROM "Service" WHERE id_service = $1 FOR UPDATE',
      [id]
    );
    const before = beforeRows[0];
    if (!before) {
      const err = new Error("Recurso no encontrado");
      err.status = 404;
      throw err;
    }
    if (before.approved === true) {
      const err = new Error("Operación inválida: ya está aprobado.");
      err.status = 409;
      throw err;
    }

    const { rows: afterRows } = await client.query(
      'UPDATE "Service" SET approved = TRUE WHERE id_service = $1 RETURNING *',
      [id]
    );
    const after = afterRows[0];

    await logAction(client, {
      action: "APPROVE on SERVICE",
      entityType: "Service",
      entityId: id,
      before: { approved: before.approved },
      after: { approved: after.approved },
      reason: null,
      actor,
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

export const rejectService = async (req, res, next) => {
  const id = parseId(req.params.id);
  const actor = actorFromReq(req);
  const reason = cleanReason(req.body?.reason);
  if (reason.length < 3) {
    const err = new Error("Motivo de rechazo requerido (mín. 3 caracteres).");
    err.status = 400;
    return next(err);
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows: beforeRows } = await client.query(
      'SELECT id_service, approved FROM "Service" WHERE id_service = $1 FOR UPDATE',
      [id]
    );
    const before = beforeRows[0];
    if (!before) {
      const err = new Error("Recurso no encontrado");
      err.status = 404;
      throw err;
    }

    const { rows: afterRows } = await client.query(
      'UPDATE "Service" SET approved = FALSE WHERE id_service = $1 RETURNING *',
      [id]
    );
    const after = afterRows[0];

    await logAction(client, {
      action: "REJECT on SERVICE",
      entityType: "Service",
      entityId: id,
      before: { approved: before.approved },
      after: { approved: after.approved },
      reason,
      actor,
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
