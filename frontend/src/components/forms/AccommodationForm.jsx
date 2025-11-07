import React, { useState } from "react";
import axios from "axios";
import BackButton from "../BackButton";
import "../../style/AccommodationForm.css";

const AccommodationForm = () => {
  const [form, setForm] = useState({
    name: "",
    type: "",
    description: "",
    price: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.price <= 0) return alert("El precio debe ser mayor que 0.");
    if (!form.name.trim() || !form.type.trim() || !form.location.trim())
      return alert("Por favor completa todos los campos obligatorios.");

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:4000/api/properties", form);
      alert("Alojamiento creado correctamente");
      console.log(res.data);
      setForm({ name: "", type: "", description: "", price: "", location: "" });
    } catch (error) {
      console.error("Error:", error);
      alert("Error al crear alojamiento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="basic-form" onSubmit={handleSubmit}>
      <BackButton to="/" />

      <h2>Registrar Alojamiento</h2>

      <div className="form-group">
        <label>Nombre *</label>
        <input
          name="name"
          placeholder="Ej: Cabaña del Bosque"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Tipo de alojamiento *</label>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          required
          className="select-input"
        >
          <option value="">Seleccione un tipo</option>
          <optgroup label="Estancias completas">
            <option value="Casa">Casa</option>
            <option value="Apartamento">Apartamento</option>
            <option value="Villa">Villa</option>
            <option value="Cabaña">Cabaña</option>
          </optgroup>

          <optgroup label="Habitaciones">
            <option value="Habitación privada">Habitación privada</option>
            <option value="Habitación compartida">Habitación compartida</option>
          </optgroup>

          <optgroup label="Alojamientos únicos">
            <option value="Casa en el árbol">Casa en el árbol</option>
            <option value="Barco">Barco</option>
            <option value="Casa flotante">Casa flotante</option>
            <option value="Domo">Domo</option>
          </optgroup>
        </select>
      </div>

      <div className="form-group">
        <label>Ubicación *</label>
        <input
          name="location"
          placeholder="Ej: Cahuita, Limón"
          value={form.location}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Precio por noche *</label>
        <input
          type="number"
          name="price"
          placeholder="Ej: 75.00"
          value={form.price}
          onChange={handleChange}
          min="1"
          required
        />
      </div>

      <div className="form-group">
        <label>Descripción</label>
        <textarea
          name="description"
          placeholder="Describe brevemente el alojamiento..."
          value={form.description}
          onChange={handleChange}
          rows="4"
        />
      </div>

      <button className="create-btn" type="submit" disabled={loading}>
        {loading ? "Guardando..." : "Crear alojamiento"}
      </button>
    </form>
  );
};

export default AccommodationForm;
