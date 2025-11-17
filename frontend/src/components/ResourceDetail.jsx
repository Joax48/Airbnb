import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DateRange } from "react-date-range";
import { differenceInDays, endOfDay } from "date-fns";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { useSaved } from "../hooks/useSaved";
import { useAuth } from "../hooks/useAuth";
import LogInModal from "./Modals/LogInModal";

import "../style/ResourceDetail.css";

import BackButton from "./BackButton";
import Navbar from "./Navbar";
import Container from "./Container";

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

const ResourceDetail = ({ type }) => {
  const { id } = useParams();
  const [resource, setResource] = useState(null);

  const { saved, toggleSave, loadSaved } = useSaved();
  const { isAuthenticated } = useAuth();

  const [showLogin, setShowLogin] = useState(false);
  const [pendingSave, setPendingSave] = useState(null);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [nights, setNights] = useState(1);
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
      .get(`http://localhost:4000/api/${type}/${id}`)
      .then((res) => setResource(res.data))
      .catch((err) => console.error(err));
  }, [id, type]);

  if (!resource) return <p>Cargando...</p>;

  const idMap = {
    properties: resource.id_property,
    activities: resource.id_activity,
    services: resource.id_service,
  };

  const realId = idMap[type];

  const isSaved = saved.some(
    (s) => s.item_type === type && s.item_id === realId
  );

  const handleSave = async () => {
    if (!isAuthenticated) {
      setPendingSave({ type, id: realId });
      setShowLogin(true);
      return;
    }

    await toggleSave(type, realId);
    loadSaved();
  };

  const formatPrice = (price) => {
    return "₡" + Number(price).toLocaleString("es-CR");
  };

  return (
    <>
      <Navbar />

      <Container>
        <div className="resource-page">
          <BackButton to="/" className="back-btn" />

          <div className="resource-top">
            <h1>{resource.name}</h1>

            <button
              className={isSaved ? "save-small saved" : "save-small"}
              onClick={handleSave}
            >
              {isSaved ? "❤️ Guardado" : "🤍 Guardar"}
            </button>
          </div>

          <img
            src={resource.image_url || "/house-placeholder.jpg"}
            className="main-image"
            alt={resource.name}
          />

          <div className="two-columns">
            <div className="left-column">
              <h2>
                {resource.type} en {resource.location}
              </h2>

              <hr />

              <div className="host-profile">
                <div className="host-avatar">
                  {resource.host_name?.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h3>Anfitrión: {resource.host_name}</h3>
                  <p>{resource.host_email}</p>
                </div>
              </div>

              <hr />

              {/* DESCRIPCION */}
              <h2>Descripción</h2>
              <p>{resource.description}</p>

              <hr />

              {/* LO QUE OFRECE */}
              <h2>Lo que este lugar ofrece</h2>

              <div className="amenities-grid">
                {resource.amenities?.map((a) => {
                  const IconComponent = icons[a.icon];

                  return (
                    <div className="amenity" key={a.id_amenity}>
                      {IconComponent ? <IconComponent size={22} /> : "❓"}
                      <p>{a.name}</p>
                    </div>
                  );
                })}
              </div>

              <hr />

              {/* CALENDARIO */}
              <h2>Selecciona fechas</h2>

              <div className="calendar-section">
                <DateRange
                  ranges={[
                    {
                      startDate: startDate,
                      endDate: endDate,
                      key: "selection",
                    },
                  ]}
                  onChange={(range) => {
                    const s = range.selection.startDate; 
                    const e = range.selection.endDate;
                    setStartDate(s);
                    setEndDate(e);
                    setNights(Math.max(differenceInDays(e,s), 1));
                  }}
                  moveRangeOnFirstSelection={false}
                  rangeColors={["#ff385c"]}
                  months={2}
                  direction="horizontal"
                  showMonthAndYearPickers={false}
                />
              </div>
            </div>

            {/* COLUMNA DERECHA */}
            <div className="right-column">
              <div className="reservation-box">
                <p className="price-box">
                  {formatPrice(resource.price)}
                  <span> por noche</span>
                </p>

                <div className="reservation-inputs">
                  <div className="date-group">
                    <div>
                      <label>Llegada</label>
                      <input
                        type="text"
                        value={
                          resource.startDate
                            ? resource.startDate.toLocaleDateString("es-CR")
                            : ""
                        }
                        readOnly
                      />
                    </div>

                    <div>
                      <label>Salida</label>
                      <input
                        type="text"
                        value={
                          resource.endDate
                            ? resource.endDate.toLocaleDateString("es-CR")
                            : ""
                        }
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
                </div>

                {nights && (
                  <div className="right-subtotal">
                    <p>
                      {formatPrice(resource.price)} × {nights} noches
                    </p>
                    <h3>
                      Total:{" "}
                      {formatPrice(nights * resource.price)}
                    </h3>
                  </div>
                )}

                <button className="reserve-btn large"
                  onClick={() => {
                    navigate(`/checkout/${type}/${id}`, {
                      state: {
                        startDate: startDate,
                        endDate: endDate,
                        nights: nights,
                        price: resource.price,
                        total: nights * resource.price,
                      }
                    });
                  }}
                >
                  Reservar
                </button>

                <p className="no-charge">
                  No se hará ningún cargo por el momento.
                </p>
              </div>
            </div>
          </div>

          <hr />

          {/* MAPA */}
          <h2>Dónde estarás</h2>
          <p className="exact-location">{resource.location}</p>

          <div className="map-container">
            <iframe
              width="100%"
              height="380"
              style={{ border: 0 }}
              loading="lazy"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                resource.location
              )}&output=embed`}
            />
          </div>

          {showLogin && (
            <LogInModal
              onClose={() => setShowLogin(false)}
              onLoginSuccess={() => toggleSave(type, pendingSave?.id)}
            />
          )}
        </div>
      </Container>
    </>
  );
};

export default ResourceDetail;
