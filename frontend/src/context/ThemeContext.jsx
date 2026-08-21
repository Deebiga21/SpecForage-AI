import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('specforge_theme') || 'light';
  });
  
  const [density, setDensityState] = useState(() => {
    return localStorage.getItem('specforge_density') || 'comfortable';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    
    let effectiveTheme = theme;
    if (theme === 'system') {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else if (theme === 'mixed') {
      effectiveTheme = 'light';
    }
    
    root.classList.add(effectiveTheme);
    localStorage.setItem('specforge_theme', theme);
  }, [theme]);
  
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('density-compact', 'density-comfortable');
    root.classList.add(`density-${density}`);
    localStorage.setItem('specforge_density', density);
  }, [density]);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const setTheme = (t) => {
    setThemeState(t);
  };
  
  const setDensity = (d) => {
    setDensityState(d);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, density, setDensity }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
