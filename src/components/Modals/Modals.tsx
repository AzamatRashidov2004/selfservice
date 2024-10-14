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
  setupFolderModalListener,
  setupUploadFileModalListener
} from './Modals_Util';

import { 
  PopupState,
  NotificationState,
} from '../../utility/types';

const Modals: React.FC = () => {
  const [popup, setPopup] = useState<PopupState>(getDefaultPopupState());
  const [notification, setNotification] = useState<NotificationState>(getDefaultNotificationState());
  const [uploadFileModal, setUploadFileModal] = useState(false); // Upload file modal visibility
  const [createFolderModal, setCreateFolderModal] = useState(false); // Create folder modal visibility
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // Selected files for upload
  const [folderName, setFolderName] = useState(''); // Folder name for creation

  // Memoize the showPopup function
  const showPopup = useCallback((title: string, text: string, buttons: PopupState['buttons'], callback?: (success: boolean) => void) => {
    setPopup({ isVisible: true, title, text, buttons, callback });
  }, []);

  // Memoize the showNotification function
  const showNotification = useCallback((title: string, text: string, type: NotificationState['type'], notification_time?: number) => {
    setNotification({ isVisible: true, title, text, type, notification_time });
  }, []);

  const handleNotificationClose = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  // Function to show the Upload File modal
  const showUploadFileModal = useCallback(() => {
    setUploadFileModal(true);
  }, []);

  // Function to show the Create Folder modal
  const showCreateFolderModal = useCallback(() => {
    setCreateFolderModal(true);
  }, []);

  // Function to handle file upload and pass state through callback
  const handleUploadFiles = useCallback((callback?: (uploadedFiles: File[]) => void) => {
    if (callback) {
      callback(selectedFiles); // Pass selected files through callback
    }
  }, [selectedFiles]);

  // Function to handle folder creation and pass state through callback
  const handleCreateFolder = useCallback((callback?: (createdFolderName: string) => void) => {
    if (callback) {
      callback(folderName); // Pass folder name through callback
    }
  }, [folderName]);

  // Setup popup, notification, and modal listeners
  useEffect(() => {
    const cleanupPopupListener = setupPopupEventListener(showPopup);
    const cleanupNotificationListener = setupNotificationEventListener(showNotification);
    const cleanupUploadFileListener = setupUploadFileModalListener(showUploadFileModal);
    const cleanupFolderListener = setupFolderModalListener(showCreateFolderModal);

    return () => {
      cleanupPopupListener();
      cleanupNotificationListener();
      cleanupUploadFileListener();
      cleanupFolderListener();
    };
  }, [showPopup, showNotification, showUploadFileModal, showCreateFolderModal]);

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
        show={uploadFileModal}
        handleClose={() => setUploadFileModal(false)}
        handleUpload={(files) => {
          setSelectedFiles(files); // Update state with selected files
          handleUploadFiles((uploadedFiles) => {
            console.log('Files uploaded:', uploadedFiles); // Callback with uploaded files
          });
        }}
      />

      {/* Create Folder Modal */}
      <CreateFolder
        show={createFolderModal}
        handleClose={() => setCreateFolderModal(false)}
        handleCreate={(name) => {
          setFolderName(name); // Update state with folder name
          handleCreateFolder((createdFolderName) => {
            console.log('Folder created:', createdFolderName); // Callback with folder name
          });
        }}
      />
    </>
  );
};

export default Modals;
