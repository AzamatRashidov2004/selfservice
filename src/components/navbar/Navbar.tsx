import React  from 'react';
import { Link } from 'react-router-dom'; // Import Link component
import './Navbar.css';
import { 
  createPopupEvent, 
  createNotificationEvent 
} from '../../utility/Modal_Util';

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
            <button
              className="btn"
              onClick={() => createPopupEvent('Popup Title', 'Popup Text', {
                success: { text: 'Yes', type: 'primary' },
                cancel: { text: 'No', type: 'secondary' }
              })}
            >
              Show Popup
            </button>
            <button
              className="btn"
              onClick={() => createNotificationEvent('Success', 'Item successfully added', 'success', 2000)}
            >
              Show Notification
            </button>
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
