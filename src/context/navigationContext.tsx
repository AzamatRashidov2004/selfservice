// Create a new file: src/context/navigationContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NavigationContextType {
  setPendingNavigation: (path: string | null) => void;
  registerBlocker: (blocker: {
    hasUnsavedChanges: boolean;
    handleSave: () => Promise<boolean>;
  }) => void;
  unregisterBlocker: () => void;
  currentBlocker: {
    hasUnsavedChanges: boolean;
    handleSave: () => Promise<boolean>;
  } | null;
  pendingNavigation: string | null;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [currentBlocker, setCurrentBlocker] = useState<{
    hasUnsavedChanges: boolean;
    handleSave: () => Promise<boolean>;
  } | null>(null);

  const registerBlocker = (blocker: {
    hasUnsavedChanges: boolean;
    handleSave: () => Promise<boolean>;
  }) => {
    setCurrentBlocker(blocker);
  };

  const unregisterBlocker = () => {
    setCurrentBlocker(null);
  };

  return (
    <NavigationContext.Provider value={{
      pendingNavigation,
      setPendingNavigation,
      registerBlocker,
      unregisterBlocker,
      currentBlocker
    }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};