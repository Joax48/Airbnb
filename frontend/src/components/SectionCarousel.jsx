import React from "react";
import "../style/SectionCarousel.css";

const SectionCarousel = ({ title, items }) => {
  return (
    <section className="carousel-section">
      <div className="carousel-header">
        <h2>{title}</h2>
        <a href="#" className="view-more">Ver más →</a>
      </div>

      <div className="carousel-container">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id_property} className="carousel-card">
              <img
                src={item.image_url || "/house-placeholder.jpg"}
                alt={item.name}
              />
              <div className="card-info">
                <h3>{item.name}</h3>
                <p>{item.location}</p>
                <span className="price">₡{item.price.toLocaleString()} / noche</span>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">No hay resultados disponibles</p>
        )}
      </div>
    </section>
  );
};

export default SectionCarousel;
