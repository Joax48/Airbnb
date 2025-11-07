import React, { useState } from "react";
import axios from "axios";
import BackButton from "../BackButton";
import "../../style/ActivityForm.css";

const ActivityForm = () => {
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    date: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.price <= 0) return alert("El precio debe ser mayor que 0.");
    if (!form.name.trim() || !form.category.trim() || !form.date)
      return alert("Por favor completa los campos obligatorios.");

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:4000/api/activities", form);
      alert("Actividad registrada correctamente");
      console.log(res.data);
      setForm({ name: "", category: "", description: "", price: "", date: "" });
    } catch (error) {
      console.error("Error:", error);
      alert("Error al registrar actividad");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="basic-form" onSubmit={handleSubmit}>
      <BackButton to="/" />

      <h2>Registrar Actividad</h2>

      <div className="form-group">
        <label>Nombre *</label>
        <input
          name="name"
          placeholder="Ej: Tour en kayak"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Categoría *</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          className="select-input"
        >
          <option value="">Seleccione una categoría</option>
          <optgroup label="Tours locales">
            <option value="Visitas guiadas">Visitas guiadas</option>
            <option value="Rutas gastronómicas">Rutas gastronómicas</option>
            <option value="Excursiones culturales">Excursiones culturales</option>
          </optgroup>
          <optgroup label="Clases">
            <option value="Cocina">Cocina</option>
            <option value="Fotografía">Fotografía</option>
            <option value="Surf">Surf</option>
            <option value="Yoga">Yoga</option>
            <option value="Baile">Baile</option>
          </optgroup>
          <optgroup label="Experiencias inmersivas">
            <option value="Convivencias locales">Convivencias con comunidades locales</option>
            <option value="Talleres artesanales">Talleres artesanales</option>
            <option value="Naturaleza">Actividades en la naturaleza</option>
          </optgroup>
          <optgroup label="Experiencias online">
            <option value="Talleres virtuales">Talleres virtuales</option>
            <option value="Recorridos virtuales">Recorridos virtuales guiados</option>
          </optgroup>
        </select>
      </div>

      <div className="form-group">
        <label>Precio *</label>
        <input
          type="number"
          name="price"
          placeholder="Ej: 45.00"
          value={form.price}
          onChange={handleChange}
          min="1"
          required
        />
      </div>

      <div className="form-group">
        <label>Fecha y hora *</label>
        <input
          type="datetime-local"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Descripción</label>
        <textarea
          name="description"
          placeholder="Describe la actividad..."
          value={form.description}
          onChange={handleChange}
          rows="4"
        />
      </div>

      <button className="create-btn" type="submit" disabled={loading}>
        {loading ? "Guardando..." : "Crear actividad"}
      </button>
    </form>
  );
};

export default ActivityForm;
