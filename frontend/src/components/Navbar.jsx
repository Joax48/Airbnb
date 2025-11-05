import React from "react";
import "../style/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src="/logo.png" alt="SecureBnB" className="logo" />
        <ul>
          <li><a href="#alojamientos">Alojamientos</a></li>
          <li><a href="#actividades">Actividades</a></li>
          <li><a href="#servicios">Servicios</a></li>
        </ul>
      </div>
      <div className="navbar-right">
        <a href="#host" className="host-link">Conviértete en anfitrión</a>
        <button className="login-btn">Inicia sesión</button>
      </div>
    </nav>
  );
};

export default Navbar;
