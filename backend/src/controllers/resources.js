import { pool } from "../config/db.js";

export const getResourcesByUser = async (req, res) => {
  const { id_user } = req.params;

  try {
    const properties = await pool.query(
      `SELECT id_property AS id, name, type, price, image_url, 'properties' AS item_type
       FROM airbnb_secure."Property"
       WHERE id_user = $1`, 
      [id_user]
    );

    const activities = await pool.query(
      `SELECT id_activity AS id, name, category AS type, price, image_url, 'activities' AS item_type
       FROM airbnb_secure."Activity"
       WHERE id_user = $1`,
      [id_user]
    );

    const services = await pool.query(
      `SELECT id_service AS id, name, description AS type, price, image_url, 'services' AS item_type
       FROM airbnb_secure."Service"
       WHERE id_user = $1`,
      [id_user]
    );

    return res.json([
      ...properties.rows,
      ...activities.rows,
      ...services.rows,
    ]);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error cargando recursos del usuario" });
  }
};
