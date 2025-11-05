import { pool } from "../config/db.js";

export const getPublicProperties = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM v_properties_public");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener propiedades:", error.message);
    res.status(500).json({ message: "Error al cargar propiedades" });
  }
};
