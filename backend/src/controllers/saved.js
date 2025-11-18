import { pool } from "../config/db.js";

export const toggleSaved = async (req, res) => {
  try {
    const { type, item_id } = req.body;
    const id_user = req.user.Id || req.user.id_user;

    if (!type || !item_id) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }

    const validTypes = ["properties", "activities", "services"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Tipo inválido" });
    }

    // Verificar si ya está guardado
    const check = await pool.query(
      `SELECT * FROM "Saved" WHERE id_user = $1 AND item_type = $2 AND item_id = $3`,
      [id_user, type, item_id]
    );

    if (check.rows.length > 0) {
      // Eliminar si ya existe
      await pool.query(
        `DELETE FROM "Saved" WHERE id_user = $1 AND item_type = $2 AND item_id = $3`,
        [id_user, type, item_id]
      );
      return res.json({ saved: false });
    }

    // Crear favorito
    await pool.query(
      `INSERT INTO "Saved" (id_user, item_type, item_id) VALUES ($1, $2, $3)`,
      [id_user, type, item_id]
    );

    return res.json({ saved: true });

  } catch (error) {
    console.error("Error toggleSaved:", error.message);
    res.status(500).json({ message: "Error guardando recurso" });
  }
};

export const getSavedItems = async (req, res) => {
  try {
    const userId = req.user.Id || req.user.id_user;

    const result = await pool.query(
      `SELECT * FROM "Saved" WHERE id_user = $1 ORDER BY created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error obteniendo guardados:", error);
    res.status(500).json({ message: "Error al cargar guardados" });
  }
};
