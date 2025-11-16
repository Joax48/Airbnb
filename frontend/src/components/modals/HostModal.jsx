import React, { useState } from "react";
import "../../style/HostModal.css";
import { useNavigate } from "react-router-dom";
import homeImg from "../../assets/images/host-home.jpg";
import activityImg from "../../assets/images/host-activity.jpg";
import serviceImg from "../../assets/images/host-service.jpg";

const HostModal = ({ onClose }) => {
  const [selection, setSelection] = useState(null);
  const navigate = useNavigate();

  const handleSelect = (option) => {
    setSelection(option);
  };

  const handleNext = () => {
    if (!selection) return alert("Selecciona una opción primero");
    if (selection === "alojamiento") navigate("/properties/create");
    if (selection === "actividad") navigate("/activities/create");
    if (selection === "servicio") navigate("/services/create");
    onClose();
  };

  return (
    <div className="host-modal-overlay" onClick={onClose}>
      <div className="host-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>

        <h2>¿Qué te gustaría compartir?</h2>

        <div className="host-options-cards">
        <div
          className={`host-card ${selection === "alojamiento" ? "selected" : ""}`}
          onClick={() => handleSelect("alojamiento")}
        >
          <img src={homeImg} alt="Alojamiento" />
          <p>Alojamiento</p>
        </div>

        <div
          className={`host-card ${selection === "actividad" ? "selected" : ""}`}
          onClick={() => handleSelect("actividad")}
        >
          <img src={activityImg} alt="Actividad" />
          <p>Actividad</p>
        </div>

        <div
          className={`host-card ${selection === "servicio" ? "selected" : ""}`}
          onClick={() => handleSelect("servicio")}
        >
          <img src={serviceImg} alt="Servicio" />
          <p>Servicio</p>
        </div>
      </div>


        <div className="next-btn-container">
          <button className="next-btn" onClick={handleNext}>
            Siguiente
          </button>
        </div>

      </div>
    </div>
  );
};

export default HostModal;
