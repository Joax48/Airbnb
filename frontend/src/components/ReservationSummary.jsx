import React from "react";
import "../style/ReservationSummary.css"

const ReservationSummary = ({ startDate, endDate, nights, price, total }) => {
  return (
    <div className="checkout-summary">

      <h2>Tu reservación</h2>

      <div className="summary-box">
        <h3>Fechas</h3>
        <p><strong>Llegada:</strong> {new Date(startDate).toLocaleDateString("es-CR")}</p>
        <p><strong>Salida:</strong> {new Date(endDate).toLocaleDateString("es-CR")}</p>

        <h3>Costos</h3>
        <p>₡{price.toLocaleString("es-CR")} × {nights} noches</p>

        <h2>Total: ₡{total.toLocaleString("es-CR")}</h2>
      </div>

    </div>
  );
};

export default ReservationSummary;
