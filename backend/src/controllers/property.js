import { pool } from "../config/db.js";
import { actorFromReq } from "../utils/actor.js";
import { logAction } from "../utils/audit.js";
import {
  sanitizeBasicField,
  sanitizeDescriptionField,
} from "../utils/sanitize.js";

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
    const actor = actorFromReq(req);

    const {
      name,
      type,
      description = "",
      price,
      location,
      imageUrl,
      amenities,
    } = req.body;

    const errors = [];

    const NAME_MAX = 100;
    const LOCATION_MAX = 100;
    const DESC_MAX = 1000;
    const PRICE_MAX = 500000;

    const ALLOWED_TYPES = [
      "Casa",
      "Apartamento",
      "Villa",
      "Cabaña",
      "Habitación privada",
      "Habitación compartida",
      "Casa en el árbol",
      "Barco",
      "Casa flotante",
      "Domo",
    ];

    const cleanName = sanitizeBasicField(name);
    const cleanType = sanitizeBasicField(type);
    const cleanLocation = sanitizeBasicField(location);
    const cleanDescription = sanitizeDescriptionField(description);

    if (!cleanName || cleanName.length < 3 || cleanName.length > NAME_MAX) {
      errors.push("Nombre de alojamiento inválido.");
    }

    if (
      !cleanLocation ||
      cleanLocation.length < 3 ||
      cleanLocation.length > LOCATION_MAX
    ) {
      errors.push("Ubicación inválida.");
    }

    if (cleanDescription.length > DESC_MAX) {
      errors.push("Descripción demasiado larga.");
    }

    if (!cleanType) {
      errors.push("El tipo de alojamiento es obligatorio.");
    } else if (!ALLOWED_TYPES.includes(cleanType)) {
      errors.push("Tipo de alojamiento inválido.");
    }

    const priceNumber = Number(price);
    if (
      !Number.isFinite(priceNumber) ||
      priceNumber <= 0 ||
      priceNumber > PRICE_MAX
    ) {
      errors.push("Precio inválido.");
    }

    let cleanAmenities = [];
    if (Array.isArray(amenities)) {
      cleanAmenities = amenities
        .map((a) => Number(a))
        .filter((n) => Number.isInteger(n) && n > 0);
    } else if (amenities != null) {
      errors.push("Formato de amenidades inválido.");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: "Datos inválidos para crear alojamiento",
        errors,
      });
    }

    await client.query("BEGIN");

    const insertQuery = `
      INSERT INTO "Property"
        (name, type, description, price, location, image_url, approved, status, id_user)
      VALUES ($1, $2, $3, $4, $5, $6, FALSE, 'pending', $7)
      RETURNING *;
    `;

    const result = await client.query(insertQuery, [
      cleanName,
      cleanType,
      cleanDescription,
      priceNumber,
      cleanLocation,
      imageUrl,
      actor.id,
    ]);

    const property = result.rows[0];

    if (cleanAmenities.length > 0) {
      const insertAmenityQuery = `
        INSERT INTO "Property_Amenity" (id_property, id_amenity)
        VALUES ($1, $2);
      `;
      for (const amenityId of cleanAmenities) {
        await client.query(insertAmenityQuery, [
          property.id_property,
          amenityId,
        ]);
      }
    }

    await logAction(client, {
      action: "[Property]: New listing added successfully",
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

    return res.status(201).json(property);
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch (rollbackErr) {
      console.error("Error haciendo ROLLBACK en createAccommodation:", rollbackErr);
    }
    console.error("Error creando alojamiento:", error);
    return res.status(500).json({ message: "Error al crear alojamiento" });
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
