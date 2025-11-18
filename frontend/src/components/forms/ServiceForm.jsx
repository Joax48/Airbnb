import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BackButton from "../BackButton";
import Navbar from "../Navbar";
import "../../style/ServiceForm.css";

axios.defaults.withCredentials = true;

const NAME_MAX = 100;
const DESC_MAX = 1000;
const PRICE_MAX = 500000;
const MIN_SUBMIT_TIME_MS = 800;

const stripControlChars = (str) => {
  if (typeof str !== "string") return "";
  return str
    .normalize("NFC")
    .replace(/[\x00-\x1F\x7F]/g, "") 
    .replace(/[\u200B-\u200F\u202A-\u202E\u2060\uFEFF]/g, "");
};

const sanitizeBasicField = (str) => {
  if (typeof str !== "string") return "";
  let out = stripControlChars(str);
  out = out.trim().replace(/\s+/g, " ");
  out = out.replace(/[<>`]/g, "");
  return out;
};

const sanitizeDescriptionField = (str) => {
  if (typeof str !== "string") return "";
  let out = stripControlChars(str);
  out = out.trim().replace(/\s+/g, " ");
  return out;
};

const ALLOWED_TYPES = [
  "Limpieza incluida",
  "Limpieza extra",
  "Transporte al aeropuerto",
  "Alquiler de bicicletas",
  "Alquiler de autos",
  "Desayuno incluido",
  "Comidas locales",
  "Servicio de catering",
  "Conserjería",
  "Organización de eventos",
  "Paquete completo",
];

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

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!validTypes.includes(file.type)) {
      setIsSuccess(false);
      setMessage("Solo se permiten imágenes JPG, PNG o WEBP.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setIsSuccess(false);
      setMessage("La imagen no puede superar los 5 MB.");
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
    setMessage("");

    const start = Date.now();

    const name = sanitizeBasicField(form.name);
    const type = sanitizeBasicField(form.type);
    const description = sanitizeDescriptionField(form.description);
    const priceNumber = Number(form.price);

    if (name.length < 3 || name.length > NAME_MAX) {
      setIsSuccess(false);
      setMessage(`El nombre debe tener entre 3 y ${NAME_MAX} caracteres.`);
      return;
    }

    if (description.length > DESC_MAX) {
      setIsSuccess(false);
      setMessage(`La descripción no puede exceder ${DESC_MAX} caracteres.`);
      return;
    }

    if (!type) {
      setIsSuccess(false);
      setMessage("El tipo de servicio es obligatorio.");
      return;
    }

    if (!ALLOWED_TYPES.includes(type)) {
      setIsSuccess(false);
      setMessage("Tipo de servicio inválido.");
      return;
    }

    if (!Number.isFinite(priceNumber)) {
      setIsSuccess(false);
      setMessage("El precio debe ser un número válido.");
      return;
    }

    if (priceNumber <= 0 || priceNumber > PRICE_MAX) {
      setIsSuccess(false);
      setMessage(`El precio debe estar entre 1 y ${PRICE_MAX}.`);
      return;
    }

    setLoading(true);

    try {
      const imageUrl = await uploadToCloudinary();

      const body = {
        ...form,
        name,
        type,
        description,
        price: priceNumber,
        imageUrl,
      };

      await axios.post("http://localhost:4000/api/services", body);

      setIsSuccess(true);
      setMessage("Servicio registrado correctamente");

      setTimeout(() => {
        navigate("/");
      }, 1800);

      setForm({
        name: "",
        description: "",
        type: "",
        price: "",
        imageUrl: "",
      });
      setImageFile(null);
    } catch (error) {
      console.error(error);
      setIsSuccess(false);
      setMessage("Error al registrar servicio");
    } finally {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, MIN_SUBMIT_TIME_MS - elapsed);
      setTimeout(() => setLoading(false), remaining);
    }
  };

  return (
    <div className="Service-page">
      <Navbar />

      <form className="basic-form" onSubmit={handleSubmit}>
        <BackButton to="/" />
        <h2>Registrar Servicio</h2>

        {message && (
          <p className={isSuccess ? "success-message" : "err-message"}>
            {message}
          </p>
        )}

        <div className="form-group">
          <label>Nombre *</label>
          <input
            name="name"
            placeholder="Ej: Transporte al aeropuerto"
            value={form.name}
            onChange={handleChange}
            required
            maxLength={NAME_MAX}
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
              <option value="Transporte al aeropuerto">
                Transporte al aeropuerto
              </option>
              <option value="Alquiler de bicicletas">
                Alquiler de bicicletas
              </option>
              <option value="Alquiler de autos">Alquiler de autos</option>
            </optgroup>

            <optgroup label="Comidas y desayunos">
              <option value="Desayuno incluido">Desayuno incluido</option>
              <option value="Comidas locales">Comidas locales</option>
              <option value="Servicio de catering">Catering</option>
            </optgroup>

            <optgroup label="Servicios premium">
              <option value="Conserjería">Conserjería</option>
              <option value="Organización de eventos">
                Organización de eventos
              </option>
              <option value="Paquete completo">
                Paquete de estadía completa
              </option>
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
            max={PRICE_MAX}
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
            maxLength={DESC_MAX}
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
