import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
axios.defaults.withCredentials = true;
import BackButton from "../BackButton";
import Navbar from "../Navbar";
import "../../style/AccommodationForm.css";

const AccommodationForm = () => {
  const [form, setForm] = useState({
    name: "",
    type: "",
    description: "",
    price: "",
    location: "",
    imageUrl: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [amenities, setAmenities] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
      "http://localhost:4000/api/uploads/signature?folder=properties",
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

    if (form.price <= 0) {
      setIsSuccess(false);
      setMessage("El precio debe ser mayor que 0.");
      return;
    }

    if (!form.name.trim() || !form.type.trim() || !form.location.trim()) {
      setIsSuccess(false);
      setMessage("Por favor completa todos los campos obligatorios.");
      return;
    }

    setLoading(true);

    try {
      const imageUrl = await uploadToCloudinary();

      const dataToSend = {
        ...form,
        imageUrl,
        amenities: selectedAmenities,
      };

      const res = await axios.post(
        "http://localhost:4000/api/properties",
        dataToSend
      );

      setIsSuccess(true);
      setMessage("Alojamiento creado correctamente");

      setTimeout(() => {
        navigate("/");
      }, 2000);

      // Reset form
      setForm({
        name: "",
        type: "",
        description: "",
        price: "",
        location: "",
        imageUrl: "",
      });
      setImageFile(null);
      setSelectedAmenities([]);

    } catch (error) {
      console.log(error);
      setIsSuccess(false);
      setMessage("Error al crear alojamiento");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/amenities")
      .then((res) => setAmenities(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="acommodation-page">
      <Navbar />

      <form className="basic-form" onSubmit={handleSubmit}>
        <BackButton to="/" />
        <h2>Registrar Alojamiento</h2>

        {message && (
          <p className={isSuccess ? "success-message" : "err-message"}>
            {message}
          </p>
        )}

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

        {/* AMENITIES */}
        <div className="form-group">
          <label>Amenidades</label>

          <div
            className="dropdown-container"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            <span>
              {selectedAmenities.length === 0
                ? "Selecciona amenidades"
                : `${selectedAmenities.length} seleccionadas`}
            </span>
            <span className="arrow">{dropdownOpen ? "▲" : "▼"}</span>
          </div>

          {dropdownOpen && (
            <div className="dropdown-list">
              {amenities.map((a) => (
                <label key={a.id_amenity} className="dropdown-item">
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(a.id_amenity)}
                    onChange={(e) => {
                      e.stopPropagation();
                      if (selectedAmenities.includes(a.id_amenity)) {
                        setSelectedAmenities(
                          selectedAmenities.filter((id) => id !== a.id_amenity)
                        );
                      } else {
                        setSelectedAmenities([
                          ...selectedAmenities,
                          a.id_amenity,
                        ]);
                      }
                    }}
                  />
                  {a.name}
                </label>
              ))}
            </div>
          )}
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
            placeholder="Ej: 75.000"
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

        <div className="form-group">
          <label>Imagen principal</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />

          {imageFile && (
            <p style={{ fontSize: "0.9rem", color: "#555" }}>
              Archivo: {imageFile.name}
            </p>
          )}
        </div>

        <button className="create-btn" type="submit" disabled={loading}>
          {loading ? "Subiendo..." : "Crear alojamiento"}
        </button>
      </form>
    </div>
  );
};

export default AccommodationForm;
