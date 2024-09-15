import React  from 'react';
import { Link } from 'react-router-dom'; // Import Link component
import './Navbar.css';

const Navbar: React.FC = () => {

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
            <Link className="btn btn-link custom-link me-2" to="/new-project">
              New
            </Link>
            <Link className="btn btn-link custom-link me-2" to="/dashboard">
              Dashboard
            </Link>
            <Link className="btn btn-primary" to="/try-now">
              Try Now
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
