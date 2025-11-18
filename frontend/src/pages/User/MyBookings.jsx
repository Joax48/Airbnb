import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Container from "../../components/Container";
import { FaRegClock } from "react-icons/fa";

import "../../style/MyBookings.css";

const API = import.meta.env.VITE_IP_SERVER;

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    axios
      .get(`${API}/api/bookings/my`, { withCredentials: true })
      .then((res) => {
        const sorted = res.data.sort(
          (a, b) => new Date(b.date_start) - new Date(a.date_start)
        );
        setBookings(sorted);
        setFiltered(sorted);
      })
      .catch(console.error);
  }, []);

  const applyFilter = (value) => {
    setFilterType(value);

    if (value === "all") {
      setFiltered(bookings);
      return;
    }

    const result = bookings.filter((b) => {
      if (value === "properties") return b.item_type === "property";
      if (value === "activities") return b.item_type === "activity";
      if (value === "services") return b.item_type === "service";
      return true;
    });

    setFiltered(result);
  };

  const getType = (b) => {
    if (b.item_type === "property") return "Alojamiento";
    if (b.item_type === "activity") return "Actividad";
    if (b.item_type === "service") return "Servicio";
    return "Desconocido";
  };

  const getName = (b) => b.resource_name;

  const getImage = (b) => b.resource_image;

  return (
    <>
      <Navbar />

      <Container>
        <div className="my-bookings-page">
          <h1 className="my-bookings-title">Mis Reservaciones</h1>

          <div className="booking-filter">
            <select
              value={filterType}
              onChange={(e) => applyFilter(e.target.value)}
              className="booking-filter-select"
            >
              <option value="all">Todos</option>
              <option value="properties">Alojamientos</option>
              <option value="activities">Actividades</option>
              <option value="services">Servicios</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <p className="empty-bookings">No tienes reservaciones aún.</p>
          ) : (
            <div className="bookings-list">
              {filtered.map((b) => (
                <div key={b.id_booking} className="booking-card">

                  {/* COLUMNA 1 — Imagen */}
                  <img
                    src={getImage(b)}
                    alt={getName(b)}
                    className="booking-img"
                  />

                  {/* COLUMNA 2 — Información */}
                  <div className="booking-info">
                    <h3 className="booking-title">{getName(b)}</h3>
                    <p className="booking-type">{getType(b)}</p>

                    <p className="booking-date">
                      <strong>Desde:</strong>{" "}
                      {new Date(b.date_start).toLocaleDateString("es-CR")}
                    </p>

                    <p className="booking-date">
                      <strong>Hasta:</strong>{" "}
                      {new Date(b.date_end).toLocaleDateString("es-CR")}
                    </p>

                    <p className="booking-total">
                      Total: ₡{Number(b.total).toLocaleString("es-CR")}
                    </p>
                  </div>

                  {/* COLUMNA 3 — Botón Reagendar */}
                  <div className="booking-actions">
                    <button
                      className="booking-reschedule-btn"
                      onClick={() => {
                        if (b.item_type === "property")
                          window.location.href = `/properties/${b.item_id}`;

                        if (b.item_type === "activity")
                          window.location.href = `/activities/${b.item_id}`;

                        if (b.item_type === "service")
                          window.location.href = `/services/${b.item_id}`;
                      }}
                    >
                      <FaRegClock className="booking-icon" />
                      Reagendar
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </>
  );
};

export default MyBookings;
