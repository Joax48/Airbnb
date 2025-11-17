import React, { useState } from "react";
import axios from "axios";

import "../../style/CheckoutForm.css";

const PaymentForm = ({ bookingId, onSuccess }) => {
  const [method, setMethod] = useState("VISA");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expDate, setExpDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
    //   const res = await axios.post("http://localhost:4000/api/payment/confirm", {
    //     idBooking: bookingId,
    //     method,
    //     cardNumber,
    //     cvv,
    //     expDate,
    //   });
    //   onSuccess(res.data);
    console.log("Prueba");
    } catch (error) {
      alert(error.response?.data?.message || "Error al procesar el pago");
    }
  };

  return (
    <form className="payment-form" onSubmit={handleSubmit}>
      <h2>Detalles de pago</h2>

      <label>Método</label>
      <select value={method} onChange={(e) => setMethod(e.target.value)}>
        <option value="VISA">Visa</option>
        <option value="MASTERCARD">Mastercard</option>
        <option value="AMERICAN EXPRESS">American Express</option>
      </select>

      <label>Número de tarjeta</label>
      <input
        type="text"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
        placeholder="1234 5678 9012 3456"
      />

      <label>Fecha expiración (MM/AA)</label>
      <input
        type="text"
        value={expDate}
        onChange={(e) => setExpDate(e.target.value)}
        placeholder="07/27"
      />

      <label>CVV</label>
      <input
        type="text"
        value={cvv}
        onChange={(e) => setCvv(e.target.value)}
        placeholder="123"
      />

      <button className="reserve-btn large" type="submit">
        Pagar ahora
      </button>
    </form>
  );
};

export default PaymentForm;
