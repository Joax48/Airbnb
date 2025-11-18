import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/BackButton.css";

const BackButton = ({ to = "/" }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to) navigate(to);
    else navigate(-1);
  };

  return (
    <button className="back-btn" onClick={handleBack} title="Volver">
      Volver
    </button>
  );
};

export default BackButton;
