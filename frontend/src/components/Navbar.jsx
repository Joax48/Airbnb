import React, { useState, useRef, useEffect } from "react";
import "../style/Navbar.css";
import HostModal from "./Modals/HostModal";
import LogInModal from "./Modals/LogInModal";
import Container from "./Container";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [showHostModal, setShowHostModal] = useState(false);
  const [showLogInModal, setShowLogInModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const menuRef = useRef(null);

  const handleHostClick = () => {
    if (isAuthenticated) {
      setShowHostModal(true);
    } else {
      setShowLogInModal(true);
    }
  };

  // Cerrar el menu al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <Container>
        <nav className="navbar">
          <div className="nav-left">
            <a href="/" className="logo">SecureBNB</a>
          </div>

          <div className="nav-center">
            <a href="/properties">Alojamientos</a>
            <a href="/activities">Actividades</a>
            <a href="/services">Servicios</a>
          </div>

          <div className="nav-right">
            {/* Boton Conviertete en anfitrion */}
            <button className="host-btn" onClick={handleHostClick}>
              Conviértete en anfitrión
            </button>

            {/* Login / Usuario */}
            {isAuthenticated ? (
              <div className="user-menu" ref={menuRef}>
                <button
                  className="user-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <span className="user-avatar">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                  <span className="user-name">
                    {user?.name || user?.email?.split("@")[0] || "Usuario"}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="user-dropdown">
                    <p className="dropdown-item disabled">
                      {user?.email || ""}
                    </p>
                    {user?.role === "admin" && (
                      <Link to="/admin" className="dropdown-item admin">
                        Ir a panel de administración
                      </Link>
                    )}
                    <Link to="/saved" className="dropdown-item">
                      Mis guardados
                    </Link>
                    <hr />


                    <button
                      className="dropdown-item logout"
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="login-btn"
                onClick={() => setShowLogInModal(true)}
              >
                Iniciar sesión
              </button>
            )}
          </div>
        </nav>

        {/* Modales */}
        {showLogInModal && (
          <LogInModal onClose={() => setShowLogInModal(false)} />
        )}
        {showHostModal && (
          <HostModal onClose={() => setShowHostModal(false)} />
        )}
      </Container>
    </>
  );
};

export default Navbar;
