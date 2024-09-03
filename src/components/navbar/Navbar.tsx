import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom'; // Import Link component
import './Navbar.css';
import Popup from '../popup/Popup';
import { 
  createPopupEvent, 
  setupPopupEventListener, 
  handlePopupClose, 
  getDefaultPopupState, 
  PopupState 
} from './Navbar_Util.ts'; // Import utility functions and types

const Navbar: React.FC = () => {
  // Initialise popup states
  const [popup, setPopup] = useState<PopupState>(getDefaultPopupState());

  // Use useCallback to memoize the showPopup function
  const showPopup = useCallback((title: string, text: string, buttons: PopupState['buttons'], callback?: (success: boolean) => void) => {
    setPopup({ isVisible: true, title, text, buttons, callback });
  }, []);


  //Setup popup listeners
  useEffect(() => {
    const cleanupListener = setupPopupEventListener(showPopup);

    // Clean up event listener on component unmount
    return () => {
      cleanupListener();
    };
  }, [showPopup]);

  return (
    <>
      <nav className="navbar-container navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <div className="container-fluid">
          {/* Logo Text */}
          <Link className="navbar-brand" to="/">
            Try Now
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
        onClose={handlePopupClose(setPopup, popup.callback)}
        isVisible={popup.isVisible}
      />
    </>
  );
};

export default Navbar;
