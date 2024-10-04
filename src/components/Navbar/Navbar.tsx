import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link component
import "./Navbar.css";
import { useAuth } from "../../context/authContext";

const Navbar: React.FC = () => {
  const { authenticated } = useAuth();
  const { logout, login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async () => {
    setError(null); // Reset error state
    try {
      // Attempt to login using Keycloak
      await login();
    } catch (err) {
      // Handle any errors that occur during login
      setError("Login failed.");
      console.error("Login error:", err);
    }
  };

  return (
    <>
      <nav className="navbar-container navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <div className="container-fluid navbar-wrapper">
          {/* Logo Text */}
          <Link className="navbar-brand" to="/">
            CVUT CIIRC
          </Link>

          {/* Right-aligned buttons */}
          <div className="d-flex ms-auto">
            {authenticated ? (
              <>
                <Link
                  className="btn btn-link custom-link me-2"
                  to="/new-project"
                >
                  New
                </Link>
                <Link className="btn btn-link custom-link me-2" to="/dashboard">
                  Dashboard
                </Link>
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
                <Link className="btn btn-primary" to="/try-now">
                  Try Now
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
