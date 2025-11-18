import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Container from "../../components/Container";
import SearchBar from "../../components/SearchBar";
import ResourceCarousel from "../../components/ResourceCarousel";

const API = import.meta.env.VITE_IP_SERVER;

const ActivitiesPage = () => {
  const [activities, setActivities] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    axios
      .get(`${API}/api/activities`)
      .then((res) => {
        setActivities(res.data);
        setFiltered(res.data);
      })
      .catch(console.error);
  }, []);

  const handleSearch = ({ location, type }) => {
    let result = activities;

    if (location)
      result = result.filter((a) =>
        (a.location || "").toLowerCase().includes(location.toLowerCase())
      );

    if (type)
      result = result.filter(
        (a) => (a.category || "").toLowerCase() === type.toLowerCase()
      );

    setFiltered(result);
  };

  const categories = [
    { key: "Visitas guiadas", title: "Visitas guiadas" },
    { key: "Rutas gastronómicas", title: "Rutas gastronómicas" },
    { key: "Excursiones culturales", title: "Excursiones culturales" },
    { key: "Cocina", title: "Clases de cocina" },
    { key: "Fotografía", title: "Clases de fotografía" },
    { key: "Surf", title: "Clases de surf" },
    { key: "Yoga", title: "Clases de yoga" },
    { key: "Baile", title: "Clases de baile" },
    { key: "Convivencias locales", title: "Experiencias locales" },
    { key: "Talleres artesanales", title: "Talleres artesanales" },
    { key: "Naturaleza", title: "Aventuras en la naturaleza" },
    { key: "Talleres virtuales", title: "Talleres virtuales online" },
    { key: "Recorridos virtuales", title: "Recorridos online" },
  ];

  return (
    <>
      <Navbar />
      <Container>
        <h1 style={{ marginTop: "40px", marginBottom: "20px", fontSize: "32px", fontWeight: "700" }}>
          Actividades
        </h1>


        <SearchBar onSearch={handleSearch} />

        {filtered.length === 0 && (
          <p style={{ marginTop: "20px", fontSize: "18px" }}>
            No hay actividades disponibles para tu búsqueda.
          </p>
        )}

        {categories.map((c) => {
          const items = filtered.filter(
            (a) => (a.category || "").toLowerCase() === c.key.toLowerCase()
          );
          if (!items.length) return null;

          return (
            <ResourceCarousel
              key={c.key}
              title={c.title}
              items={items}
              type="activities"
              filterKey={c.key}
            />
          );
        })}
      </Container>
    </>
  );
};

export default ActivitiesPage;
