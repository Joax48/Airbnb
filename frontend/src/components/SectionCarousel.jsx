import React from "react";
import { Link } from "react-router-dom";
import "../style/SectionCarousel.css";

const SectionCarousel = ({ title, items, type, limit = 4 }) => {
  const formatPrice = (price) => {
    return "₡" + Number(price).toLocaleString("es-CR");
  };

  return (
    <section className="carousel-section">
      <div className="carousel-header">
        <h2>{title}</h2>
        <Link to={`/${type}`} className="view-more">Ver más →</Link>
      </div>

      <div className="carousel-container">
        {items.length > 0 ? (
          items.slice(0, limit).map((item) => {
            const id =
              item.id_property ||
              item.id_activity ||
              item.id_service;

            return (
              <Link
                key={id}
                to={`/${type}/${id}`}
                className="carousel-card"
              >
                <img
                  src={item.image_url || "/house-placeholder.jpg"}
                  alt={item.name}
                />

                <div className="card-info">
                  <h3>{item.name}</h3>

                  {item.location && <p>{item.location}</p>}
                  {item.date && (
                    <p>{new Date(item.date).toLocaleDateString()}</p>
                  )}

                  {item.price && (
                    <span className="price">
                      {formatPrice(item.price)} {type === "properties" ? "por noche" : ""}
                    </span>
                  )}
                </div>
              </Link>
            );
          })
        ) : (
          <p className="no-results">No hay resultados</p>
        )}
      </div>
    </section>
  );
};


export default SectionCarousel;
