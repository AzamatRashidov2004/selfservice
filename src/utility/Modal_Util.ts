import { PopupState, NotificationState } from "./types";

export const createPopupEvent = (title: string, text: string, buttons: PopupState['buttons'], callback?: (success: boolean) => void) => {
    const showPopupEvent = new CustomEvent('showPopup', {
      detail: { title, text, buttons, callback }
    });
    window.dispatchEvent(showPopupEvent);
  };

export const createNotificationEvent = (title: string, text: string, type: NotificationState['type'], notification_time?: number) => {
    const showNotificationEvent = new CustomEvent('showNotification', {
      detail: { title, text, type, notification_time }
    });
    window.dispatchEvent(showNotificationEvent);
  };

export const createUploadFileModalEvent = (callback: (uploadedFiles: File[]) => void) => {
  const showUploadFileModalEvent = new CustomEvent('showUploadFileModal', { 
    detail: { callback } 
  });
  window.dispatchEvent(showUploadFileModalEvent);
};

export const createFolderModalEvent = (callback: (folderName: string) => void) => {
  const showCreateFolderModalEvent = new CustomEvent('showCreateFolderModal', { 
    detail: { callback } 
  });
  window.dispatchEvent(showCreateFolderModalEvent);
};
  