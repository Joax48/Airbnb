import { pool } from "../config/db.js";
import { actorFromReq } from "../utils/actor.js";
import { logAction } from "../utils/audit.js";

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
  const client = await pool.connect();
  try {
    const { name, type, description, price, location, imageUrl, amenities } = req.body;
    const actor = actorFromReq(req);

  await client.query("BEGIN");

    const result = await client.query(
      `INSERT INTO "Property"
        (name, type, description, price, location, image_url, approved, status, id_user)
       VALUES ($1,$2,$3,$4,$5,$6,FALSE,'pending',$7)
       RETURNING *`,
      [name, type, description, price, location, imageUrl, actor.id]
    );

    const property = result.rows[0];

    if (amenities && amenities.length > 0) {
      for (let a of amenities) {
        await client.query(
          `INSERT INTO "Property_Amenity" (id_property, id_amenity) VALUES ($1, $2)`,
          [property.id_property, a]
        );
      }
    }

    await logAction(client, {
      action: "CREATE on PROPERTY",
      entityType: "Property",
      entityId: property.id_property,
      before: null,
      after: {
        status: property.status,
        approved: property.approved,
        id_user: property.id_user,
      },
      reason: null,
      actor,
      at: new Date().toISOString(),
    });

    await client.query("COMMIT");

    res.status(201).json({ message: "Alojamiento creado", propertyId: property.propertyId, });

  } catch (error) {
    console.error("Error creando alojamiento:", error);
    res.status(500).json({ message: "Error al crear alojamiento" });
  } finally {
    client.release();
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

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
