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
    const { name, type, description, price, location, imageUrl, amenities } = req.body;

    const userId = req.user.Id || req.user.id_user;

    const result = await pool.query(
      `INSERT INTO "Property"
        (name, type, description, price, location, image_url, approved, status, id_user)
       VALUES ($1,$2,$3,$4,$5,$6,FALSE,'pending',$7)
       RETURNING id_property`,
      [name, type, description, price, location, imageUrl, userId]
    );

    const propertyId = result.rows[0].id_property;

    // Insertar amenidades
    if (amenities && amenities.length > 0) {
      for (let a of amenities) {
        await pool.query(
          `INSERT INTO "Property_Amenity" (id_property, id_amenity) VALUES ($1, $2)`,
          [propertyId, a]
        );
      }
    }

    res.status(201).json({ message: "Alojamiento creado", propertyId });

  } catch (error) {
    console.error("Error creando alojamiento:", error);
    res.status(500).json({ message: "Error al crear alojamiento" });
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener propiedad + info del host
    const property = await pool.query(
      `
      SELECT
        p.*,
        u.name AS host_name,
        u.email AS host_email
      FROM airbnb_secure."Property" p
      LEFT JOIN airbnb_secure."User" u 
        ON p.id_user = u.id_user
      WHERE p.id_property = $1
      `,
      [id]
    );

    if (property.rowCount === 0)
      return res.status(404).json({ message: "No encontrado" });

    const amenities = await pool.query(
      `
      SELECT a.id_amenity, a.name, a.icon
      FROM airbnb_secure."Amenities" a
      INNER JOIN airbnb_secure."Property_Amenity" pa 
        ON a.id_amenity = pa.id_amenity
      WHERE pa.id_property = $1
      `,
      [id]
    );

    const response = {
      ...property.rows[0],
      amenities: amenities.rows,
    };

    res.json(response);

  } catch (error) {
    console.error("Error getPropertyById:", error);
    res.status(500).json({ message: "Error al obtener el recurso" });
  }
};
