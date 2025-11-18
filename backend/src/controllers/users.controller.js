import { pool } from "../config/db.js";

const parsePositiveInt = (val, def) => {
  const n = Number.parseInt(val, 10);
  return Number.isFinite(n) && n > 0 ? n : def;
};

const SORT_MAP = {
  id: 'u.id_user',
  name: 'u.name',
  email: 'u.email',
  role: 'u.role',
  properties: 'properties_count',
  activities: 'activities_count',
  bookings: 'bookings_count',
};

export const getAllUsers = async (req, res) => {
  try {

    const roleApp = (req.user?.role ?? '').toLowerCase();
    if (roleApp !== 'admin') return res.status(403).json({ message: 'Forbidden' });

    const page = parsePositiveInt(req.query.page, 1);
    const limit = Math.min(parsePositiveInt(req.query.limit, 10), 100);
    const offset = (page - 1) * limit;

    const q = (req.query.q ?? '').trim();
    const role = (req.query.role ?? '').trim().toLowerCase();
    const sortByKey = (req.query.sortBy ?? 'id').toLowerCase();
    const sortDir = (req.query.sortDir ?? 'desc').toLowerCase() === 'asc' ? 'asc' : 'desc';
    const sortBy = SORT_MAP[sortByKey] ?? SORT_MAP.id;

    const where = [];
    const params = [];
    let i = 1;

    if (q) {
      where.push(`(u.name ILIKE $${i} OR u.email ILIKE $${i})`);
      params.push(`%${q}%`);
      i++;
    }
    if (role === 'admin' || role === 'user') {
      where.push(`u.role = $${i}`);
      params.push(role);
      i++;
    }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const countSql = `
      SELECT COUNT(*)::int AS total
      FROM airbnb_secure."User" u
      ${whereSql}
    `;

    const listSql = `
      WITH props AS (
        SELECT id_user, COUNT(*)::int AS properties_count
        FROM airbnb_secure."Property"
        GROUP BY id_user
      ),
      acts AS (
        SELECT id_user, COUNT(*)::int AS activities_count
        FROM airbnb_secure."Activity"
        GROUP BY id_user
      ),
      books AS (
        SELECT id_user, COUNT(*)::int AS bookings_count
        FROM airbnb_secure."Booking"
        GROUP BY id_user
      )
      SELECT
        u.id_user                          AS id,
        u.name                              AS name,
        u.email                             AS email,
        u.role                              AS role,
        COALESCE(p.properties_count, 0)     AS "properties",
        COALESCE(a.activities_count, 0)     AS "activities",
        COALESCE(b.bookings_count, 0)       AS "bookings"
      FROM airbnb_secure."User" u
      LEFT JOIN props p ON p.id_user = u.id_user
      LEFT JOIN acts  a ON a.id_user = u.id_user
      LEFT JOIN books b ON b.id_user = u.id_user
      ${whereSql}
      ORDER BY ${sortBy} ${sortDir}
      LIMIT $${i} OFFSET $${i + 1}
    `;

    const [countResult, listResult] = await Promise.all([
      pool.query(countSql, params),
      pool.query(listSql, [...params, limit, offset]),
    ]);

    const total = countResult.rows[0]?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return res.json({
      data: listResult.rows,
      meta: {
        page,
        limit,
        total,
        totalPages,
        sortBy: sortByKey,
        sortDir,
        filters: { q: q || null, role: role || null },
      },
    });
  } catch (err) {
    console.error('[getAllUsers] Error:', err);
    return res.status(500).json({ message: 'Error interno de servidor' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const roleApp = (req.user?.role ?? '').toLowerCase();
    if (roleApp !== 'admin') return res.status(403).json({ message: 'Forbidden' });

    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Missing user id' });

    const { rows } = await pool.query(
      `
      WITH props AS (
        SELECT id_user, COUNT(*)::int AS properties_count
        FROM airbnb_secure."Property"
        GROUP BY id_user
      ),
      acts AS (
        SELECT id_user, COUNT(*)::int AS activities_count
        FROM airbnb_secure."Activity"
        GROUP BY id_user
      ),
      books AS (
        SELECT id_user, COUNT(*)::int AS bookings_count
        FROM airbnb_secure."Booking"
        GROUP BY id_user
      )
      SELECT
        u.id_user                          AS id,
        u.name                              AS name,
        u.email                             AS email,
        u.role                              AS role,
        COALESCE(p.properties_count, 0)     AS "properties",
        COALESCE(a.activities_count, 0)     AS "activities",
        COALESCE(b.bookings_count, 0)       AS "bookings"
      FROM airbnb_secure."User" u
      LEFT JOIN props p ON p.id_user = u.id_user
      LEFT JOIN acts  a ON a.id_user = u.id_user
      LEFT JOIN books b ON b.id_user = u.id_user
      WHERE u.id_user = $1
      `,
      [id]
    );

    if (rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    return res.json({ data: rows[0] });
  } catch (err) {
    console.error('[getUserById] Error:', err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

