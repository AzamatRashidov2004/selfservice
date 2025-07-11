import React from "react";
import { Link } from "react-router-dom"; // Import Link component
import "./Navbar.css";
import { useAuth } from "../../context/authContext";
import {version} from "../../utility/config.ts";

const Navbar: React.FC = () => {
  const { logout, login, authenticated } = useAuth();
  const handleSubmit = async () => {
    try {
      await login();
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <>
      <nav className="navbar-container navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <div className="container-fluid navbar-wrapper">
          {/* Logo Text */}
          <Link className="navbar-brand" to="/">
            Maestro Dashboard
          </Link>
          <p style={{
            marginLeft:"-3px",
            marginTop: "4px",
            fontSize:"12px"
          }}>
            {version}
          </p>

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
                <Link className="btn btn-link custom-link me-2" to="/contact">
                  Contact
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
                <Link className="btn btn-link custom-link me-2" to="/contact">
                  Contact
                </Link>
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
