import React, { createContext, useState, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { colors_dark, colors_white } from '../styles/theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme(); 
  
  const [themeMode, setThemeMode] = useState('system');

  const activeThemeType = themeMode === 'system' 
    ? (systemScheme === 'dark' ? 'dark' : 'light') 
    : themeMode;

  const theme = activeThemeType === 'dark' ? colors_dark : colors_white;

  return (
    <ThemeContext.Provider value={{ 
      theme,
      themeMode,
      setThemeMode,
      themeType: activeThemeType 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);