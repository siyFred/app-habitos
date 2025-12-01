import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { 
  Provider as PaperProvider, 
  MD3LightTheme, 
  MD3DarkTheme 
} from 'react-native-paper';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AppRoutes from './routes/AppRoutes';
import { ThemeProvider, useTheme } from '../src/context/themeContext';
import { scheduleNotificationForDay } from './services/notificationService';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Função de reparo de notificações perdidas
async function restoreMissingNotifications() {
  try {
    const storage = await AsyncStorage.getItem('@habitos:habits');
    if (!storage) return;
    
    const habits = JSON.parse(storage);
    let hasChanges = false;
    const today = new Date();
    // FIX: Usar data local para consistência
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    const todayStr = `${y}-${m}-${d}`;
    
    const todayIndex = today.getDay();

    for (const habit of habits) {
      if (!habit.notificationTime || !habit.frequency || !habit.notificationIds) continue;

      for (let i = 0; i < habit.frequency.length; i++) {
        const dayIndex = habit.frequency[i];
        const currentId = habit.notificationIds[i];

        if (currentId === null) {
          const isToday = dayIndex === todayIndex;
          const isCompletedToday = (habit.completedDates || []).includes(todayStr);

          if (isToday && isCompletedToday) {
            continue;
          }

          console.log(`Restaurando notificação perdida para o hábito "${habit.title}" (Dia ${dayIndex})`);
          const newId = await scheduleNotificationForDay(habit, dayIndex);
          if (newId) {
            habit.notificationIds[i] = newId;
            hasChanges = true;
          }
        }
      }
    }

    if (hasChanges) {
      await AsyncStorage.setItem('@habitos:habits', JSON.stringify(habits));
    }
  } catch (e) {
    console.log('Erro ao restaurar notificações:', e);
  }
}

const MainContent = () => {
    const { theme, themeType } = useTheme();

    useEffect(() => {
      restoreMissingNotifications();
    }, []);

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