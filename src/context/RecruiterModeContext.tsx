import React, { createContext, useContext, useState, useEffect } from 'react';

interface RecruiterModeContextType {
  isRecruiterMode: boolean;
  toggleRecruiterMode: () => void;
  enableRecruiterMode: () => void;
  disableRecruiterMode: () => void;
}

const RecruiterModeContext = createContext<RecruiterModeContextType | undefined>(undefined);

export const RecruiterModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isRecruiterMode, setIsRecruiterMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('recruiter-mode');
    if (saved === 'true') {
      setIsRecruiterMode(true);
    }
  }, []);

  const toggleRecruiterMode = () => {
    setIsRecruiterMode(prev => {
      const newValue = !prev;
      localStorage.setItem('recruiter-mode', String(newValue));
      return newValue;
    });
  };

  const enableRecruiterMode = () => {
    setIsRecruiterMode(true);
    localStorage.setItem('recruiter-mode', 'true');
  };

  const disableRecruiterMode = () => {
    setIsRecruiterMode(false);
    localStorage.setItem('recruiter-mode', 'false');
  };

  return (
    <RecruiterModeContext.Provider value={{
      isRecruiterMode,
      toggleRecruiterMode,
      enableRecruiterMode,
      disableRecruiterMode
    }}>
      {children}
    </RecruiterModeContext.Provider>
  );
};

export const useRecruiterMode = () => {
  const context = useContext(RecruiterModeContext);
  if (!context) {
    throw new Error('useRecruiterMode must be used within a RecruiterModeProvider');
  }
  return context;
};
