import React from "react";
import "../style/ReservationSummary.css";

const ReservationSummary = ({
  title,
  image,
  location,
  startDate,
  endDate,
  nights,
  price,
  total,
}) => {
  const formatPrice = (n) =>
    "₡" + Number(n).toLocaleString("es-CR");

  return (
    <div className="checkout-summary">

      <h2>Tu reservación</h2>

      {(image || title) && (
        <div className="summary-header">
          {image && <img src={image} alt={title} className="summary-image" />}
          <h3>{title}</h3>
        </div>
      )}

      <div className="summary-box">

  
        {location && (
          <>
            <h3>Ubicación</h3>
            <p>{location}</p>
          </>
        )}


        <h3>Fecha</h3>

        {nights && nights > 1 ? (
          <>

            <p>
              <strong>Llegada:</strong>{" "}
              {new Date(startDate).toLocaleDateString("es-CR")}
            </p>
            <p>
              <strong>Salida:</strong>{" "}
              {new Date(endDate).toLocaleDateString("es-CR")}
            </p>
            <p><strong>Noches:</strong> {nights}</p>
          </>
        ) : (
          <>
 
            <p>
              {new Date(startDate).toLocaleString("es-CR")}
            </p>
          </>
        )}

  
        <h3>Costos</h3>

        {nights && nights > 1 ? (
          <p>
            {formatPrice(price)} × {nights} noches
          </p>
        ) : (
          <p>{formatPrice(price)}</p>
        )}


        <h2>Total: {formatPrice(total)}</h2>
      </div>
    </div>
  );
};

export default ReservationSummary;
