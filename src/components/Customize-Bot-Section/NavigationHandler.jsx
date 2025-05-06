import { useEffect } from 'react';
import { createPopupEvent } from '../../utility/Modal_Util';

export const useNavigationPrompt = (hasUnsavedChanges, handleSave) => {
  // Only handle window beforeunload event (browser refresh/close)
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
};