import { 
    PopupState, 
    defaultNotificationState, 
    defaultPopupState, 
    NotificationState 
  } from "../../utility/Modal_Util";
  
  export const getDefaultPopupState = (): PopupState => {
    return { ...defaultPopupState };
  };
  
  export const handlePopupCustomEvent = (event: CustomEvent, showPopup: (title: string, text: string, buttons: PopupState['buttons'], callback?: (success: boolean) => void, notification_time?: number) => void) => {
    if (event.detail) {
      const { title, text, buttons, callback, notification_time } = event.detail;
      showPopup(title, text, buttons, callback, notification_time);
    }
  };
  
  export const setupPopupEventListener = (showPopup: (title: string, text: string, buttons: PopupState['buttons'], callback?: (success: boolean) => void, notification_time?: number) => void) => {
    const handleCustomEvent = (event: CustomEvent) => handlePopupCustomEvent(event, showPopup);
  
    window.addEventListener('showPopup', handleCustomEvent as EventListener);
  
    // Return cleanup function
    return () => {
      window.removeEventListener('showPopup', handleCustomEvent as EventListener);
    };
  };
  
  export const handlePopupClose = (setPopup: React.Dispatch<React.SetStateAction<PopupState>>, callback?: (success: boolean) => void) => (success: boolean) => {
    setPopup(prev => ({ ...prev, isVisible: false }));
    if (callback) {
      callback(success);
    }
  };
  
  export const getDefaultNotificationState = (): NotificationState => {
    return { ...defaultNotificationState };
  };
  
  export const handleNotificationCustomEvent = (event: CustomEvent, showNotification: (title: string, text: string, type: NotificationState['type'], notification_time?: number) => void) => {
    if (event.detail) {
      const { title, text, type, notification_time } = event.detail;
      showNotification(title, text, type, notification_time);
    }
  };
  
  export const setupNotificationEventListener = (showNotification: (title: string, text: string, type: NotificationState['type'], notification_time?: number) => void) => {
    const handleCustomEvent = (event: CustomEvent) => handleNotificationCustomEvent(event, showNotification);
  
    window.addEventListener('showNotification', handleCustomEvent as EventListener);
  
    // Return cleanup function
    return () => {
      window.removeEventListener('showNotification', handleCustomEvent as EventListener);
    };
  };