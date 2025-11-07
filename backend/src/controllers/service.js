import { pool } from "../config/db.js";

export const createService = async (req, res) => {
  try {
    const { name, description, type, price } = req.body;

    const result = await pool.query(
      `INSERT INTO "Service" (name, description, type, price, approved)
       VALUES ($1, $2, $3, $4, FALSE)
       RETURNING *`,
      [name, description, type, price]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creando servicio:", error.message);
    res.status(500).json({ message: "Error al crear servicio" });
  }
};