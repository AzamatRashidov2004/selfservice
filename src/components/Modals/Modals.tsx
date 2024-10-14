import React, { useState, useEffect, useCallback } from 'react';
import Popup from './sub-components/Popup';
import Notification from './sub-components/Notification';
import UploadFile from './sub-components/UploadFile';
import CreateFolder from './sub-components/CreateFolder';
import { 
  setupPopupEventListener, 
  handlePopupClose, 
  getDefaultPopupState,
  setupNotificationEventListener, 
  getDefaultNotificationState,
  setupCreateFolderListener,
  setupUploadFileModalListener
} from './Modals_Util';

import { 
  PopupState,
  NotificationState,
} from '../../utility/types';

const Modals: React.FC = () => {
  const [popup, setPopup] = useState<PopupState>(getDefaultPopupState());
  const [notification, setNotification] = useState<NotificationState>(getDefaultNotificationState());
  const [uploadFileModal, setUploadFileModal] = useState({callback: (files: File[]) => {console.log(files)}, isVisible: false});
  const [createFolderModal, setCreateFolderModal] = useState({isVisible: false, callback: (folderName: string) => {console.log(folderName)}});

  // Memoize the showPopup function
  const showPopup = useCallback((title: string, text: string, buttons: PopupState['buttons'], callback?: (success: boolean) => void) => {
    setPopup({ isVisible: true, title, text, buttons, callback });
  }, []);

  // Memoize the showNotification function
  const showNotification = useCallback((title: string, text: string, type: NotificationState['type'], notification_time?: number) => {
    setNotification({ isVisible: true, title, text, type, notification_time });
  }, []);

  // Memoize the showPopup function
  const showUploadFile = useCallback((callback: (files: File[]) => void) => {
    setUploadFileModal({callback: callback, isVisible: true});
  }, []);

   // Memoize the showPopup function
   const showCreateFolder = useCallback((callback: (folderName: string) => void) => {
    setCreateFolderModal({callback: callback, isVisible: true});
  }, []);

  const handleNotificationClose = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  // Setup popup, notification, and modal listeners
  useEffect(() => {
    const cleanupPopupListener = setupPopupEventListener(showPopup);
    const cleanupNotificationListener = setupNotificationEventListener(showNotification);
    const cleanupUploadFileListener = setupUploadFileModalListener(showUploadFile);
    const cleanupFolderListener = setupCreateFolderListener(showCreateFolder);

    return () => {
      cleanupPopupListener();
      cleanupNotificationListener();
      cleanupUploadFileListener();
      cleanupFolderListener();
    };
  }, [showPopup, showNotification, showUploadFile, showCreateFolder]);

  return (
    <>
      {/* Popup component */}
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
        notification_time={notification.notification_time}
      />

      {/* Upload File Modal */}
      <UploadFile
        show={uploadFileModal.isVisible}
        handleClose={() => setUploadFileModal({...uploadFileModal, isVisible: false})}
        handleUpload={(files) => {
          uploadFileModal.callback(files); // File callback
        }}
      />

      <CreateFolder
        show={createFolderModal.isVisible}
        handleClose={() => setCreateFolderModal({...createFolderModal, isVisible: false})}
        handleCreate={(folderName: string) => {
          createFolderModal.callback(folderName)
        }}
      />
    </>
  );
};

export default Modals;
