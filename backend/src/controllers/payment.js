import { pool } from "../config/db.js";
import crypto from "crypto";


export const confirmPayment = async (req, res) => {
  const {
    reservationType,
    method,
    cardNumber,
    cvv,
    expDate,
    date_start,
    date_end,
    idResource
  } = req.body;

  try {
    const clientIp = req.ip || req.connection.remoteAddress;

    const userData = await getUserData(req.user.Id);

    // Validar que el recurso exista
    const reservation = await validateReservation(reservationType, idResource);
    if (!reservation) {
      await auditPaymentAttempt(
        userData.id_user,
        "[Payment]: Reservation not found",
        clientIp,
        userData.email,
        userData.role
      );
      return res.status(404).json({ message: "Reservation not found" });
    }

    // Validar fechas + que no exista una reserva previa del mismo recurso
    await ensureUserNotBooked(
      userData,
      reservationType,
      idResource,
      date_start,
      date_end,
      clientIp
    );

    // Validar método de pago y tarjeta
    await validatePayment(cardNumber, cvv, expDate, method, userData, clientIp);

    // Calcular total
    const totalNights = Math.max(differenceInDays(date_end, date_start), 1);
    const total = totalNights * reservation.price;

    const token = generateInvoice();

    // Registrar booking
    const newBooking = await createBooking(
      req.user.Id,
      idResource,
      reservationType,
      date_start,
      date_end,
      total,
      token
    );

    // Registrar pago
    await pool.query(
      `INSERT INTO "Payment"(id_booking, method, status, token)
       VALUES ($1, $2, 'Approved', $3)`,
      [newBooking.id_booking, method, token]
    );

    await auditPaymentAttempt(
      userData.id_user,
      "[Payment]: Reservation completed successfully",
      clientIp,
      userData.email,
      userData.role
    );

    res.status(201).json({ message: "Pago procesado exitosamente" });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message || "Error al procesar el pago"
    });
  }
};



const ensureUserNotBooked = async (userData, reservationType, idResource, start, end, ip) => {

  const newStart = new Date(start);
  const newEnd = new Date(end);
  const today = new Date();
  today.setHours(0,0,0,0);

  if (newStart < today) throw new Error("Start date cannot be in the past");
  if (newEnd < newStart) throw new Error("End date cannot be before start date");

  const result = await pool.query(
    `
      SELECT date_end 
      FROM "Booking"
      WHERE id_user = $1
        AND item_type = $2
        AND item_id = $3
    `,
    [userData.id_user, reservationType.toLowerCase(), idResource]
  );

  for (const row of result.rows) {
    const existingEnd = new Date(row.date_end);

    if (newStart <= existingEnd) {
      await auditPaymentAttempt(
        userData.id_user,
        "[Payment]: Reservation overlaps previous booking",
        ip,
        userData.email,
        userData.role
      );
      throw new Error("User already has a booking that overlaps");
    }
  }
};


const createBooking = async (
  id_user,
  idResource,
  reservationType,
  date_start,
  date_end,
  total,
  token
) => {
  const typeLower = reservationType.toLowerCase();

  const response = await pool.query(
    `
      INSERT INTO "Booking"
      (id_user, item_type, item_id, date_start, date_end, total, status, payment_token)
      VALUES ($1, $2, $3, $4, $5, $6, 'active', $7)
      RETURNING id_booking
    `,
    [id_user, typeLower, idResource, date_start, date_end, total, token]
  );

  return response.rows[0];
};


const validateReservation = async (reservationType, idResource) => {
  const map = {
    property: ["Property", "id_property"],
    activity: ["Activity", "id_activity"],
    service:  ["Service", "id_service"],
  };

  const entry = map[reservationType.toLowerCase()];
  if (!entry) throw new Error("Reservation type not valid");

  const [table, column] = entry;

  const result = await pool.query(
    `SELECT * FROM "${table}" WHERE ${column} = $1`,
    [idResource]
  );

  return result.rows[0];
};


const validatePayment = async (cardNumber, cvv, expDate, method, userData, ip) => {
  if (!isPaymentBodyValid(cardNumber, expDate, cvv, method)) {
    throw new Error("Data missing");
  }

  if (!isMethodValid(method)) {
    await auditPaymentAttempt(
      userData.id_user, "[Payment]: Method not valid", ip, userData.email, userData.role
    );
    throw new Error("Payment method not accepted");
  }

  if (cardNumber.length !== 16) {
    await auditPaymentAttempt(
      userData.id_user, "[Payment]: Card number not valid", ip, userData.email, userData.role
    );
    throw new Error("Card number has to be 16 digits long");
  }

  if (!isExpDateValid(expDate)) {
    await auditPaymentAttempt(
      userData.id_user, "[Payment]: Exp date not valid", ip, userData.email, userData.role
    );
    throw new Error("Expiration date not accepted");
  }

  if (cvv.length !== 3 && cvv.length !== 4) {
    await auditPaymentAttempt(
      userData.id_user, "[Payment]: CVV number not valid", ip, userData.email, userData.role
    );
    throw new Error("CVV number not valid");
  }

  return true;
};



const isPaymentBodyValid = (cardNumber, expDate, cvv, method) => 
  typeof cardNumber === "string" &&
  typeof expDate === "string" &&
  typeof cvv === "string" &&
  typeof method === "string";

const isExpDateValid = (expDate) => {
  const [monthStr, yearStr] = expDate.split("/");
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr.length === 2 ? "20" + yearStr : yearStr, 10);

  if (isNaN(month) || isNaN(year) || month < 1 || month > 12) return false;

  const expiration = new Date(year, month, 0);
  const now = new Date();

  const validDate = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate()
  );

  return expiration >= validDate;
};

const isMethodValid = (method) => {
  const validMethods = ['VISA', 'MASTERCARD', 'AMERICAN EXPRESS'];
  return validMethods.includes(method);
};

const generateInvoice = () => {
  const random = crypto.randomBytes(4).toString("hex").toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase();
  return `INV-${timestamp}-${random}`;
};

const differenceInDays = (end, start) => {
  const d1 = new Date(start);
  const d2 = new Date(end);
  d1.setHours(0,0,0,0);
  d2.setHours(0,0,0,0);
  return Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
};

const auditPaymentAttempt = async (id_user, action, ip, email, role) => {
  try {
    await pool.query(
      `
        INSERT INTO "AuditLog"
        (user_id, action, ip_address, user_email, user_role)
        VALUES ($1, $2, $3, $4, $5)
      `,
      [id_user, action, ip, email, role]
    );
  } catch (err) {
    console.error("Error auditando el intento de compra", err.message);
  }
};

const getUserData = async (userId) => {
  const result = await pool.query(
    `SELECT id_user, name, email, role FROM "User" WHERE id_user = $1`,
    [userId]
  );
  return result.rows[0];
};
