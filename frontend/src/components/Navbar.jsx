import React, { useState } from "react";
import "../style/Navbar.css";
import HostModal from "./Modals/HostModal";
import Container from "./Container";

const Navbar = () => {
  const [showHostModal, setShowHostModal] = useState(false);

  return (
    <>
    <Container>
      <nav className="navbar">
        <div className="nav-left">
          <h1 className="logo">SecureBNB</h1>
        </div>

        <div className="nav-center">
          <a href="/properties">Alojamientos</a>
          <a href="/activities">Actividades</a>
          <a href="/services">Servicios</a>
        </div>

        <div className="nav-right">
          <button
            className="host-btn"
            onClick={() => setShowHostModal(true)}
          >
            Conviértete en anfitrión
          </button>
          <button className="login-btn">Iniciar sesión</button>
        </div>
      </nav>

      {showHostModal && <HostModal onClose={() => setShowHostModal(false)} />}
        </Container>
    </>
  );
};

export default Navbar;
