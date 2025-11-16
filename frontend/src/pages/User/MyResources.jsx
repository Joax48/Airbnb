import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Navbar from "../../components/Navbar";
import Container from "../../components/Container";
import BackButton from "../../components/BackButton";
import "../../style/MyResources.css";

const MyResourcesPage = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);

  const formatPrice = (price) => {
    return "₡" + Number(price).toLocaleString("es-CR");
  };

  useEffect(() => {
    if (!user) return;

    axios
      .get(`http://localhost:4000/api/resources/by-user/${user.id_user}`)
      .then((res) => setResources(res.data))
      .catch((err) => console.error(err));
  }, [user]);

  const properties = resources.filter((r) => r.item_type === "properties");
  const activities = resources.filter((r) => r.item_type === "activities");
  const services = resources.filter((r) => r.item_type === "services");

  const renderSection = (title, list) => (
    <section className="resource-section">
      <h2>{title}</h2>

      {list.length === 0 ? (
        <p className="empty-sub">No tienes {title.toLowerCase()} publicados.</p>
      ) : (
        <div className="resources-grid">
          {list.map((item) => (
            <div key={item.item_type + item.id} className="resource-card">
              <Link
                to={`/${item.item_type}/${item.id}`}
                className="resource-img-wrapper"
              >
                <img
                  src={item.image_url || "/house-placeholder.jpg"}
                  alt={item.name}
                />
              </Link>

              <div className="resource-info">
                <h3>{item.name}</h3>

                {item.price && (
                  <p className="resource-price">{formatPrice(item.price)}</p>
                )}

                <Link
                  to={`/${item.item_type}/${item.id}`}
                  className="view-btn"
                >
                  Ver detalles
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );

  return (
    <div className="myresources-page">
      <Navbar />
      <Container>
        <BackButton to="/" className="back-btn" />

        <h1>Mis recursos publicados</h1>

        {resources.length === 0 ? (
          <p className="empty-msg">Aún no has publicado ningún recurso.</p>
        ) : (
          <>
            {renderSection("Alojamientos", properties)}
            {renderSection("Actividades", activities)}
            {renderSection("Servicios", services)}
          </>
        )}
      </Container>
    </div>
  );
};

export default MyResourcesPage;
