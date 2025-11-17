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
    const reservation = await validateReservation(reservationType, idResource);
    const userData = await getUserData(req.user.Id);
    if (!reservation) {
      await auditPaymentAttempt(req.user.Id, "[Payment]: Reservation not found", clientIp,
        userData.email, userData.role
      );
      return res.status(404).json({ message: "Reservation not found" });
    }

    await ensureUserNotBooked(userData, reservationType, idResource, date_start, date_end, clientIp);

    await validatePayment(cardNumber, cvv, expDate, method, userData, clientIp);

    const totalNights = Math.max(differenceInDays(date_end, date_start), 1);

    if (totalNights <= 0) {
      return res.status(400).json({ message: "Invalid dates" })
    }

    const total = totalNights * reservation.price;
  
    const token = generateInvoice();

    const newBooking = await createBooking(
      req.user.Id,
      idResource,
      reservationType,
      date_start,
      date_end,
      total,
      token
    );

    await pool.query(
      `INSERT INTO "Payment"(id_booking, method, status, token)
       VALUES ($1,$2,'Approved',$3)`,
      [newBooking.id_booking, method, token]
    );
    await auditPaymentAttempt(userData.id_user, "[Payment]: Reservation completed successfully", clientIp,
        userData.email, userData.role
      );
    res.status(201).json({ message: "Pago procesado exitosamente" });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message || "Error al procesar el pago"
    });
  }
};

const ensureUserNotBooked = async (userData, reservationType, idResource, start, end, clientIp) => {
  const types = {
    Property: "id_property",
    Activity: "id_activity",
    Service: "id_service",
  };

  const column = types[reservationType];
  if (!column) throw new Error("Reservation type not valid");

  const newStart = new Date(start);
  const newEnd = new Date(end);
  const today = new Date();
  today.setHours(0,0,0,0);

  if (newStart < today) {
    throw new Error("Start date cannot be in the past");
  }

  if (newEnd < newStart) {
    throw new Error("End date cannot be before start date");
  }

  const result = await pool.query(
    `
    SELECT date_end 
    FROM "Booking"
    WHERE id_user = $1
      AND ${column} = $2
    `,
    [userData.id_user, idResource]
  );

  for (const row of result.rows) {
    const existingEnd = new Date(row.date_end);

    if (newStart <= existingEnd) {
      await auditPaymentAttempt(userData.id_user, "[Payment]: Reservation overlaps previous booking", clientIp,
        userData.email, userData.role
      );
      throw new Error("User already has a booking that ends after the new start date");
    }
  }
};



const createBooking = async (
  user,
  id_booking,
  reservationType,
  date_start,
  date_end,
  total,
  token
) => {
  const types = {
    Property: "id_property",
    Activity: "id_activity",
    Service: "id_service",
  };

  const column = types[reservationType];
  if (!column) throw new Error("Reservation type not valid");

  const columns = {
    id_property: null,
    id_activity: null,
    id_service: null,
  };

  columns[column] = id_booking;

  const response = await pool.query(
    `INSERT INTO "Booking"(id_user, id_property, id_activity, id_service,
      date_start, date_end, total, status, payment_token)
     VALUES ($1,$2,$3,$4,$5,$6,$7,'active',$8)
     RETURNING id_booking`,
    [
      user,
      columns.id_property,
      columns.id_activity,
      columns.id_service,
      date_start,
      date_end,
      total,
      token
    ]
  );

  return response.rows[0];
};


const validateReservation = async (reservationType, idResource) => {
  const map = {
    Property: ["Property", "id_property"],
    Activity: ["Activity", "id_activity"],
    Service: ["Service", "id_service"],
  };

  const entry = map[reservationType];
  if (!entry) throw new Error("Reservation type not valid");

  const [table, column] = entry;

  const result = await pool.query(
    `SELECT * FROM "${table}" WHERE ${column} = $1`,
    [idResource]
  );
  return result.rows[0];
};

const validatePayment = async (cardNumber, cvv, expDate, method, userData, clientIp) => {
  if (!isPaymentBodyValid(cardNumber, expDate, cvv, method)) {
    throw new Error("Data missing");
  }
  if (!isMethodValid(method)) {
    await auditPaymentAttempt(userData.id_user, "[Payment]: Method not valid", clientIp,
        userData.email, userData.role
    );
    throw new Error("Payment method not accepted");
  }
  if (cardNumber.length !== 16) {
    await auditPaymentAttempt(userData.id_user, "[Payment]: Card number not valid", clientIp,
        userData.email, userData.role
    );
    throw new Error("Card number has to be 16 digits long");
  }
  if (!isExpDateValid(expDate)) {
    await auditPaymentAttempt(userData.id_user, "[Payment]: Exp date not valid", clientIp,
        userData.email, userData.role
    );
    throw new Error("Expiration date not accepted");
  }
  if (cvv.length !== 3 && cvv.length !== 4) {
    await auditPaymentAttempt(userData.id_user, "[Payment]: Cvv number not valid", clientIp,
        userData.email, userData.role
    );
    throw new Error("CVV number not valid");
  }
  return true;
};

const isPaymentBodyValid = (cardNumber, expDate, cvv, method) => { 
  return (
    typeof cardNumber === "string" &&
    typeof expDate === "string" &&
    typeof cvv === "string" &&
    typeof method === "string"
  );
};

const isExpDateValid = (expDate) => {
  const [monthStr, yearStr] = expDate.split("/");
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr.length === 2 ? "20" + yearStr : yearStr, 10);

  if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
    return false;
  }

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
  const diff = (d2 - d1) / (1000 * 60 * 60 * 24);
  return Math.ceil(diff);
};

const auditPaymentAttempt = async (id_user, action, ip, email, role) => {
  try {
    await pool.query(
      'INSERT INTO "AuditLog" (user_id, action, ip_address, user_email, user_role) VALUES ' +
      '($1, $2, $3, $4, $5)', [id_user, action, ip, email, role]
    );
  } catch (error) {
    console.error("Error auditando el intento de compra", error.message);
  }
}

const getUserData = async (userId) => {
  try {
    const result = await pool.query(
      'SELECT id_user, name, email, role FROM "User" WHERE id_user = $1',
      [userId]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(error.message);
  }
}
