import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate  } from "react-router-dom";

import { useSaved } from "../../hooks/useSaved";
import { useAuth } from "../../hooks/useAuth";
import LogInModal from "../../components/Modals/LogInModal";

import BackButton from "../../components/BackButton";
import Navbar from "../../components/Navbar";
import Container from "../../components/Container";

import "../../style/ResourceDetail.css";

const API = import.meta.env.VITE_IP_SERVER;

const ActivityDetail = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);

  const { saved, toggleSave, loadSaved } = useSaved();
  const { isAuthenticated } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
    const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API}/api/activities/${id}`)
      .then((res) => setActivity(res.data))
      .catch(console.error);
  }, [id]);

  if (!activity) return <p>Cargando...</p>;

  const isSaved = saved.some(
    (s) => s.item_type === "activities" && s.item_id === activity.id_activity
  );

  const handleSave = async () => {
    if (!isAuthenticated) {
      setShowLogin(true);
      return;
    }
    await toggleSave("activities", activity.id_activity);
    loadSaved();
  };

  const handleReserve = () => {
  if (!isAuthenticated) {
    setShowLogin(true);
    return;
  }

  navigate(`/checkout/activities/${id}`, {
    state: {
      startDate: activity.date,
      endDate: activity.date,
      nights: 1,
      price: activity.price,
      total: activity.price,
      title: activity.name,
      image: activity.image_url,
      location: activity.location,
    },
  });
};

  const formatPrice = (p) => "₡" + Number(p).toLocaleString("es-CR");

  return (
    <>
      <Navbar />
      <Container>
        <BackButton to="/" />

        <div className="resource-page">

          {/* TOP */}
          <div className="resource-top">
            <h1>{activity.name}</h1>
            {activity.approved && (
            <button
              className={isSaved ? "save-small saved" : "save-small"}
              onClick={handleSave}
            >
              {isSaved ? "❤️ Guardado" : "🤍 Guardar"}
            </button> )}
          </div>

          {/* IMAGE */}
          <img
            src={activity.image_url || "/house-placeholder.jpg"}
            className="main-image"
            alt={activity.name}
          />

          <div className="two-columns">
            {/* LEFT */}
            <div className="left-column">

              <h2>{activity.category} en {activity.location}</h2>

              <hr />
           <div className="host-profile">
                <div className="host-avatar">
                  {activity.host_name?.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h3>Anfitrión: {activity.host_name}</h3>
                  <p>{activity.host_email}</p>
                </div>
              </div>

              <hr />
              <h2>Descripción</h2>
              <p>{activity.description}</p>

              <hr />

              <h2>Fecha del evento</h2>
              <p>{new Date(activity.date).toLocaleString("es-CR")}</p>

            </div>

            {/* RIGHT */}
            <div className="right-column">
              <div className="reservation-box">
                <p className="price-box">
                  {formatPrice(activity.price)} <span>por persona</span>
                </p>
                
                {activity.approved ? (
                  <>
                <div className="right-subtotal">
                  <h3>Total: {formatPrice(activity.price)}</h3>
                </div>

                <button className="reserve-btn large" onClick={handleReserve}>
                  Reservar
                </button>


                  <p className="no-charge">No se hará ningún cargo por ahora.</p></>
                ): (
                  <p
                    style={{
                      marginTop: "16px",
                      fontWeight: 600,
                      color: "#c62828",
                    }}
                  >
                    Este servicio aún no ha sido aprobado para reservas.
                  </p>
                )}

                
              </div>
            </div>
          </div>

          {/* MAP */}
          {activity.location && (
            <>
              <hr />

              <h2>Dónde estarás</h2>
              <p className="exact-location">{activity.location}</p>

              <div className="map-container">
                <iframe
                  width="100%"
                  height="380"
                  loading="lazy"
                  style={{ border: 0 }}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    activity.location
                  )}&output=embed`}
                />
              </div>
            </>
          )}

          {/* LOGIN MODAL */}
          {showLogin && (
            <LogInModal
              onClose={() => setShowLogin(false)}
              onLoginSuccess={() =>
                toggleSave("activities", activity.id_activity)
              }
            />
          )}
        </div>
      </Container>
    </>
  );
};

export default ActivityDetail;
