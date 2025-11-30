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
    // Agora pegamos 'themeType' também, para saber se é dark ou light
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
                    color: theme.text_primary // Ajustado para o nome do seu tema
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

    // Configura o tema do Paper corretamente
    const paperTheme = {
      ...(themeType === 'dark' ? MD3DarkTheme : MD3LightTheme),
      colors: {
        ...(themeType === 'dark' ? MD3DarkTheme.colors : MD3LightTheme.colors),
        ...theme,
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