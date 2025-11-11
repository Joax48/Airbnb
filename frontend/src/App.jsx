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
import AdminLayout from "./layouts/AdminLayout.jsx";
import DashboardPage from "./pages/admin/Dashboard.jsx";
import ApprovalsPage from "./pages/admin/Approvals.jsx";
import UsersPage from "./pages/admin/Users.jsx";
import LogsPage from "./pages/admin/Logs.jsx";

// Utils
import NotFound from './pages/Extras/NotFound.jsx'
import ProtectedRoute from './utils/ProtectedRoute.jsx';
import { AdminRoute } from './utils/AdminRoute.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/Login"element={<LogInPage/>}/>        

        {/* Solo usuarios logueados */}
        <Route path="/properties/create"element={<ProtectedRoute><AccommodationsPage /></ProtectedRoute>}/>
        <Route path="/activities/create"element={<ProtectedRoute><ActivitiesPage/></ProtectedRoute>}/>
        <Route path="/services/create"element={<ProtectedRoute><ServicesPage/></ProtectedRoute>}/>


        <Route path="/unauthorized" element={<h2>No tienes permisos para acceder aquí</h2>} />

        {/* Admin protegidas */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="approvals" element={<ApprovalsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="logs" element={<LogsPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  )
}

export default App
