import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors_dark, colors_white } from '../styles/theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme(); 
  const [themeMode, setThemeModeState] = useState('system');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const loadThemeMode = async () => {
      try {
        const stored = await AsyncStorage.getItem('@habitapp_theme_mode');
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
          setThemeModeState(stored);
        } else {
          setThemeModeState('system');
        }
      } catch (e) {
        setThemeModeState('system');
      } finally {
        setIsHydrated(true);
      }
    };

    loadThemeMode();
  }, []);

  const setThemeMode = async (mode) => {
    try {
      if (mode === 'light' || mode === 'dark' || mode === 'system') {
        setThemeModeState(mode);
        await AsyncStorage.setItem('@habitapp_theme_mode', mode);
      }
    } catch (e) {
      setThemeModeState(mode);
    }
  };

  if (!isHydrated) {
    return null;
  }

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