import { pool } from "../config/db.js";

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
    const { name, category, description, price, date, imageUrl } = req.body;

    const userId = req.user.id_user || req.user.Id;

    const result = await pool.query(
      `INSERT INTO "Activity"
        (name, category, description, price, date, image_url, approved, status, id_user)
       VALUES ($1, $2, $3, $4, $5, $6, FALSE, 'pending', $7)
       RETURNING *`,
      [name, category, description, price, date, imageUrl, userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creando actividad:", error);
    res.status(500).json({ message: "Error al crear actividad" });
  }
};
