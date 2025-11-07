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
    const { name, category, description, price, date } = req.body;

    const result = await pool.query(
      `INSERT INTO "Activity" (name, category, description, price, date, approved, status)
       VALUES ($1, $2, $3, $4, $5, FALSE, 'pending')
       RETURNING *`,
      [name, category, description, price, date]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creando actividad:", error.message);
    res.status(500).json({ message: "Error al crear actividad" });
  }
};