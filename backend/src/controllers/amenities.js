import { pool } from "../config/db.js";

// Obtener lista de amenidades disponibles
export const getAmenities = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM "Amenities" ORDER BY id_amenity`);
    res.json(result.rows);
  } catch (error) {
    console.error("Error obteniendo amenities:", error.message);
    res.status(500).json({ message: "Error al obtener amenities" });
  }
};

// Obtener amenidades asignadas a una propiedad
export const getPropertyAmenities = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT A.* 
       FROM "Property_Amenity" PA
       JOIN "Amenities" A ON PA.id_amenity = A.id_amenity
       WHERE PA.id_property = $1`,
      [id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error obteniendo amenities de propiedad:", error.message);
    res.status(500).json({ message: "Error al obtener amenities de la propiedad" });
  }
};

// Asignar amenities a una propiedad
export const assignAmenitiesToProperty = async (req, res) => {
  try {
    const { id } = req.params;          // id_property
    const { amenities } = req.body;     // array de ids de amenidades

    if (!Array.isArray(amenities)) {
      return res.status(400).json({ message: "amenities debe ser un arreglo" });
    }

    // Eliminar las amenidades previas
    await pool.query(
      `DELETE FROM "Property_Amenity" WHERE id_property = $1`,
      [id]
    );

    // Insertar nuevas amenidades
    for (const amenityId of amenities) {
      await pool.query(
        `INSERT INTO "Property_Amenity" (id_property, id_amenity)
         VALUES ($1, $2)`,
        [id, amenityId]
      );
    }

    res.json({ message: "Amenidades actualizadas correctamente" });

  } catch (error) {
    console.error("Error asignando amenities:", error.message);
    res.status(500).json({ message: "Error al asignar amenities" });
  }
};
