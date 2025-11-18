import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Container from "../../components/Container";
import SearchBar from "../../components/SearchBar";
import ResourceCarousel from "../../components/ResourceCarousel";

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/services")
      .then((res) => {
        setServices(res.data);
        setFiltered(res.data);
      })
      .catch(console.error);
  }, []);

  const handleSearch = ({ location, type }) => {
    let result = services;

    if (location)
      result = result.filter((s) =>
        (s.location || "").toLowerCase().includes(location.toLowerCase())
      );

    if (type)
      result = result.filter(
        (s) => (s.type || "").toLowerCase() === type.toLowerCase()
      );

    setFiltered(result);
  };

  const categories = [
    { key: "Limpieza incluida", title: "Limpieza incluida" },
    { key: "Limpieza extra", title: "Limpieza extra opcional" },
    { key: "Transporte al aeropuerto", title: "Transporte al aeropuerto" },
    { key: "Alquiler de bicicletas", title: "Bicicletas disponibles" },
    { key: "Alquiler de autos", title: "Alquiler de autos" },
    { key: "Desayuno incluido", title: "Desayunos incluidos" },
    { key: "Comidas locales", title: "Comidas locales" },
    { key: "Servicio de catering", title: "Servicio de catering" },
    { key: "Conserjería", title: "Servicios premium" },
    { key: "Organización de eventos", title: "Organización de eventos" },
    { key: "Paquete completo", title: "Paquete completo" },
  ];

  return (
    <>
      <Navbar />
      <Container>
        <h1 style={{ marginTop: "40px", marginBottom: "20px", fontSize: "32px", fontWeight: "700" }}>
          Servicios
        </h1>

        <SearchBar onSearch={handleSearch} />

        {filtered.length === 0 && (
          <p style={{ marginTop: "20px", fontSize: "18px" }}>
            No hay servicios disponibles para tu búsqueda.
          </p>
        )}

        {categories.map((c) => {
          const items = filtered.filter(
            (s) => (s.type || "").toLowerCase() === c.key.toLowerCase()
          );
          if (!items.length) return null;

          return (
            <ResourceCarousel
              key={c.key}
              title={c.title}
              items={items}
              type="services"
              filterKey={c.key}
            />
          );
        })}
      </Container>
    </>
  );
};

export default ServicesPage;
