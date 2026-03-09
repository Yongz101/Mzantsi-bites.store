
import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';
type ButtonTextColor = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  accentColor: string;
  buttonTextColor: ButtonTextColor;
  setTheme: (theme: Theme) => void;
  setAccentColor: (color: string) => void;
  setButtonTextColor: (color: ButtonTextColor) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || 'dark';
    }
    return 'dark';
  });

  const [accentColor, setAccentColor] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accentColor') || '#d9ff00';
    }
    return '#d9ff00';
  });

  const [buttonTextColor, setButtonTextColor] = useState<ButtonTextColor>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('buttonTextColor') as ButtonTextColor) || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
    
    // Update CSS variables
    root.style.setProperty('--accent-color', accentColor);
    root.style.setProperty('--button-text-color', buttonTextColor === 'light' ? '#ffffff' : '#000000');
    localStorage.setItem('accentColor', accentColor);
    localStorage.setItem('buttonTextColor', buttonTextColor);
  }, [theme, accentColor, buttonTextColor]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      accentColor, 
      buttonTextColor, 
      setTheme, 
      setAccentColor, 
      setButtonTextColor, 
      toggleTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
