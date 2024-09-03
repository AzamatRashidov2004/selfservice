import { Link } from 'react-router-dom'; // Import Link component
import { useState } from 'react';
import './Navbar.css';
import Popup from '../popup/Popup';

function Navbar() {
  const [popup, setPopup] = useState({
    isVisible: false,
    title: '',
    text: '',
    buttons: []
  });

  const showPopup = (title, text, buttons) => {
    setPopup({ isVisible: true, title, text, buttons });
  };

  const hidePopup = () => {
    setPopup({ ...popup, isVisible: false });
  };

  return (
    <>
      <nav className="navbar-container navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <div className="container-fluid">
          {/* Logo Text */}
          <a className="navbar-brand" href="/">
            CVUT CIIRC
          </a>

          {/* Right-aligned buttons */}
          <div className="d-flex ms-auto">
            <button className='btn'>Show Popup</button>
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
      
      {/* Popup component to inform users about actions */}
      <Popup 
        title={popup.title}
        text={popup.text}
        buttons={popup.buttons}
        onClose={hidePopup}
        isVisible={popup.isVisible}
      />
    </>
  );
}

export default Navbar;
