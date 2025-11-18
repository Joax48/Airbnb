import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Public Pages
import Home from './pages/Home/Home.jsx'

// Resources
import AccommodationsForn from './pages/Resources/Property.jsx'
import ActivitiesForm from './pages/Resources/Activity.jsx'
import ServicesForm from './pages/Resources/Service.jsx'
import AccommodationsPage from './pages/Resources/PropertiesPage.jsx'
import ActivitiesPage from './pages/Resources/ActivitiesPage.jsx'
import ServicesPage from './pages/Resources/ServicesPage.jsx' 
import ResourceListPage from './pages/Resources/ResourceListPage.jsx'

// Admin
import AdminLayout from "./layouts/AdminLayout.jsx";
import ApprovalsPage from "./pages/admin/Approvals.jsx";
import UsersPage from "./pages/admin/Users.jsx";
import LogsPage from "./pages/admin/Logs.jsx";

import PropertyDetail from "./pages/Resources/PropertyDetail";
import ServiceDetail from "./pages/Resources/ServiceDetail";
import ActivityDetail from "./pages/Resources/ActivityDetail";

// User Pages
import SavedPage from './pages/User/saved.jsx'
import MyResourcesPage from "./pages/User/MyResources.jsx";
import MyBookings from './pages/User/MyBookings.jsx'

// Checkout Pages
import Checkout from './pages/Checkout/Checkout.jsx';

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
          <Route path="/properties" element={<AccommodationsPage />} /> 
          <Route path="/activities" element={<ActivitiesPage />} />
          <Route path="/services" element={<ServicesPage />} />
                    <Route path="/properties/:id" element={<PropertyDetail/>} />
          <Route path="/services/:id" element={<ServiceDetail />}/>
          <Route path="/activities/:id" element={<ActivityDetail />}/>
          <Route path="/explore/:resourceType" element={<ResourceListPage />} />

          {/* Solo usuarios logueados */}
          <Route path="/properties/create"element={<ProtectedRoute><AccommodationsForn /></ProtectedRoute>}/>
          <Route path="/activities/create"element={<ProtectedRoute><ActivitiesForm/></ProtectedRoute>}/>
          <Route path="/services/create"element={<ProtectedRoute><ServicesForm/></ProtectedRoute>}/>

          <Route path="/saved" element={<ProtectedRoute><SavedPage/></ProtectedRoute>} />
          <Route path="/myResources" element={<ProtectedRoute><MyResourcesPage/></ProtectedRoute>} />
          <Route path="/myBookings" element={<ProtectedRoute><MyBookings/></ProtectedRoute>} />


          <Route path="/checkout/:type/:id" element={<ProtectedRoute><Checkout/></ProtectedRoute>}/>


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
          <Route index element={<Navigate to="approvals" replace />} />
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
