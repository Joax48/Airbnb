import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Punblic Pages
import Home from './pages/Home/Home.jsx'

// Resources
import AccommodationsPage from './pages/Resources/Property.jsx'
import ActivitiesPage from './pages/Resources/Activity.jsx'
import ServicesPage from './pages/Resources/Service.jsx'

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

          <Route path="/unauthorized" element={<h2>No tienes permisos para acceder aquí</h2>} />
          <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
