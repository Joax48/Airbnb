import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, useLocation  } from 'react-router-dom';

// Punblic Pages
import Home from './pages/Home/Home.jsx'

// Resources
import AccommodationsPage from './pages/Resources/Property.jsx'
import ActivitiesPage from './pages/Resources/Activity.jsx'
import ServicesPage from './pages/Resources/Service.jsx'

// Utils
import NotFound from './pages/Extras/NotFound.jsx'
function App() {


  return (
    <Router>
      <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/properties/create" element={<AccommodationsPage />} />
          <Route path="/activities/create" element={<ActivitiesPage />} />
          <Route path="/services/create" element={<ServicesPage />} />
          
          <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
