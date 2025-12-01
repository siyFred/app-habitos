import AsyncStorage from '@react-native-async-storage/async-storage';
import { createHabitModel } from '../models/Habit';
import { scheduleHabitNotifications, cancelHabitNotifications, cancelNotification, scheduleNotificationForDay } from '../services/notificationService';

const HABIT_COLLECTION = '@habitos:habits';

export async function getAllHabits() {
  try {
    const storage = await AsyncStorage.getItem(HABIT_COLLECTION);
    return storage ? JSON.parse(storage) : [];
  } catch (error) {
    console.log('Erro ao buscar:', error);
    return [];
  }
}

export async function createAndSaveHabit({ title, description, frequency, notificationTime }) {
  try {
    const storedHabits = await getAllHabits();
    let nextId = 1;
    if (storedHabits.length > 0) {
      const currentIds = storedHabits.map(habit => parseInt(habit.id));
      const maxId = Math.max(...currentIds);
      nextId = maxId + 1;
    }
    
    const tempHabit = createHabitModel(
      nextId,
      title,
      description,
      frequency,
      notificationTime,
      []
    );

    let notificationIds = [];
    if (notificationTime) {
      notificationIds = await scheduleHabitNotifications({
        ...tempHabit,
        id: nextId,
      });
    }

    const newHabit = {
      ...tempHabit,
      notificationIds,
    };

    const updatedHabits = [...storedHabits, newHabit];
    await AsyncStorage.setItem(HABIT_COLLECTION, JSON.stringify(updatedHabits));
    return newHabit;
  } catch (error) {
    console.log('Erro ao salvar:', error);
    throw error;
  }
}

export async function updateHabit(id, updatedHabit) {
  try {
    const habits = await getAllHabits();

    const newHabits = await Promise.all(
      habits.map(async (habit) => {
        if (habit.id !== id) return habit;

        const merged = { ...habit, ...updatedHabit };

        const completedDatesChanged = JSON.stringify(habit.completedDates) !== JSON.stringify(merged.completedDates);
        
        if (completedDatesChanged && merged.notificationTime && merged.frequency && merged.notificationIds) {
          const today = new Date();
          const y = today.getFullYear();
          const m = String(today.getMonth() + 1).padStart(2, '0');
          const d = String(today.getDate()).padStart(2, '0');
          const todayStr = `${y}-${m}-${d}`;
          
          const todayIndex = today.getDay();

          const freqIndex = merged.frequency.indexOf(todayIndex);
          
          if (freqIndex !== -1) {
            const isCompletedToday = (merged.completedDates || []).includes(todayStr);
            const currentNotificationId = merged.notificationIds[freqIndex];

            if (isCompletedToday) {
              if (currentNotificationId) {
                await cancelNotification(currentNotificationId);
                merged.notificationIds[freqIndex] = null;
              }
            } else {
              if (currentNotificationId === null) {
                const newId = await scheduleNotificationForDay(merged, todayIndex);
                if (newId) {
                  merged.notificationIds[freqIndex] = newId;
                }
              }
            }
          }
        }

        const timeChanged = habit.notificationTime !== merged.notificationTime;
        const frequencyChanged = JSON.stringify(habit.frequency) !== JSON.stringify(merged.frequency);
        const shouldReschedule = timeChanged || frequencyChanged;

        if (shouldReschedule) {
          if (habit.notificationIds && habit.notificationIds.length > 0) {
            await cancelHabitNotifications(habit.notificationIds);
          }
          if (habit.notificationId) {
            await cancelNotification(habit.notificationId);
          }
          if (merged.notificationTime) {
            const newIds = await scheduleHabitNotifications({
              ...merged,
              id: habit.id,
            });
            merged.notificationIds = newIds;
            merged.notificationId = null;
          } else {
            merged.notificationIds = [];
            merged.notificationId = null;
          }
        }

        return merged;
      })
    );
    await AsyncStorage.setItem(HABIT_COLLECTION, JSON.stringify(newHabits));
    return newHabits;
  } catch (error) {
    console.log('Erro ao atualizar hábito:', error);
    throw error;
  }
}

export async function deleteHabit(id) {
  try {
    const habits = await getAllHabits();
    const habitToDelete = habits.find(habit => habit.id === id);

    if (habitToDelete) {
      if (habitToDelete.notificationIds && habitToDelete.notificationIds.length > 0) {
        await cancelHabitNotifications(habitToDelete.notificationIds);
      }
      // Legado
      if (habitToDelete.notificationId) {
        await cancelNotification(habitToDelete.notificationId);
      }
    }

    const newHabits = habits.filter(habit => habit.id !== id);
    await AsyncStorage.setItem(HABIT_COLLECTION, JSON.stringify(newHabits));
    return newHabits;
  } catch (error) {
    console.log('Erro ao deletar hábito:', error);
    throw error;
  }
}

export async function deleteAllHabits() {
  try {
    const habits = await getAllHabits();

    await Promise.all(
      habits.map(async (habit) => {
        if (habit.notificationIds && habit.notificationIds.length > 0) {
          await cancelHabitNotifications(habit.notificationIds);
        }
        if (habit.notificationId) {
          await cancelNotification(habit.notificationId);
        }
      })
    );

    await AsyncStorage.removeItem(HABIT_COLLECTION);
    console.log('Todos os hábitos foram apagados.');
  } catch (error) {
    console.log('Erro ao apagar todos os hábitos:', error);
    throw error;
  }
}