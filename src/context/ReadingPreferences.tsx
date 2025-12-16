import React, { createContext, useContext, useState, useEffect } from 'react';

type FontSize = 'sm' | 'base' | 'lg' | 'xl';
type LineHeight = 'normal' | 'relaxed' | 'loose';

interface ReadingPreferencesContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  lineHeight: LineHeight;
  setLineHeight: (height: LineHeight) => void;
  focusMode: boolean;
  setFocusMode: (focus: boolean) => void;
  toggleFocusMode: () => void;
}

const ReadingPreferencesContext = createContext<ReadingPreferencesContextType | undefined>(undefined);

export const ReadingPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontSize, setFontSize] = useState<FontSize>('base');
  const [lineHeight, setLineHeight] = useState<LineHeight>('relaxed');
  const [focusMode, setFocusMode] = useState(false);

  const toggleFocusMode = () => setFocusMode(prev => !prev);

  // Optional: Persist to localStorage
  useEffect(() => {
    const saved = localStorage.getItem('reading-prefs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFontSize(parsed.fontSize || 'base');
        setLineHeight(parsed.lineHeight || 'relaxed');
      } catch (e) { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('reading-prefs', JSON.stringify({ fontSize, lineHeight }));
  }, [fontSize, lineHeight]);

  return (
    <ReadingPreferencesContext.Provider value={{
      fontSize, setFontSize,
      lineHeight, setLineHeight,
      focusMode, setFocusMode, toggleFocusMode
    }}>
      {children}
    </ReadingPreferencesContext.Provider>
  );
};

export const useReadingPreferences = () => {
  const context = useContext(ReadingPreferencesContext);
  if (!context) {
    throw new Error('useReadingPreferences must be used within a ReadingPreferencesProvider');
  }
  return context;
};
