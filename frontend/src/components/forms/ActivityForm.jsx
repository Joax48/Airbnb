import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BackButton from "../BackButton";
import Navbar from "../Navbar";
import "../../style/ActivityForm.css";

const ActivityForm = () => {
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    date: "",
    imageUrl: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        alert("Solo JPG, PNG o WEBP.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Máximo 5MB.");
        return;
      }
      setImageFile(file);
    }
  };

  const uploadToCloudinary = async () => {
    if (!imageFile) return "";

    const sigRes = await axios.get(
      "http://localhost:4000/api/uploads/signature?folder=activities"
    );

    const { timestamp, signature, apiKey, cloudName, folder } = sigRes.data;

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("folder", folder);

    const cloudinaryRes = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      formData,
      { withCredentials: false }
    );

    return cloudinaryRes.data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.category.trim() || !form.date)
      return alert("Completa los campos obligatorios.");

    setLoading(true);

    try {
      const imageUrl = await uploadToCloudinary();

      const dataToSend = { ...form, imageUrl };

      const res = await axios.post(
        "http://localhost:4000/api/activities",
        dataToSend
      );

      alert("Actividad creada correctamente");
      navigate("/");

      setForm({
        name: "",
        category: "",
        description: "",
        price: "",
        date: "",
        imageUrl: "",
      });
      setImageFile(null);
    } catch (error) {
      console.error(error);
      alert("Error al crear actividad");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Activity-page">
      <Navbar />
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

      <div className="form-group">
        <label>Imagen de la actividad</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {imageFile && <p>Archivo: {imageFile.name}</p>}
      </div>

      <button className="create-btn" type="submit" disabled={loading}>
        {loading ? "Guardando..." : "Crear actividad"}
      </button>
    </form>
    </div>
  );
};

export default ActivityForm;
