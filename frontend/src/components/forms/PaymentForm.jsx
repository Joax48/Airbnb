import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate  } from "react-router-dom";
import "../../style/CheckoutForm.css";

const API = import.meta.env.VITE_IP_SERVER;

const PaymentForm = ({ bookingId, date_start, date_end, onSuccess }) => {
  const [method, setMethod] = useState("VISA");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expDate, setExpDate] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();


  let { type } = useParams();

  // Mapeo correcto a la estructura del backend
  const typeMap = {
    properties: "Property",
    activities: "Activity",
    services: "Service",
  };

  const reservationType = typeMap[type];

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      `${API}/api/checkout/confirm`,
      {
        idResource: bookingId,
        reservationType,
        method,
        cardNumber,
        cvv,
        expDate,
        date_start,
        date_end,
      }
    );

    setMessage("¡Pago realizado con éxito!");
    setSuccess(true);

    // Desaparece después de 3 segundos y redirige
    setTimeout(() => {
      setSuccessMessage("");
      setSuccess(false);
      navigate("/"); // redirige al home
    }, 3000);

    onSuccess(res.data);

  } catch (error) {
    setMessage(error.response?.data?.message || "Error al procesar el pago"); // limpiar mensaje anterior
    setSuccess(false);
  }
};


  return (
    <form className="payment-form" onSubmit={handleSubmit}>
      {message && (
        <div className={ success ? "success-message" : "err-message"}>
          {message}
        </div>
      )}

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
