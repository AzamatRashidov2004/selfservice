import { useEffect } from 'react';
import { createPopupEvent } from '../../utility/Modal_Util';
import { useNavigate } from 'react-router-dom';

export const useNavigationPrompt = (hasUnsavedChanges, handleSave) => {
  const navigate = useNavigate();
  
  // Handle browser close/refresh (native browser dialog)
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        const message = "You have unsaved changes. Are you sure you want to leave?";
        e.returnValue = message;
        return message;
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);
  
  // Return a function that components can use before navigation
  return (targetPath) => {
    if (hasUnsavedChanges) {
      // Show custom popup
      createPopupEvent(
        "Unsaved Changes",
        "You have unsaved changes. Do you want to save them before leaving?",
        {
          success: { text: "Save Changes", type: "primary" },
          cancel: { text: "Discard Changes", type: "danger" }
        },
        (success) => {
          if (success) {
            // Save changes then navigate
            handleSave().then(() => {
              navigate(targetPath);
            });
          } else {
            // Discard changes and navigate
            navigate(targetPath);
          }
        }
      );
      return false; // Prevent immediate navigation
    }
    return true; // Allow navigation
  };
};