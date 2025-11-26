
export function createHabitModel(id, title, description = null, frequency, notificationTime = null) {
  return {
    id: id.toString(),
    title,
    description,
    frequency,
    completedDates: [],
    notificationTime
  };
}