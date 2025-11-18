import React, { useEffect, useState } from "react";
import { useParams, useNavigate  } from "react-router-dom";
import { DateRange } from "react-date-range";
import { differenceInDays } from "date-fns";
import axios from "axios";

import {
  MdWifi,
  MdPool,
  MdLocalLaundryService,
  MdKitchen,
  MdOutlineLocalParking,
  MdSmokingRooms,
  MdOutlineCameraAlt,
} from "react-icons/md";
import { FaFireExtinguisher } from "react-icons/fa6";

import { useSaved } from "../../hooks/useSaved";
import { useAuth } from "../../hooks/useAuth";
import LogInModal from "../../components/Modals/LogInModal";

import BackButton from "../../components/BackButton";
import Navbar from "../../components/Navbar";
import Container from "../../components/Container";

import "../../style/ResourceDetail.css";

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);

  const { saved, toggleSave, loadSaved } = useSaved();
  const { isAuthenticated } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [pendingSave, setPendingSave] = useState(null);
  const navigate = useNavigate();


  const icons = {
    MdWifi,
    MdPool,
    MdLocalLaundryService,
    MdKitchen,
    MdOutlineLocalParking,
    MdSmokingRooms,
    MdOutlineCameraAlt,
    FaFireExtinguisher,
  };

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/properties/${id}`)
      .then((res) => setProperty(res.data))
      .catch(console.error);
  }, [id]);

  if (!property) return <p>Cargando...</p>;

  const realId = property.id_property;

  const isSaved = saved.some(
    (s) => s.item_type === "properties" && s.item_id === realId
  );

  const handleSave = async () => {
    if (!isAuthenticated) {
      setPendingSave({ type: "properties", id: realId });
      setShowLogin(true);
      return;
    }
    await toggleSave("properties", realId);
    loadSaved();
  };
const handleReserve = () => {
  if (!isAuthenticated) {
    setShowLogin(true);
    return;
  }

  if (!property.startDate || !property.endDate || !property.nights) {
    alert("Debes seleccionar fechas antes de reservar.");
    return;
  }

  navigate(`/checkout/properties/${id}`, {
    state: {
      startDate: property.startDate,
      endDate: property.endDate,
      nights: property.nights,
      price: property.price,
      total: property.price * property.nights,
      title: property.name,
      image: property.image_url,
      location: property.location,
    },
  });
};



  const formatPrice = (n) => "₡" + Number(n).toLocaleString("es-CR");

  return (
    <>
      <Navbar />
      <Container>
        <BackButton to="/" />
        <div className="resource-page">

          {/* TOP INFO */}
          <div className="resource-top">
            <h1>{property.name}</h1>
            {property.approved && (
            <button
              className={isSaved ? "save-small saved" : "save-small"}
              onClick={handleSave}
            >
              {isSaved ? "❤️ Guardado" : "🤍 Guardar"}
            </button> )}
          </div>

          {/* IMAGE */}
          <img
            src={property.image_url || "/house-placeholder.jpg"}
            className="main-image"
            alt={property.name}
          />

          <div className="two-columns">
            {/* LEFT */}
            <div className="left-column">
              <h2>{property.type} en {property.location}</h2>

              <hr />
              <div className="host-profile">
                <div className="host-avatar">
                  {property.host_name?.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h3>Anfitrión: {property.host_name}</h3>
                  <p>{property.host_email}</p>
                </div>
              </div>

              <hr />
              <h2>Descripción</h2>
              <p>{property.description}</p>
              <hr />

              {/* AMENITIES */}
              {property.amenities?.length > 0 && (
                <>
              <h2>Lo que este lugar ofrece</h2>
              <div className="amenities-grid">
                {property.amenities?.map((a) => {
                  const Icon = icons[a.icon];
                  return (
                    <div className="amenity" key={a.id_amenity}>
                      {Icon ? <Icon size={22} /> : "❓"}
                      <p>{a.name}</p>
                    </div>
                  );
                })}
              </div>
              <hr /></>)}

              {/* CALENDAR */}
              <h2>Selecciona fechas</h2>

              <div className="calendar-section">
                <DateRange
                  ranges={[{
                    startDate: property.startDate || new Date(),
                    endDate: property.endDate || new Date(),
                    key: "selection",
                  }]}
                  onChange={(range) => {
                    const { startDate, endDate } = range.selection;
                    setProperty((prev) => ({
                      ...prev,
                      startDate,
                      endDate,
                      nights: Math.max(differenceInDays(endDate, startDate), 1),
                    }));
                  }}
                  moveRangeOnFirstSelection={false}
                  months={2}
                  direction="horizontal"
                  rangeColors={["#ff385c"]}
                />
              </div>
            </div>

            {/* RIGHT */}
            <div className="right-column">
              <div className="reservation-box">
                <p className="price-box">
                  {formatPrice(property.price)} <span>por noche</span>
                </p>

                {property.startDate && property.nights && (
                  <div className="reservation-inputs">
                    <div className="date-group">
                      <div>
                        <label>Llegada</label>
                        <input
                          type="text"
                          value={property.startDate.toLocaleDateString("es-CR")}
                          readOnly
                        />
                      </div>

                      <div>
                        <label>Salida</label>
                        <input
                          type="text"
                          value={property.endDate.toLocaleDateString("es-CR")}
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="guests-box">
                      <label>Huéspedes</label>
                      <select>
                        <option>1 huésped</option>
                        <option>2 huéspedes</option>
                      </select>
                    </div>

                    <div className="right-subtotal">
                      <p>
                        {formatPrice(property.price)} × {property.nights} noches
                      </p>
                      <h3>
                        Total: {formatPrice(property.price * property.nights)}
                      </h3>
                    </div>
                  </div>
                )}

                {property.approved ? ( 
                  <> 
                <button className="reserve-btn large" onClick={handleReserve}>
                  Reservar
                </button>


                <p className="no-charge">No se hará ningún cargo por ahora.</p></>) :  (
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

          <hr />

          {/* MAP */}
          <h2>Dónde estarás</h2>
          <p className="exact-location">{property.location}</p>

          <div className="map-container">
            <iframe
              width="100%"
              height="380"
              loading="lazy"
              style={{ border: 0 }}
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                property.location
              )}&output=embed`}
            />
          </div>

          {showLogin && (
            <LogInModal
              onClose={() => setShowLogin(false)}
              onLoginSuccess={() => toggleSave("properties", realId)}
            />
          )}
        </div>
      </Container>
    </>
  );
};

export default PropertyDetail;
