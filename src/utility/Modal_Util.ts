export interface ButtonConfig {
    text: string;
    type: 'info' | 'danger' | 'success' | 'primary' | 'secondary';
  }
  
export interface PopupState {
    isVisible: boolean;
    title: string;
    text: string;
    buttons: {
      success: ButtonConfig;
      cancel: ButtonConfig;
    };
    callback?: (success: boolean) => void; // Optional callback function
    notification_time?: number; // Optional time for popup display
  }

export const defaultPopupState: PopupState = {
    isVisible: false,
    title: '',
    text: '',
    buttons: {
      success: { text: 'Yes', type: 'primary' },
      cancel: { text: 'No', type: 'secondary' }
    },
    notification_time: 5000 // Default time for popup display
  };

export interface NotificationState {
    title: string;
    text: string;
    type: 'info' | 'danger' | 'success' | 'primary' | 'secondary';
    notification_time?: number; // Optional time for notification display
    isVisible: boolean;
  }
  
export const defaultNotificationState: NotificationState = {
    isVisible: false,
    title: '',
    text: '',
    type: 'success',
    notification_time: 2000 // Default time for notification display
  };

export const createPopupEvent = (title: string, text: string, buttons: PopupState['buttons'], callback?: (success: boolean) => void, notification_time?: number) => {
    const showPopupEvent = new CustomEvent('showPopup', {
      detail: { title, text, buttons, callback, notification_time }
    });
    window.dispatchEvent(showPopupEvent);
  };

export const createNotificationEvent = (title: string, text: string, type: NotificationState['type'], notification_time?: number) => {
    const showNotificationEvent = new CustomEvent('showNotification', {
      detail: { title, text, type, notification_time }
    });
    window.dispatchEvent(showNotificationEvent);
  };