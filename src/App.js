import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { 
  Provider as PaperProvider, 
  MD3LightTheme, 
  MD3DarkTheme 
} from 'react-native-paper';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

import AppRoutes from './routes/AppRoutes';
import { ThemeProvider, useTheme } from '../src/context/themeContext';

const MainContent = () => {
    const { theme, themeType } = useTheme();

    // Proteção contra erro de carregamento
    if (!theme) return null;

    const toastConfig = {
        success: (props) => (
            <BaseToast
                {...props}
                style={{
                    borderLeftColor: theme.primary,
                    backgroundColor: theme.surface || '#FFF'
                }}
                contentContainerStyle={{ paddingHorizontal: 15 }}
                text1Style={{
                    fontSize: 15,
                    fontWeight: '400',
                    color: theme.text_primary
                }}
            />
        ),
        error: (props) => (
            <ErrorToast
                {...props}
                text1Style={{ fontSize: 15, fontWeight: '400' }}
            />
        )
    };

    const isDark = themeType === 'dark'; 
    const baseTheme = isDark ? MD3DarkTheme : MD3LightTheme;
    
    const paperTheme = {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        ...theme
      },
    };

    return (
        <PaperProvider theme={paperTheme}>
            <NavigationContainer>
                {/* StatusBar ajusta a cor dos ícones (bateria/hora) */}
                <StatusBar 
                  style={themeType === 'dark' ? 'light' : 'dark'} 
                  backgroundColor={theme.background} 
                />
                <AppRoutes />
                <Toast config={toastConfig} />
            </NavigationContainer>
        </PaperProvider>
    )
}

export default function App() {
    return (
        <ThemeProvider>
            <MainContent />
        </ThemeProvider>
    );
}