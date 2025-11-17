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
    const { name, category, description, price, date, location, imageUrl } = req.body;

    const userId = actor.id;

    const result = await pool.query(
      `INSERT INTO "Activity" 
      (name, category, description, price, date, location, image_url, approved, status, id_user)
      VALUES ($1, $2, $3, $4, $5, $6, $7, FALSE, 'pending', $8)
      RETURNING *`,
      [name, category, description, price, date, location, imageUrl, userId]
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

export const getActivityById = async (req, res) => {
  try {
    const { id } = req.params;

    const activity = await pool.query(
      `
      SELECT
        a.*,
        u.name AS host_name,
        u.email AS host_email
      FROM airbnb_secure."Activity" a
      LEFT JOIN airbnb_secure."User" u
        ON a.id_user = u.id_user
      WHERE a.id_activity = $1
      `,
      [id]
    );

    if (activity.rowCount === 0) {
      return res.status(404).json({ message: "Actividad no encontrada" });
    }

    res.json(activity.rows[0]);

  } catch (error) {
    console.error("Error getActivityById:", error);
    res.status(500).json({ message: "Error al obtener la actividad" });
  }
};