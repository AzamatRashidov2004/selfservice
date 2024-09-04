// Import React Routing 
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import * as bootstrap from 'bootstrap';

// Import Font Awesome
import '@fortawesome/fontawesome-free/css/all.min.css';

// Import Pages
import New_Project from './pages/New-Project/New_Project';
import Navbar from './components/Navbar/Navbar';
import Dashboard from './pages/Dashboard/Dashboard';
import Landing_Page from './pages/Landing-Page/Landing_Page';
import Try_Now from './pages/Try-Now/Try_Now';
import Modals from './components/Modals/Modals';

// Import css
import './App.css';

const App: React.FC = () => {

  useEffect(() => {
    // Initialize tooltips for the app
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(tooltipTriggerEl => {
      new bootstrap.Tooltip(tooltipTriggerEl, {
        delay: { show: 300, hide: 0 }  // 300ms delay before showing, 100ms delay before hiding
      });
    });
  }, []);

  return (
    <>
      <Router>
        <Navbar />
        <Modals />
        <Routes>
          <Route path="/" element={<Landing_Page />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/new-project" element={<New_Project />} />
          <Route path="/try-now" element={<Try_Now />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
