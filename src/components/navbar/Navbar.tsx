import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom'; // Import Link component
import './Navbar.css';
import Popup from '../Modals/Popup';
import Notification from '../Modals/Notification';
import { 
  setupPopupEventListener, 
  handlePopupClose, 
  getDefaultPopupState,
  setupNotificationEventListener, 
  getDefaultNotificationState
} from './Navbar_Util'; // Import popup utility functions and types

import { 
  PopupState, 
  createNotificationEvent, 
  NotificationState, 
  createPopupEvent 
} from '../../utility/Modal_Util';

const Navbar: React.FC = () => {
  // Initialise popup and notification states
  const [popup, setPopup] = useState<PopupState>(getDefaultPopupState());
  const [notification, setNotification] = useState<NotificationState>(getDefaultNotificationState());

  // Use useCallback to memoize the showPopup function
  const showPopup = useCallback((title: string, text: string, buttons: PopupState['buttons'], callback?: (success: boolean) => void) => {
    setPopup({ isVisible: true, title, text, buttons, callback });
  }, []);

  // Use useCallback to memoize the showNotification function
  const showNotification = useCallback((title: string, text: string, type: NotificationState['type'], notification_time?: number) => {
    setNotification({ isVisible: true, title, text, type, notification_time });
  }, []);

  // Setup popup and notification listeners
  useEffect(() => {
    const cleanupPopupListener = setupPopupEventListener(showPopup);
    const cleanupNotificationListener = setupNotificationEventListener(showNotification);

    // Clean up event listeners on component unmount
    return () => {
      cleanupPopupListener();
      cleanupNotificationListener();
    };
  }, [showPopup, showNotification]);

  // Handle notification close
  const handleNotificationClose = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  return (
    <>
      <nav className="navbar-container navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <div className="container-fluid">
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

      {/* Popup component to inform users about actions */}
      <Popup 
        title={popup.title}
        text={popup.text}
        buttons={popup.buttons}
        onClose={handlePopupClose(setPopup, popup.callback)}
        isVisible={popup.isVisible}
      />

      {/* Notification component */}
      <Notification
        title={notification.title}
        text={notification.text}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={handleNotificationClose}
        notification_time={notification.notification_time} // Pass notification_time from state
      />
    </>
  );
};

export default Navbar;
