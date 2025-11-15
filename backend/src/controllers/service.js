import { pool } from "../config/db.js";

export const createService = async (req, res) => {
  try {
    const { name, description, type, price, imageUrl } = req.body;

    const userId = req.user?.Id || req.user?.id_user;

    if (!userId) {
      return res.status(403).json({ message: "Usuario no autenticado" });
    }

    const result = await pool.query(
      `INSERT INTO "Service" 
        (name, description, type, price, image_url, approved, id_user)
       VALUES ($1, $2, $3, $4, $5, FALSE, $6)
       RETURNING *`,
      [name, description, type, price, imageUrl, userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creando servicio:", error.message);
    res.status(500).json({ message: "Error al crear servicio" });
  }
};
