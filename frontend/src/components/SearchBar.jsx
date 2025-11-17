import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "../style/SearchBar.css";

const SearchBar = ({ onSearch }) => {
  const { pathname } = useLocation();
  const isActivities = pathname.includes("activities");
  const isServices = pathname.includes("services");
  const isProperties = pathname.includes("properties");

  const [filters, setFilters] = useState({
    location: "",
    type: "",
    guests: 1,
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        name="location"
        placeholder="¿A dónde vas?"
        value={filters.location}
        onChange={handleChange}
      />

      <select name="type" value={filters.type} onChange={handleChange}>
        <option value="">Seleccione una categoría</option>

        {isProperties && (
          <>
            <option value="Casa">Casa</option>
            <option value="Apartamento">Apartamento</option>
            <option value="Cabaña">Cabaña</option>
            <option value="Habitación">Habitación</option>
            <option value="Villa">Villa</option>
            <option value="Casa en el árbol">Casa en el árbol</option>
          </>
        )}

        {isActivities && (
          <>
            <option value="Visitas guiadas">Visitas guiadas</option>
            <option value="Rutas gastronómicas">Rutas gastronómicas</option>
            <option value="Excursiones culturales">Excursiones culturales</option>
            <option value="Cocina">Clases de cocina</option>
            <option value="Fotografía">Clases de fotografía</option>
            <option value="Surf">Clases de surf</option>
            <option value="Yoga">Clases de yoga</option>
            <option value="Baile">Clases de baile</option>
            <option value="Convivencias locales">Experiencias locales</option>
            <option value="Talleres artesanales">Talleres artesanales</option>
            <option value="Naturaleza">Aventuras en la naturaleza</option>
            <option value="Talleres virtuales">Talleres virtuales online</option>
            <option value="Recorridos virtuales">Recorridos online</option>
          </>
        )}

        {isServices && (
          <>
            <option value="Limpieza incluida">Limpieza incluida</option>
            <option value="Limpieza extra">Limpieza extra</option>
            <option value="Transporte al aeropuerto">Transporte al aeropuerto</option>
            <option value="Alquiler de bicicletas">Alquiler de bicicletas</option>
            <option value="Alquiler de autos">Alquiler de autos</option>
            <option value="Desayuno incluido">Desayuno incluido</option>
            <option value="Comidas locales">Comidas locales</option>
            <option value="Servicio de catering">Servicio de catering</option>
            <option value="Conserjería">Conserjería</option>
            <option value="Organización de eventos">Organización de eventos</option>
            <option value="Paquete completo">Paquete completo</option>
          </>
        )}
      </select>

      <button type="submit">Buscar</button>
    </form>
  );
};

export default SearchBar;
