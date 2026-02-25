import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';
type FontSize = 'small' | 'medium' | 'large';
type FontFamily = 'sans' | 'serif' | 'mono';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  fontFamily: FontFamily;
  setFontFamily: (font: FontFamily) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => 
    (localStorage.getItem('theme') as Theme) || 'system'
  );
  const [fontSize, setFontSize] = useState<FontSize>(() => 
    (localStorage.getItem('fontSize') as FontSize) || 'medium'
  );
  const [fontFamily, setFontFamily] = useState<FontFamily>(() => 
    (localStorage.getItem('fontFamily') as FontFamily) || 'sans'
  );

  // Apply Theme (Dark Mode)
  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Apply Font Size
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
    root.classList.add(`font-size-${fontSize}`);
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  // Apply Font Family
  useEffect(() => {
    const body = window.document.body;
    body.classList.remove('font-sans', 'font-serif', 'font-mono');
    body.classList.add(`font-${fontFamily}`);
    localStorage.setItem('fontFamily', fontFamily);
  }, [fontFamily]);

  return (
    <ThemeContext.Provider value={{ 
      theme, setTheme, 
      fontSize, setFontSize, 
      fontFamily, setFontFamily 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};