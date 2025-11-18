import { pool } from "../config/db.js";
import { actorFromReq } from "../utils/actor.js";
import { logAction } from "../utils/audit.js";
import {
  sanitizeBasicField,
  sanitizeDescriptionField,
} from "../utils/sanitize.js";

export const getPublicActivities = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM v_activities_public");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener actividades:", error.message);
    res.status(500).json({ message: "Error al cargar actividades" });
  }
};

export const createActivity = async (req, res) => {
  try {
    const actor = actorFromReq(req);

    const {
      name,
      category,
      description = "",
      price,
      date,
      location,
      imageUrl,
    } = req.body;

    const errors = [];

    const NAME_MAX = 100;
    const LOCATION_MAX = 100;
    const DESC_MAX = 1000;
    const PRICE_MAX = 500000;

    const ALLOWED_CATEGORIES = [
      "Visitas guiadas",
      "Rutas gastronómicas",
      "Excursiones culturales",
      "Cocina",
      "Fotografía",
      "Surf",
      "Yoga",
      "Baile",
      "Convivencias locales",
      "Talleres artesanales",
      "Actividades en la naturaleza",
      "Talleres virtuales",
      "Recorridos virtuales guiados",
    ];

    const cleanName = sanitizeBasicField(name);
    const cleanLocation = sanitizeBasicField(location);
    const cleanDescription = sanitizeDescriptionField(description);
    const cleanCategory = sanitizeBasicField(category);

    if (!cleanName || cleanName.length < 3 || cleanName.length > NAME_MAX) {
      errors.push("Nombre de actividad inválido.");
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

    if (!cleanCategory) {
      errors.push("La categoría es obligatoria.");
    } else if (!ALLOWED_CATEGORIES.includes(cleanCategory)) {
      errors.push("Categoría de actividad inválida.");
    }

    const priceNumber = Number(price);
    if (
      !Number.isFinite(priceNumber) ||
      priceNumber <= 0 ||
      priceNumber > PRICE_MAX
    ) {
      errors.push("Precio inválido.");
    }

    let cleanDate = null;
    if (!date) {
      errors.push("La fecha de la actividad es obligatoria.");
    } else {
      const parsed = new Date(date);
      if (Number.isNaN(parsed.getTime())) {
        errors.push("Fecha de actividad inválida.");
      } else {
        cleanDate = parsed.toISOString();
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: "Datos inválidos para crear actividad",
        errors,
      });
    }

    const userId = actor.id;

    const insertQuery = `
      INSERT INTO "Activity" 
        (name, category, description, price, date, location, image_url, approved, status, id_user)
      VALUES ($1, $2, $3, $4, $5, $6, $7, FALSE, 'pending', $8)
      RETURNING *;
    `;

    const result = await pool.query(insertQuery, [
      cleanName,
      cleanCategory,
      cleanDescription,
      priceNumber,
      cleanDate,
      cleanLocation,
      imageUrl,
      userId,
    ]);

    const activity = result.rows[0];

    await logAction(null, {
      action: "[Activity]: New listing added successfully",
      entityType: "Activity",
      entityId: activity.id_activity,
      before: null,
      after: {
        status: activity.status,
        approved: activity.approved,
        id_user: activity.id_user,
      },
      reason: null,
      actor,
      at: new Date().toISOString(),
    });

    return res.status(201).json(activity);
  } catch (error) {
    console.error("Error creando actividad:", error);
    return res.status(500).json({ message: "Error al crear actividad" });
  }
};

export const getActivityById = async (req, res) => {
  try {
    const { id } = req.params;

    const activity = await pool.query(
      `
      SELECT
        a.*,
        u.name AS host_name,
        u.email AS host_email
      FROM airbnb_secure."Activity" a
      LEFT JOIN airbnb_secure."User" u
        ON a.id_user = u.id_user
      WHERE a.id_activity = $1
      `,
      [id]
    );

    if (activity.rowCount === 0) {
      return res.status(404).json({ message: "Actividad no encontrada" });
    }

    res.json(activity.rows[0]);

  } catch (error) {
    console.error("Error getActivityById:", error);
    res.status(500).json({ message: "Error al obtener la actividad" });
  }
};