import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BackButton from "../BackButton";
import Navbar from "../Navbar";
import "../../style/ServiceForm.css";

axios.defaults.withCredentials = true;

const ServiceForm = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "",
    price: "",
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
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!validTypes.includes(file.type)) {
      alert("Solo se permiten JPG, PNG o WEBP.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen no puede superar 5 MB.");
      return;
    }

    setImageFile(file);
  };

  const uploadToCloudinary = async () => {
    if (!imageFile) return "";

    const sigRes = await axios.get(
      "http://localhost:4000/api/uploads/signature?folder=services",
      { withCredentials: true }
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

    if (form.price <= 0) return alert("El precio debe ser mayor que 0.");
    if (!form.name.trim() || !form.type.trim())
      return alert("Por favor completa los campos obligatorios.");

    setLoading(true);
    try {
      const imageUrl = await uploadToCloudinary();

      const body = { ...form, imageUrl };

      const res = await axios.post(
        "http://localhost:4000/api/services",
        body
      );

      alert("Servicio registrado correctamente");
      navigate("/");
      console.log(res.data);

      setForm({
        name: "",
        description: "",
        type: "",
        price: "",
        imageUrl: "",
      });
      setImageFile(null);
    } catch (error) {
      console.error("Error:", error);
      alert("Error al registrar servicio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Serive-page">
      <Navbar />
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

      <div className="form-group">
        <label>Imagen del servicio</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />

        {imageFile && (
          <p style={{ fontSize: "0.9rem", color: "#555" }}>
            Archivo: {imageFile.name}
          </p>
        )}
      </div>

      <button className="create-btn" type="submit" disabled={loading}>
        {loading ? "Subiendo..." : "Crear servicio"}
      </button>
    </form>
    </div>
  );
};

export default ServiceForm;
