import React, { useState } from "react";
import axios from "axios";
import BackButton from "../BackButton";
import "../../style/ServiceForm.css";

const ServiceForm = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "",
    price: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.price <= 0) return alert("El precio debe ser mayor que 0.");
    if (!form.name.trim() || !form.type.trim())
      return alert("Por favor completa los campos obligatorios.");

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:4000/api/services", form);
      alert("Servicio registrado correctamente");
      console.log(res.data);
      setForm({ name: "", description: "", type: "", price: "" });
    } catch (error) {
      console.error("Error:", error);
      alert("Error al registrar servicio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="basic-form" onSubmit={handleSubmit}>
      <BackButton to="/" />

      <h2>Registrar Servicio</h2>

      <div className="form-group">
        <label>Nombre *</label>
        <input
          name="name"
          placeholder="Ej: Transporte al aeropuerto"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Tipo *</label>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          required
          className="select-input"
        >
          <option value="">Seleccione un tipo de servicio</option>
          <optgroup label="Limpieza">
            <option value="Limpieza incluida">Incluida</option>
            <option value="Limpieza extra">Extra opcional</option>
          </optgroup>
          <optgroup label="Transporte">
            <option value="Transporte al aeropuerto">Transporte al aeropuerto</option>
            <option value="Alquiler de bicicletas">Alquiler de bicicletas</option>
            <option value="Alquiler de autos">Alquiler de autos</option>
          </optgroup>
          <optgroup label="Comidas y desayunos">
            <option value="Desayuno incluido">Desayuno incluido</option>
            <option value="Comidas locales">Comidas locales</option>
            <option value="Servicio de catering">Catering</option>
          </optgroup>
          <optgroup label="Servicios premium">
            <option value="Conserjería">Conserjería</option>
            <option value="Organización de eventos">Organización de eventos</option>
            <option value="Paquete completo">Paquete de estadía completa</option>
          </optgroup>
        </select>
      </div>

      <div className="form-group">
        <label>Precio *</label>
        <input
          type="number"
          name="price"
          placeholder="Ej: 35.00"
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
          placeholder="Describe el servicio ofrecido..."
          value={form.description}
          onChange={handleChange}
          rows="4"
        />
      </div>

      <button className="create-btn" type="submit" disabled={loading}>
        {loading ? "Guardando..." : "Crear servicio"}
      </button>
    </form>
  );
};

export default ServiceForm;
