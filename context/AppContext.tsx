import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRecoveryRequest } from '@/hooks/useRecoveryRequest';

type AppContextType = {
  isDriverMode: boolean;
  toggleDriverMode: () => void;
  auth: ReturnType<typeof useAuth>;
  recoveryRequest: ReturnType<typeof useRecoveryRequest>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isDriverMode, setIsDriverMode] = useState(false);
  const auth = useAuth();
  const recoveryRequest = useRecoveryRequest();
  
  const toggleDriverMode = () => {
    setIsDriverMode(prev => !prev);
  };
  
  // Initialize app state
  useEffect(() => {
    const initializeApp = async () => {
      // Check if user is logged in
      const userInfo = await auth.getUserInfo();
      if (userInfo) {
        // Check if there's an active recovery request
        await recoveryRequest.getCurrentRequest();
      }
    };
    
    initializeApp();
  }, []);
  
  return (
    <AppContext.Provider
      value={{
        isDriverMode,
        toggleDriverMode,
        auth,
        recoveryRequest,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}