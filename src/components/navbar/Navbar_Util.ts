// popupUtils.ts

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
  }
  
  const defaultPopupState: PopupState = {
    isVisible: false,
    title: '',
    text: '',
    buttons: {
      success: { text: 'Yes', type: 'primary' },
      cancel: { text: 'No', type: 'secondary' }
    }
  };
  
  export const getDefaultPopupState = (): PopupState => {
    return { ...defaultPopupState };
  };
  
  export const createPopupEvent = (title: string, text: string, buttons: PopupState['buttons'], callback?: (success: boolean) => void) => {
    const showPopupEvent = new CustomEvent('showPopup', {
      detail: { title, text, buttons, callback }
    });
    window.dispatchEvent(showPopupEvent);
  };
  
  export const handlePopupCustomEvent = (event: CustomEvent, showPopup: (title: string, text: string, buttons: PopupState['buttons'], callback?: (success: boolean) => void) => void) => {
    if (event.detail) {
      const { title, text, buttons, callback } = event.detail;
      showPopup(title, text, buttons, callback);
    }
  };
  
  export const setupPopupEventListener = (showPopup: (title: string, text: string, buttons: PopupState['buttons'], callback?: (success: boolean) => void) => void) => {
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
  