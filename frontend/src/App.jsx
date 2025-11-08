import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Public Pages
import Home from './pages/Home/Home.jsx'

// LogIn
import LogInPage from './pages/LogIn/LogIn.jsx';

// Resources
import AccommodationsPage from './pages/Resources/Property.jsx'
import ActivitiesPage from './pages/Resources/Activity.jsx'
import ServicesPage from './pages/Resources/Service.jsx'

// Admin
import { AuthProvider } from "./auth/AuthContext";
import AdminRoute from "./routes/AdminRoute";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Approvals from "./pages/admin/Approvals";
import Users from "./pages/admin/Users";
import Logs from "./pages/admin/Logs";

// Utils
import NotFound from './pages/Extras/NotFound.jsx'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/properties/create" element={<AccommodationsPage />} />
          <Route path="/activities/create" element={<ActivitiesPage />} />
          <Route path="/services/create" element={<ServicesPage />} />
          <Route path="/LogIn" element={<LogInPage />} />

          {/* Admin protegidas */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="approvals" element={<Approvals />} />
            <Route path="users" element={<Users />} />
            <Route path="logs" element={<Logs />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
