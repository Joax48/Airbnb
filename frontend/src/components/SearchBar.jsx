import React, { useState } from "react";
import "../style/SearchBar.css";

const SearchBar = ({ onSearch }) => {
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
        <option value="">Tipo de alojamiento</option>
        <option value="Casa">Casa</option>
        <option value="Apartamento">Apartamento</option>
        <option value="Cabaña">Cabaña</option>
        <option value="Habitación">Habitación</option>
      </select>
      <input
        type="number"
        name="guests"
        min="1"
        placeholder="Huéspedes"
        value={filters.guests}
        onChange={handleChange}
      />
      <button type="submit">Buscar</button>
    </form>
  );
};

export default SearchBar;
