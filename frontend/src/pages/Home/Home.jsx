import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import SearchBar from "../../components/SearchBar";
import SectionCarousel from "../../components/SectionCarousel";
import Container from "../../components/Container";
import "../../style/HomePage.css";

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const fetchProperties = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/properties");
      setProperties(res.data);
      setFiltered(res.data);
    } catch (error) {
      console.error("Error al cargar alojamientos:", error);
    }
  };

  const handleSearch = (filters) => {
    let result = properties;
    if (filters.location) {
      result = result.filter((p) =>
        p.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    if (filters.type) {
      result = result.filter(
        (p) => p.type.toLowerCase() === filters.type.toLowerCase()
      );
    }
    setFiltered(result);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const casas = filtered.filter((p) => p.type.toLowerCase() === "casa");
  const apartamentos = filtered.filter((p) => p.type.toLowerCase() === "apartamento");
  const cabañas = filtered.filter((p) => p.type.toLowerCase() === "cabaña");

  return (
      <>
    <Navbar />
    <Container>
      <SearchBar onSearch={handleSearch} />
      <SectionCarousel title="Casas destacadas" items={casas} />
      <SectionCarousel title="Apartamentos recomendados" items={apartamentos} />
      <SectionCarousel title="Cabañas populares" items={cabañas} />
    </Container>
  </>

  );
};

export default Home;
