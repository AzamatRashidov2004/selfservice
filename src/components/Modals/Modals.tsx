
import React, { useState, useEffect, useCallback } from 'react';
import Popup from './sub-components/Popup';
import Notification from './sub-components/Notification';
import { 
  setupPopupEventListener, 
  handlePopupClose, 
  getDefaultPopupState,
  setupNotificationEventListener, 
  getDefaultNotificationState
} from './Modals_Util';

import { 
  PopupState,
  NotificationState,
} from '../../utility/types';

const Modals: React.FC = () => {
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

export default Modals;