import { pool } from "../config/db.js";
// import getBookingById()


export const confirmPayment = async (req, res) => {
    const { idBooking, method, cardNumber, cvv, expDate } = req.body;
    // Primero buscar que el booking exista
    try {
        // const booking = await getBookingById(idBooking);
        // Mas validaciones llamar a un metodo validatePayment
        // token validation
        validatePayment(cardNumber, cvv, expDate, method);
        await pool.query(
            `INSERT INTO "Payment"(id_booking, method, status, token) VALUES ` +
            `($1,$2,'Approved',$3)`, [idBooking, method, '111']);
        
        res.status(201).json( { message: "Pago procesado exitosamente" });    
    } catch(error) {
        res.status(500).json({ message: error.message || "Error al procesar el pago"});
    }
}

const validatePayment = (cardNumber, cvv, expDate, method) => {
  if (!ispaymentBodyValid(cardNumber, expDate, cvv, method)) {
    throw new Error("Data missing");
  }
  if (!isMethodValid(method)) {
    throw new Error("Payment method not accepted");
  }
  if (cardNumber.length !== 16) {
    throw new Error("Card number has to be 16 digits long");
  }
  if (!isExpDateValid(expDate)) {
    throw new Error("Expiration date not accepted");
  }
  if (cvv.length !== 3 && cvv.length !== 4) {
    throw new Error("Cvv number not valid");
  }
  return true;
}

const ispaymentBodyValid = (cardNumber, expDate, cvv, method) => {
  return (
    typeof cardNumber === "string" &&
    typeof expDate === "string" &&
    typeof cvv === "string" &&
    typeof method === "string"
  );
}

const isExpDateValid = (expDate) => {
  let [monthStr, yearStr] = expDate.split("/");
  let month = parseInt(monthStr, 10);
  let year = parseInt(yearStr.length === 2 ? "20" + yearStr : yearStr, 10);

  const expiration = new Date(year, month, 0);
  const currentDate = new Date();
  const oneMonthsValidDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    currentDate.getDate()
  );

  return expiration >= oneMonthsValidDate;
}

const isMethodValid = (method) => {
    const validMehtods = ['VISA', 'MASTERCARD', 'AMERICAN EXPRESS'];
    return validMehtods.includes(method);
}

