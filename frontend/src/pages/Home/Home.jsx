import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import SectionCarousel from "../../components/SectionCarousel";
import Container from "../../components/Container";
import "../../style/HomePage.css";

const API = import.meta.env.VITE_IP_SERVER;

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [activities, setActivities] = useState([]);
  const [services, setServices] = useState([]);

  const [filteredProperties, setFilteredProperties] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);


  const fetchProperties = async () => {
    try {
      const res = await axios.get(`${API}/api/properties`);
      setProperties(res.data);
      setFilteredProperties(res.data);
    } catch (error) {
      console.error("Error al cargar propiedades:", error);
    }
  };

  const fetchActivities = async () => {
    try {
      const res = await axios.get(`${API}/api/activities`);
      setActivities(res.data);
      setFilteredActivities(res.data);
    } catch (error) {
      console.error("Error al cargar actividades:", error);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await axios.get(`${API}/api/services`);
      setServices(res.data);
      setFilteredServices(res.data);
    } catch (error) {
      console.error("Error al cargar servicios:", error);
    }
  };

  useEffect(() => {
    fetchProperties();
    fetchActivities();
    fetchServices();
  }, []);


  // --- PROPIEDADES ---
  const casas = filteredProperties.filter((p) => p.type.toLowerCase() === "casa");
  const apartamentos = filteredProperties.filter(
    (p) => p.type.toLowerCase() === "apartamento"
  );

  // --- ACTIVIDADES ---
  const actividadesPopulares = filteredActivities.slice(0, 10);
  const actividadesDestacadas = filteredActivities.slice(10, 20);

  // --- SERVICIOS ---
  const serviciosRecomendados = filteredServices.slice(0, 10);
  const serviciosPopulares = filteredServices.slice(10, 20);

  return (
    <>
      <Navbar />
      <Container>


        {/* --- PROPIEDADES --- */}
        <SectionCarousel
          title="Casas destacadas"
          items={casas}
          type="properties"
        />
        <SectionCarousel
          title="Apartamentos recomendados"
          items={apartamentos}
          type="properties"
        />

        {/* --- ACTIVIDADES --- */}
        <SectionCarousel
          title="Actividades populares"
          items={actividadesPopulares}
          type="activities"
        />
        <SectionCarousel
          title="Experiencias destacadas"
          items={actividadesDestacadas}
          type="activities"
        />

        {/* --- SERVICIOS --- */}
        <SectionCarousel
          title="Servicios recomendados"
          items={serviciosRecomendados}
          type="services"
        />
        <SectionCarousel
          title="Servicios populares"
          items={serviciosPopulares}
          type="services"
        />

      </Container>
    </>
  );
};

export default Home;
