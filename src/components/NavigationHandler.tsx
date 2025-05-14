// src/components/NavigationHandler.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigation } from '../context/navigationContext';
import { createPopupEvent } from '../utility/Modal_Util';

const NavigationHandler: React.FC = () => {
  const navigate = useNavigate();
  const { pendingNavigation, setPendingNavigation, currentBlocker } = useNavigation();

  useEffect(() => {
    if (pendingNavigation && currentBlocker && currentBlocker.hasUnsavedChanges) {
      createPopupEvent(
        "Unsaved Changes",
        "You have unsaved changes. Do you want to save them before leaving?",
        {
          success: { text: "Save Changes", type: "primary" },
          cancel: { text: "Discard Changes", type: "danger" }
        },
        async (success) => {
          if (success) {
            // Save changes then navigate
            const saveResult = await currentBlocker.handleSave();
            if (saveResult) {
              navigate(pendingNavigation);
            }
            // Clear pending navigation in either case
            setPendingNavigation(null);
          } else {
            // Discard changes and navigate
            navigate(pendingNavigation);
            setPendingNavigation(null);
          }
        }
      );
    } else if (pendingNavigation) {
      // No unsaved changes, navigate directly
      navigate(pendingNavigation);
      setPendingNavigation(null);
    }
  }, [pendingNavigation, currentBlocker, navigate, setPendingNavigation]);

  return null;
};

export default NavigationHandler;