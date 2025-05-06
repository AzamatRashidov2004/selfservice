// src/hooks/useNavigationPrompt.ts
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPopupEvent } from '../utility/Modal_Util';

export const useNavigationPrompt = (hasUnsavedChanges: boolean, saveHandler: () => Promise<boolean>) => {
  const navigate = useNavigate();
  
  return useCallback((destination: string) => {
    if (hasUnsavedChanges) {
      createPopupEvent(
        "Unsaved Changes",
        "You have unsaved customization changes. Do you want to save them before leaving?",
        {
          success: { text: "Save Changes", type: "primary" },
          cancel: { text: "Discard Changes", type: "danger" }
        },
        (success: boolean) => {
          if (success) {
            // Save changes before navigating
            saveHandler().then((saved) => {
              if (saved) {
                navigate(destination);
              }
            });
          } else {
            // Discard changes and navigate
            navigate(destination);
          }
        }
      );
      return false; // Prevent immediate navigation
    }
    return true; // Allow navigation
  }, [hasUnsavedChanges, navigate, saveHandler]);
};