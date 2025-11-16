import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import BackButton from "../components/BackButton.jsx";
import "../style/AdminLayout.css";

export default function AdminLayout() {
  const { logout, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="admin-layout">
        <main className="admin-main">
          <p>Cargando…</p>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <BackButton />
        <header>
          <h2 className="admin-sidebar-title">Administrador</h2>
          <span className="admin-badge">
            {user?.email || ""}
          </span>
        </header>

        <nav className="admin-nav">
          <NavLink
            to="/admin/approvals"
            end
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
            Registros
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