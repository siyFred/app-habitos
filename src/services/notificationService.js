import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function requestNotificationPermissionsIfNeeded() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

async function getNotificationSettings() {
  try {
    const stored = await AsyncStorage.getItem('@habitos:notification_settings');
    if (!stored) {
      return { enabled: true, soundEnabled: true };
    }
    const parsed = JSON.parse(stored);
    return {
      enabled: typeof parsed.enabled === 'boolean' ? parsed.enabled : true,
      soundEnabled: typeof parsed.soundEnabled === 'boolean' ? parsed.soundEnabled : true,
    };
  } catch (e) {
    console.log('Erro ao ler configurações globais de notificação', e);
    return { enabled: true, soundEnabled: true };
  }
}

export async function scheduleHabitNotifications(habit) {
  if (!habit.notificationTime || !habit.frequency || habit.frequency.length === 0) {
    return [];
  }

  const settings = await getNotificationSettings();
  if (!settings.enabled) {
    return [];
  }

  const hasPermission = await requestNotificationPermissionsIfNeeded();
  if (!hasPermission) {
    return [];
  }

  const [hour, minute] = habit.notificationTime.split(':').map(Number);
  const notificationIds = [];

  await Notifications.setNotificationChannelAsync('default', {
    name: 'Lembretes de Hábitos',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default',
    vibrationPattern: [0, 250, 250, 250],
  });

  for (const dayIndex of habit.frequency) {
    try {
      const weekday = dayIndex + 1;

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: habit.title,
          body: 'Hora de fazer seu hábito!',
          sound: settings.soundEnabled ? undefined : null,
          priority: Notifications.AndroidNotificationPriority.MAX,
          data: {
            habitId: habit.id,
          },
          android: {
            channelId: 'default',
            priority: 'max',
          },
        },
        trigger: {
          type: 'weekly',
          weekday: weekday,
          hour: hour,
          minute: minute,
          second: 0,
          repeats: true,
        },
      });
      
      notificationIds.push(id);
    } catch (error) {
      console.log(`Erro ao agendar notificação para o dia ${dayIndex}:`, error);
    }
  }

  return notificationIds;
}

export async function scheduleNotificationForDay(habit, dayIndex) {
  if (!habit.notificationTime) return null;

  const settings = await getNotificationSettings();
  if (!settings.enabled) return null;

  const hasPermission = await requestNotificationPermissionsIfNeeded();
  if (!hasPermission) return null;

  const [hour, minute] = habit.notificationTime.split(':').map(Number);
  
  await Notifications.setNotificationChannelAsync('default', {
    name: 'Lembretes de Hábitos',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default',
    vibrationPattern: [0, 250, 250, 250],
  });

  try {
    const weekday = dayIndex + 1;
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: habit.title,
        body: 'Hora de fazer seu hábito!',
        sound: settings.soundEnabled ? undefined : null,
        priority: Notifications.AndroidNotificationPriority.MAX,
        data: { habitId: habit.id },
        android: { 
          channelId: 'default',
          priority: 'max',
        },
      },
      trigger: {
        type: 'weekly',
        weekday: weekday,
        hour: hour,
        minute: minute,
        second: 0,
        repeats: true,
      },
    });
    return id;
  } catch (error) {
    console.log(`Erro ao agendar notificação individual para dia ${dayIndex}:`, error);
    return null;
  }
}

export async function cancelHabitNotifications(notificationIds) {
  if (!notificationIds || !Array.isArray(notificationIds)) return;
  
  for (const id of notificationIds) {
    try {
      await Notifications.cancelScheduledNotificationAsync(id);
    } catch (e) {
      console.log('Erro ao cancelar notificação:', id, e);
    }
  }
}

export async function cancelNotification(notificationId) {
  if (notificationId) {
    await cancelHabitNotifications([notificationId]);
  }
}
