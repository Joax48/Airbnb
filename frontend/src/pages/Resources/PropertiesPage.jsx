import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Container from "../../components/Container";
import SearchBar from "../../components/SearchBar";
import ResourceCarousel from "../../components/ResourceCarousel";
import "../../style/AccommodationsPage.css";

const AccommodationsPage = () => {
  const [properties, setProperties] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/properties")
      .then((res) => {
        setProperties(res.data);
        setFiltered(res.data);
      })
      .catch(console.error);
  }, []);

  const handleSearch = ({ location, type }) => {
    let result = properties;

    if (location)
      result = result.filter((p) =>
        (p.location || "").toLowerCase().includes(location.toLowerCase())
      );

    if (type)
      result = result.filter(
        (p) => (p.type || "").toLowerCase() === type.toLowerCase()
      );

    setFiltered(result);
  };

  const tipos = [
    { key: "Casa", title: "Casas destacadas" },
    { key: "Apartamento", title: "Apartamentos recomendados" },
    { key: "Cabaña", title: "Cabañas populares" },
    { key: "Villa", title: "Villas de lujo" },
    { key: "Casa en el árbol", title: "Alojamientos únicos" },
  ];

  return (
    <>
      <Navbar />
      <Container>
        <h1 style={{ marginTop: "40px", marginBottom: "20px", fontSize: "32px", fontWeight: "700" }}>
          Alojamientos
        </h1>

        <SearchBar onSearch={handleSearch} />

        {tipos.map((t) => {
          const items = filtered.filter(
            (p) => (p.type || "").toLowerCase() === t.key.toLowerCase()
          );
          if (!items.length) return null;

          return (
            <ResourceCarousel
              key={t.key}
              title={t.title}
              items={items}
              type="properties"
              filterKey={t.key}
            />
          );
        })}
      </Container>
    </>
  );
};

export default AccommodationsPage;
