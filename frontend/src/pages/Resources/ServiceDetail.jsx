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

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);

  const { saved, toggleSave, loadSaved } = useSaved();
  const { isAuthenticated } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  const [requestLocation, setRequestLocation] = useState("");
  const [requestDate, setRequestDate] = useState("");

  useEffect(() => {
    axios
      .get(`${API}/api/services/${id}`)
      .then((res) => setService(res.data))
      .catch(console.error);
  }, [id]);

  if (!service) return <p>Cargando...</p>;

  const isSaved = saved.some(
    (s) => s.item_type === "services" && s.item_id === service.id_service
  );

  const handleSave = async () => {
    if (!isAuthenticated) {
      setShowLogin(true);
      return;
    }
    await toggleSave("services", service.id_service);
    loadSaved();
  };
  const handleReserve = () => {
  if (!isAuthenticated) {
    setShowLogin(true);
    return;
  }

  if (!requestLocation.trim() || !requestDate.trim()) {
    alert("Debe completar la ubicación y la fecha del servicio.");
    return;
  }

  navigate(`/checkout/services/${id}`, {
    state: {
      startDate: requestDate,
      endDate: requestDate,
      nights: 1,
      price: service.price,
      total: service.price,
      title: service.name,
      image: service.image_url,
      location: requestLocation,
    },
  });
};


  const formatPrice = (p) => "₡" + Number(p).toLocaleString("es-CR");

  const handleReservation = () => {
    if (!requestLocation.trim() || !requestDate.trim()) {
      alert("Debe completar la ubicación y la fecha del servicio.");
      return;
    }

    alert("Simulación: reserva enviada correctamente.");
  };

  return (
    <>
      <Navbar />
      <Container>
        <BackButton to="/" />

        <div className="resource-page">

          {/* TITULO + GUARDAR */}
          <div className="resource-top">
            <h1>{service.name}</h1>

            {service.approved && (
              <button
                className={isSaved ? "save-small saved" : "save-small"}
                onClick={handleSave}
              >
                {isSaved ? "❤️ Guardado" : "🤍 Guardar"}
              </button>
            )}
          </div>

          {/* IMAGEN */}
          <img
            src={service.image_url || "/house-placeholder.jpg"}
            className="main-image"
            alt={service.name}
          />

          <div className="two-columns">

            {/* LEFT COLUMN */}
            <div className="left-column">
              <h2>{service.type}</h2>

              <hr />
              <h2>Descripción</h2>
              <p>{service.description}</p>

              <hr />
            </div>

            {/* RIGHT COLUMN */}
            <div className="right-column">
              <div className="reservation-box">
                <p className="price-box">
                  {formatPrice(service.price)}
                  <span> por servicio</span>
                </p>

                {service.approved ? (
                  <div className="reservation-inputs">

                    {/* Ubicación */}
                    <div className="location-box">
                      <label>¿Dónde desea recibir el servicio? *</label>
                      <input
                        type="text"
                        placeholder="Ej: Casa en San José, Condominio XYZ…"
                        value={requestLocation}
                        onChange={(e) => setRequestLocation(e.target.value)}
                      />
                    </div>

                    {/* Fecha/Hora */}
                    <div className="datetime-box">
                      <label>Fecha y hora *</label>
                      <input
                        type="datetime-local"
                        value={requestDate}
                        onChange={(e) => setRequestDate(e.target.value)}
                      />
                    </div>

                    {/* Subtotal */}
                    <div className="right-subtotal">
                      <h3>Total: {formatPrice(service.price)}</h3>
                    </div>

                    {/* Reservar */}
                <button className="reserve-btn large" onClick={handleReserve}>
                  Reservar
                </button>


                  </div>
                ) : (
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

          {/* MODAL LOGIN */}
          {showLogin && (
            <LogInModal
              onClose={() => setShowLogin(false)}
              onLoginSuccess={() => toggleSave("services", service.id_service)}
            />
          )}
        </div>
      </Container>
    </>
  );
};

export default ServiceDetail;
