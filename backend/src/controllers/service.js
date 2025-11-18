import { pool } from "../config/db.js";
import { actorFromReq } from "../utils/actor.js";
import { logAction } from "../utils/audit.js";
import {
  sanitizeBasicField,
  sanitizeDescriptionField,
} from "../utils/sanitize.js";

export const getPublicServices = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM v_services_public`);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener servicios:", error.message);
    res.status(500).json({ message: "Error al cargar servicios" });
  }
};

export const createService = async (req, res) => {
  const client = await pool.connect();

  try {
    const actor = actorFromReq(req);
    const { name, description = "", type, price, imageUrl } = req.body;

    const errors = [];

    const NAME_MAX = 100;
    const DESC_MAX = 1000;
    const PRICE_MAX = 500000;

    const ALLOWED_TYPES = [
      "Incluida",
      "Extra opcional",
      "Transporte al aeropuerto",
      "Alquiler de bicicletas",
      "Alquiler de autos",
      "Desayuno incluido",
      "Comidas locales",
      "Catering",
      "Conserjería",
      "Organización de eventos",
      "Paquete de estadía completo",
    ];

    const cleanName = sanitizeBasicField(name);
    const cleanType = sanitizeBasicField(type);
    const cleanDescription = sanitizeDescriptionField(description);

    if (!cleanName || cleanName.length < 3 || cleanName.length > NAME_MAX) {
      errors.push("Nombre de servicio inválido.");
    }

    if (cleanDescription.length > DESC_MAX) {
      errors.push("Descripción demasiado larga.");
    }

    if (!cleanType) {
      errors.push("El tipo de servicio es obligatorio.");
    } else if (!ALLOWED_TYPES.includes(cleanType)) {
      errors.push("Tipo de servicio inválido.");
    }

    const priceNumber = Number(price);
    if (
      !Number.isFinite(priceNumber) ||
      priceNumber <= 0 ||
      priceNumber > PRICE_MAX
    ) {
      errors.push("Precio inválido.");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: "Datos inválidos para crear servicio",
        errors,
      });
    }

    await client.query("BEGIN");

    const result = await client.query(
      `INSERT INTO "Service" 
        (name, description, type, price, image_url, approved, id_user)
       VALUES ($1, $2, $3, $4, $5, FALSE, $6)
       RETURNING *`,
      [cleanName, cleanDescription, cleanType, priceNumber, imageUrl, actor.id]
    );

    const service = result.rows[0];

    await logAction(client, {
      action: "[Service]: New listing added successfully",
      entityType: "Service",
      entityId: service.id_service,
      before: null,
      after: {
        approved: service.approved,
        id_user: service.id_user,
      },
      reason: null,
      actor,
      at: new Date().toISOString(),
    });

    await client.query("COMMIT");

    return res.status(201).json(service);
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch (rollbackErr) {
      console.error("Error haciendo ROLLBACK en createService:", rollbackErr);
    }
    console.error("Error creando servicio:", error.message);
    return res.status(500).json({ message: "Error al crear servicio" });
  } finally {
    client.release();
  }
};

export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await pool.query(
      `
      SELECT
        s.*,
        u.name AS host_name,
        u.email AS host_email
      FROM airbnb_secure."Service" s
      LEFT JOIN airbnb_secure."User" u
        ON s.id_user = u.id_user
      WHERE s.id_service = $1
      `,
      [id]
    );

    if (service.rowCount === 0) {
      return res.status(404).json({ message: "Servicio no encontrado" });
    }

    res.json(service.rows[0]);
  } catch (error) {
    console.error("Error getServiceById:", error);
    res.status(500).json({ message: "Error al obtener el servicio" });
  }
};
