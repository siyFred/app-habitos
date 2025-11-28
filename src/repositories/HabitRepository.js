import AsyncStorage from '@react-native-async-storage/async-storage';
import { createHabitModel } from '../models/Habit';

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
    const newHabit = createHabitModel(
      nextId, 
      title, 
      description,
      frequency, 
      notificationTime
    );
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
    const newHabits = habits.map(habit =>
      habit.id === id ? { ...habit, ...updatedHabit } : habit
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
    await AsyncStorage.removeItem(HABIT_COLLECTION);
    console.log('Todos os hábitos foram apagados.');
  } catch (error) {
    console.log('Erro ao apagar todos os hábitos:', error);
    throw error;
  }
}