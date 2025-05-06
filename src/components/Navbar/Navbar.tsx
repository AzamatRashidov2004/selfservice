import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import "./Navbar.css";
import { useAuth } from "../../context/authContext";
import { useNavigation } from "../../context/navigationContext";

const Navbar: React.FC = () => {
  const { logout, login, authenticated } = useAuth();
  const navigate = useNavigate(); // Add this hook
  const { currentBlocker } = useNavigation();
  
  const handleSubmit = async () => {
    try {
      await login();
    } catch (err) {
      console.error("Login error:", err);
    }
  };
  
  // Modified navigation handler
  const handleNavigate = (path: string) => {
    // Check if there's any navigation blocking conditions
    if (currentBlocker && currentBlocker.hasUnsavedChanges) {
      // Use the navigation context to trigger the confirmation flow
      useNavigation().setPendingNavigation(path);
    } else {
      // If no blockers, navigate directly
      navigate(path);
    }
  };
  
  return (
    <>
      <nav className="navbar-container navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <div className="container-fluid navbar-wrapper">
          {/* Logo Text - Keep as Link since it's always safe to go home */}
          <Link className="navbar-brand" to="/">
            Maestro Dashboard
          </Link>
          <p style={{
            marginLeft:"-3px",
            marginTop: "4px",
            fontSize:"12px"
          }}>
            {import.meta.env.VITE_APP_VERSION}
          </p>

          {/* Right-aligned buttons */}
          <div className="d-flex ms-auto">
            {authenticated ? (
              <>
                <button 
                  className="btn btn-link custom-link me-2" 
                  onClick={() => handleNavigate('/new-project')}
                >
                  New
                </button>
                <button 
                  className="btn btn-link custom-link me-2" 
                  onClick={() => handleNavigate('/dashboard')}
                >
                  Dashboard
                </button>
                <button 
                  className="btn btn-link custom-link me-2" 
                  onClick={() => handleNavigate('/contact')}
                >
                  Contact
                </button>
                <button
                  className="btn btn-primary"
                  onClick={async () => {
                    await logout();
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-link custom-link me-2"
                  onClick={handleSubmit}
                >
                  Login
                </button>
                <button 
                  className="btn btn-link custom-link me-2" 
                  onClick={() => handleNavigate('/contact')}
                >
                  Contact
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={() => handleNavigate('/try-now')}
                >
                  Try Now
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;