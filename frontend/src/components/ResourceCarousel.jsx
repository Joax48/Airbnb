import React from "react";
import { Link } from "react-router-dom";
import "../style/ResourceCarousel.css";

const ResourceCarousel = ({ title, items, type, filterKey }) => {
  if (!items || items.length === 0) return null;

  const limited = items.slice(0, 10);

  return (
    <div className="resource-carousel">
      <div className="resource-carousel-header">
        <h2>{title}</h2>

        {/* Botón Ver todo */}
        <Link
        to={`/explore/${type}?category=${encodeURIComponent(filterKey)}`}
        className="view-all-btn"
        >
        Ver todo →
        </Link>

      </div>

      <div className="carousel-container">
        {limited.map((p) => (
          <Link
            key={p.id_property || p.id_activity || p.id_service}
            to={`/${type}/${p.id_property || p.id_activity || p.id_service}`}
            className="carousel-card"
          >
            <img src={p.image_url || "/house-placeholder.jpg"} alt={p.name} />
            <div className="carousel-info">
              <h3>{p.name}</h3>
              {p.location && <p className="car-location">{p.location}</p>}
              {p.price && (
                <span className="car-price">
                  {"₡" + Number(p.price).toLocaleString("es-CR")}{type === "properties" ? " por noche" : ""}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ResourceCarousel;
