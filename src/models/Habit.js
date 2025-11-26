import 'react-native-get-random-values';

export function createHabitModel(id, title, frequency, description = null, notificationTime = null) {
  return {
    id: id.toString(),
    title,
    frequency,
    description,
    completedDates: [],
    notificationTime
  };
}