import React, { useEffect, useState } from "react";
import { useSaved } from "../../hooks/useSaved";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../style/Saved.css";
import BackButton from "../../components/BackButton";
import Navbar from "../../components/Navbar";
import Container from "../../components/Container";

const API = import.meta.env.VITE_IP_SERVER;

const SavedPage = () => {
  const { saved, toggleSave } = useSaved();
  const [fullData, setFullData] = useState([]);

    const formatPrice = (price) => {
    return "₡" + Number(price).toLocaleString("es-CR");
    };
  useEffect(() => {
    const loadDetails = async () => {
      const detailed = await Promise.all(
        saved.map(async (item) => {
          try {
            const res = await axios.get(
              `${API}/api/${item.item_type}/${item.item_id}`
            );
            return { ...item, data: res.data };
          } catch {
            return null;
          }
        })
      );

      setFullData(detailed.filter((d) => d !== null));
    };

    loadDetails();
  }, [saved]);

  return (
    <div className="saved-page">
      <Navbar />
      <Container>
      <BackButton to="/" className = 'back-btn'/>
      <h1>Mis guardados</h1>

      {fullData.length === 0 ? (
        <p className="empty-msg">No tienes elementos guardados aún</p>
      ) : (
        <div className="saved-grid">
          {fullData.map((item) => (
            <div key={item.id_saved} className="saved-card">
              <Link
                to={`/${item.item_type}/${item.item_id}`}
                className="saved-img-wrapper"
              >
                <img
                  src={item.data.image_url || "/house-placeholder.jpg"}
                  alt={item.data.name}
                />
              </Link>

              <div className="saved-info">
                <h3>{item.data.name}</h3>
                <p className="saved-type">
                  {item.item_type === "properties" && "Alojamiento"}
                  {item.item_type === "activities" && "Actividad"}
                  {item.item_type === "services" && "Servicio"}
                </p>

                {item.data.price && (
                  <p className="saved-price">
                    {formatPrice(item.data.price)} {item.item_type === "properties" ? "por noche" : ""}{item.item_type==="activities" && " por persona"}
                          {item.item_type==="services" && " por servicio"}
                  </p>
                )}

                <button
                  className="unsave-btn"
                  onClick={() => toggleSave(item.item_type, item.item_id)}
                >
                  Quitar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      </Container>
    </div>
  );
};

export default SavedPage;
