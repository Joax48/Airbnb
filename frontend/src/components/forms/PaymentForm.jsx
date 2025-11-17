import React, { useState } from "react";
import axios from "axios";


import "../../style/CheckoutForm.css";
import { useParams } from "react-router-dom";

const PaymentForm = ({ bookingId, date_start, date_end, onSuccess }) => {
  const [method, setMethod] = useState("VISA");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expDate, setExpDate] = useState("");

  let { type, id } = useParams();

  const typeMap = {
  properties: "Property",
  activities: "Activity",
  services: "Service"
  };

  type = typeMap[type];

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:4000/api/checkout/confirm", {
        idResource: bookingId,
        reservationType: type,
        method,
        cardNumber,
        cvv,
        expDate,
        date_start,
        date_end,
      });
      onSuccess(res.data);
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
        placeholder="1234567890123456"
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
