import React, { useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import "../style/AdminLayout.css";

export default function AdminLayout() {
  const { logout, role } = useContext(AuthContext);

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <header>
          <h2 className="admin-sidebar-title">Panel de control</h2>
        </header>

        <nav className="admin-nav">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `admin-nav__link ${isActive ? "admin-nav__link--active" : ""}`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/approvals"
            className={({ isActive }) =>
              `admin-nav__link ${isActive ? "admin-nav__link--active" : ""}`
            }
          >
            Aprobaciones
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `admin-nav__link ${isActive ? "admin-nav__link--active" : ""}`
            }
          >
            Usuarios
          </NavLink>

          <NavLink
            to="/admin/logs"
            className={({ isActive }) =>
              `admin-nav__link ${isActive ? "admin-nav__link--active" : ""}`
            }
          >
            Logs
          </NavLink>
        </nav>

        <button
        type="button"
        className="admin-btn"
        onClick={logout}
        >
          Cerrar sesión
        </button>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}