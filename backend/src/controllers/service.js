import { pool } from "../config/db.js";
import { actorFromReq } from "../utils/actor.js";
import { logAction } from "../utils/audit.js"; 

export const createService = async (req, res) => {
  const client = await pool.connect();
  try {
    const actor = actorFromReq(req);
    const { name, description, type, price, imageUrl } = req.body;

    await client.query("BEGIN");

    const result = await client.query(
      `INSERT INTO "Service" 
        (name, description, type, price, image_url, approved, id_user)
       VALUES ($1, $2, $3, $4, $5, FALSE, $6)
       RETURNING *`,
      [name, description, type, price, imageUrl, actor.id]
    );

    const service = result.rows[0];

    await logAction(client, {
      action: "CREATE on SERVICE",
      entityType: "Service",
      entityId: service.id_service,
      before: null,
      after: {
        approved: service.approved,
        id_user: service.id_user,
      },
      reason: null,
      actor,
      at: new Date().toISOString(),
    });

    await client.query("COMMIT");

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creando servicio:", error.message);
    res.status(500).json({ message: "Error al crear servicio" });
  } finally {
    client.release();
  }
};
