import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BackButton from "../BackButton";
import Navbar from "../Navbar";
import "../../style/ActivityForm.css";

axios.defaults.withCredentials = true;

const NAME_MAX = 100;
const LOCATION_MAX = 100;
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

const ALLOWED_CATEGORIES = [
  "Visitas guiadas",
  "Rutas gastronómicas",
  "Excursiones culturales",
  "Cocina",
  "Fotografía",
  "Surf",
  "Yoga",
  "Baile",
  "Convivencias locales",
  "Talleres artesanales",
  "Actividades en la naturaleza",
  "Talleres virtuales",
  "Recorridos virtuales guiados",
];

const ActivityForm = () => {
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    date: "",
    location: "",
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
      setMessage("Solo JPG, PNG o WEBP.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setIsSuccess(false);
      setMessage("La imagen no puede superar los 5MB.");
      return;
    }

    setImageFile(file);
  };

  const uploadToCloudinary = async () => {
    if (!imageFile) return "";

    const sigRes = await axios.get(
      "http://localhost:4000/api/uploads/signature?folder=activities",
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
    const category = sanitizeBasicField(form.category);
    const location = sanitizeBasicField(form.location);
    const description = sanitizeDescriptionField(form.description);
    const priceNumber = Number(form.price);

    if (name.length < 3 || name.length > NAME_MAX) {
      setIsSuccess(false);
      setMessage(`El nombre debe tener entre 3 y ${NAME_MAX} caracteres.`);
      return;
    }

    if (location.length < 3 || location.length > LOCATION_MAX) {
      setIsSuccess(false);
      setMessage(
        `La ubicación debe tener entre 3 y ${LOCATION_MAX} caracteres.`
      );
      return;
    }

    if (description.length > DESC_MAX) {
      setIsSuccess(false);
      setMessage(`La descripción no puede exceder ${DESC_MAX} caracteres.`);
      return;
    }

    if (!category) {
      setIsSuccess(false);
      setMessage("La categoría es obligatoria.");
      return;
    }

    if (!ALLOWED_CATEGORIES.includes(category)) {
      setIsSuccess(false);
      setMessage("Categoría de actividad inválida.");
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

    if (!form.date) {
      setIsSuccess(false);
      setMessage("La fecha de la actividad es obligatoria.");
      return;
    }

    const parsed = new Date(form.date);
    if (Number.isNaN(parsed.getTime())) {
      setIsSuccess(false);
      setMessage("La fecha de la actividad es inválida.");
      return;
    }

    if (!name || !category || !location) {
      setIsSuccess(false);
      setMessage("Completa los campos obligatorios.");
      return;
    }

    setLoading(true);

    try {
      const imageUrl = await uploadToCloudinary();

      const dataToSend = {
        ...form,
        name,
        category,
        location,
        description,
        price: priceNumber,
        imageUrl,
      };

      await axios.post("http://localhost:4000/api/activities", dataToSend);

      setIsSuccess(true);
      setMessage("Actividad creada correctamente");

      setTimeout(() => {
        navigate("/");
      }, 1800);

      setForm({
        name: "",
        category: "",
        description: "",
        price: "",
        date: "",
        location: "",
        imageUrl: "",
      });
      setImageFile(null);
    } catch (error) {
      console.error(error);
      setIsSuccess(false);
      setMessage("Error al crear actividad");
    } finally {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, MIN_SUBMIT_TIME_MS - elapsed);
      setTimeout(() => setLoading(false), remaining);
    }
  };

  return (
    <div className="Activity-page">
      <Navbar />
      <form className="basic-form" onSubmit={handleSubmit}>
        <BackButton to="/" />
        <h2>Registrar Actividad</h2>

        {message && (
          <p className={isSuccess ? "success-message" : "err-message"}>
            {message}
          </p>
        )}

        <div className="form-group">
          <label>Nombre *</label>
          <input
            name="name"
            placeholder="Ej: Tour en kayak"
            value={form.name}
            onChange={handleChange}
            required
            maxLength={NAME_MAX}
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
              <option value="Excursiones culturales">
                Excursiones culturales
              </option>
            </optgroup>

            <optgroup label="Clases">
              <option value="Cocina">Cocina</option>
              <option value="Fotografía">Fotografía</option>
              <option value="Surf">Surf</option>
              <option value="Yoga">Yoga</option>
              <option value="Baile">Baile</option>
            </optgroup>

            <optgroup label="Experiencias inmersivas">
              <option value="Convivencias locales">Convivencias locales</option>
              <option value="Talleres artesanales">Talleres artesanales</option>
              <option value="Actividades en la naturaleza">
                Actividades en la naturaleza
              </option>
            </optgroup>

            <optgroup label="Experiencias online">
              <option value="Talleres virtuales">Talleres virtuales</option>
              <option value="Recorridos virtuales guiados">
                Recorridos virtuales guiados
              </option>
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
            max={PRICE_MAX}
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
          <label>Ubicación *</label>
          <input
            name="location"
            placeholder="Ej: San José, Costa Rica"
            value={form.location}
            onChange={handleChange}
            required
            maxLength={LOCATION_MAX}
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
            maxLength={DESC_MAX}
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
