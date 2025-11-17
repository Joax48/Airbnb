import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Public Pages
import Home from './pages/Home/Home.jsx'

// Resources
import AccommodationsPage from './pages/Resources/Property.jsx'
import ActivitiesPage from './pages/Resources/Activity.jsx'
import ServicesPage from './pages/Resources/Service.jsx'

import PropertyDetail from "./pages/Resources/PropertyDetail";
import ServiceDetail from "./pages/Resources/ServiceDetail";
import ActivityDetail from "./pages/Resources/ActivityDetail";

// User Pages
import SavedPage from './pages/User/Saved.jsx'
import MyResourcesPage from "./pages/User/MyResources.jsx";

// Checkout Pages
import Checkout from './pages/Checkout/checkout.jsx';

// Utils
import NotFound from './pages/Extras/NotFound.jsx'
import ProtectedRoute from './utils/ProtectedRoute.jsx';

function App() {


  return (
    <Router>
      <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Solo usuarios logueados */}
          <Route path="/properties/create"element={<ProtectedRoute><AccommodationsPage /></ProtectedRoute>}/>
          <Route path="/activities/create"element={<ProtectedRoute><ActivitiesPage/></ProtectedRoute>}/>
          <Route path="/services/create"element={<ProtectedRoute><ServicesPage/></ProtectedRoute>}/>
          <Route path="/saved" element={<ProtectedRoute><SavedPage/></ProtectedRoute>} />
          <Route path="/myResources" element={<ProtectedRoute><MyResourcesPage/></ProtectedRoute>} />
            <Route path="/properties/:id" element={<PropertyDetail/>} />
            <Route path="/services/:id" element={<ServiceDetail />}/>
            <Route path="/activities/:id" element={<ActivityDetail />}/>

          <Route path="/checkout/:type/:id" element={<Checkout/>}/>

          <Route path="/unauthorized" element={<h2>No tienes permisos para acceder aquí</h2>} />
          <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
