// Import React Routing
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Handle scrollbar changes
import { updateScrollbarGutter } from "./utility/Scrollbar_Util";

// Import Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Import Font Awesome
import "@fortawesome/fontawesome-free/css/all.min.css";

// Import Pages
import New_Project from "./pages/New-Project/New_Project";
import Navbar from "./components/Navbar/Navbar";
import Dashboard from "./pages/Dashboard/Dashboard";
import Landing_Page from "./pages/Landing-Page/Landing_Page";
import Try_Now from "./pages/Try-Now/Try_Now";
import Modals from "./components/Modals/Modals";
import Footer from "./components/Footer/Footer"; // Import the footer

// Import AuthProvider
import { AuthProvider } from "./context/authContext"; // Adjust the path as necessary

// Import css
import "./App.css";
import "./responsive.css";

const App: React.FC = () => {
  // Window size listener for Scrollbar width styling
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      updateScrollbarGutter();
    });
    resizeObserver.observe(document.body);

    // Initial size check
    updateScrollbarGutter();

    // Cleanup observer on unmount
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Modals />
        <Routes>
          <Route path="/" element={<Landing_Page />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/new-project" element={<New_Project />} />
          <Route path="/try-now" element={<Try_Now />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App;
