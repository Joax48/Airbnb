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

export const createAccommodation = async (req, res) => {
  try {
    const { name, type, description, price, location } = req.body;

    const result = await pool.query(
      `INSERT INTO "Property" (name, type, description, price, location, approved, status)
       VALUES ($1, $2, $3, $4, $5, FALSE, 'pending')
       RETURNING *`,
      [name, type, description, price, location]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creando alojamiento:", error.message);
    res.status(500).json({ message: "Error al crear alojamiento" });
  }
};