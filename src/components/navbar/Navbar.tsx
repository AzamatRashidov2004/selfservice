import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link component
import './Navbar.css';
import Popup from '../popup/Popup';

// Define types for the buttons in the popup
interface ButtonConfig {
  text: string;
  type: 'info' | 'danger' | 'success' | 'primary' | 'secondary';
}

interface PopupState {
  isVisible: boolean;
  title: string;
  text: string;
  buttons: {
    success: ButtonConfig;
    cancel: ButtonConfig;
    // Add other button configurations if needed
  };
}

const Navbar: React.FC = () => {
  const [popup, setPopup] = useState<PopupState>({
    isVisible: false,
    title: '',
    text: '',
    buttons: {
      success: {text: "Yes", type: "primary"},
      cancel: {text: "No", type: "secondary"}
    }
  });

  const showPopup = (title: string, text: string, buttons: PopupState['buttons']) => {
    setPopup({ isVisible: true, title, text, buttons });
  };

  const hidePopup = () => {
    setPopup(prev => ({ ...prev, isVisible: false }));
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
            <button className='btn' onClick={() => showPopup('Popup Title', 'Popup Text', { success: { text: 'Okay', type: 'primary' }, cancel: { text: 'Cancel', type: 'secondary' } })}>
              Show Popup
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
