import { pool } from "../config/db.js";

export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user?.Id || req.user?.id_user;

    if (!userId) {
      return res.status(403).json({ message: "Usuario no autenticado" });
    }

    const result = await pool.query(
      `
      SELECT 
        b.id_booking,
        b.item_type,
        b.item_id,
        b.date_start,
        b.date_end,
        b.total,
        b.status,
        
        -- nombre según tipo
        CASE 
          WHEN b.item_type = 'property' THEN p.name
          WHEN b.item_type = 'activity' THEN a.name
          WHEN b.item_type = 'service'  THEN s.name
        END AS resource_name,

        -- imagen según tipo
        CASE 
          WHEN b.item_type = 'property' THEN p.image_url
          WHEN b.item_type = 'activity' THEN a.image_url
          WHEN b.item_type = 'service'  THEN s.image_url
        END AS resource_image

      FROM airbnb_secure."Booking" b
      LEFT JOIN "Property"  p ON (b.item_type = 'property' AND b.item_id = p.id_property)
      LEFT JOIN "Activity"  a ON (b.item_type = 'activity' AND b.item_id = a.id_activity)
      LEFT JOIN "Service"   s ON (b.item_type = 'service'  AND b.item_id = s.id_service)
      
      WHERE b.id_user = $1
      ORDER BY b.date_start DESC
      `,
      [userId]
    );

    res.json(result.rows);

  } catch (error) {
    console.error("Error al obtener bookings del usuario:", error);
    res.status(500).json({ message: "Error al cargar reservaciones" });
  }
};
