import React, { useState, useRef, useEffect } from "react"; 
import "../style/Navbar.css";
import HostModal from "./Modals/HostModal";
import LogInModal from "./Modals/LogInModal";
import Container from "./Container";
import { useAuth } from "../hooks/useAuth";
import { Link, useLocation } from "react-router-dom";

// ICONOS
import { FaRegStar, FaBox, FaReceipt } from "react-icons/fa";

const Navbar = () => {
  const [showHostModal, setShowHostModal] = useState(false);
  const [showLogInModal, setShowLogInModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const menuRef = useRef(null);
  const location = useLocation();

  const currentPath = location.pathname;

  const isActive = (route) => {
    return currentPath.startsWith(route) ? "active-nav" : "";
  };

  const handleHostClick = () => {
    if (isAuthenticated) {
      setShowHostModal(true);
    } else {
      setShowLogInModal(true);
    }
  };

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
            <Link to="/" className="logo">SecureBNB</Link>
          </div>

          <div className="nav-center">
            <Link className={isActive("/properties")} to="/properties">
              Alojamientos
            </Link>
            <Link className={isActive("/activities")} to="/activities">
              Actividades
            </Link>
            <Link className={isActive("/services")} to="/services">
              Servicios
            </Link>
          </div>

          <div className="nav-right">
            <button className="host-btn" onClick={handleHostClick}>
              Conviértete en anfitrión
            </button>

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

                    {/* OPCIONES CON ICONOS */}
                    <Link to="/saved" className="dropdown-item">
                      <FaRegStar className="icon" />
                      Mis guardados
                    </Link>

                    <Link to="/myResources" className="dropdown-item">
                      <FaBox className="icon" />
                      Mis recursos
                    </Link>

                    <Link to="/myBookings" className="dropdown-item">
                      <FaReceipt className="icon" />
                      Mis reservaciones
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
