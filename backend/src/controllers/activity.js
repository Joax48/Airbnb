import { pool } from "../config/db.js";
import { actorFromReq } from "../utils/actor.js";
import { logAction } from "../utils/audit.js";

export const getPublicActivities = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM v_activities_public");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener actividades:", error.message);
    res.status(500).json({ message: "Error al cargar actividades" });
  }
};

export const createActivity = async (req, res) => {
  try {
    const actor = actorFromReq(req);
    const { name, category, description, price, date, imageUrl } = req.body;

    const userId = actor.id;

    const result = await pool.query(
      `INSERT INTO "Activity"
        (name, category, description, price, date, image_url, approved, status, id_user)
       VALUES ($1, $2, $3, $4, $5, $6, FALSE, 'pending', $7)
       RETURNING *`,
      [name, category, description, price, date, imageUrl, userId]
    );

    const activity = result.rows[0];

    await logAction(null, {
      action: "CREATE on ACTIVITY",
      entityType: "Activity",
      entityId: activity.id_activity,
      before: null,
      after: {
        status: activity.status,
        approved: activity.approved,
        id_user: activity.id_user,
      },
      reason: null,
      actor,
      at: new Date().toISOString(),
    });

    res.status(201).json(activity);
  } catch (error) {
    console.error("Error creando actividad:", error);
    res.status(500).json({ message: "Error al crear actividad" });
  }
};
