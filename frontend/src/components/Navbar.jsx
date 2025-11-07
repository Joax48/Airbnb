import React, { useState } from "react";
import "../style/Navbar.css";
import HostModal from "./Modals/HostModal";
import LogInModal from "./Modals/LogInModal"
import Container from "./Container";

const Navbar = () => {
  const [showHostModal, setShowHostModal] = useState(false);
  const [showLogInModal, setShowLogInModal] = useState(false);

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
          <button
            className="login-btn"
            onClick={() => setShowLogInModal(true)}
          >
            Iniciar sesión
          </button>
        </div>
      </nav>

      {showLogInModal && <LogInModal onClose={() => setShowLogInModal(false)} />}
      {showHostModal && <HostModal onClose={() => setShowHostModal(false)} />}
        </Container>
    </>
  );
};

export default Navbar;
