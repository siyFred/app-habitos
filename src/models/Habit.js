
export function createHabitModel(id, title, description = null, frequency, notificationTime = null, notificationIds = []) {
  return {
    id: id.toString(),
    title,
    description,
    frequency,
    completedDates: [],
    notificationTime,
    notificationIds: notificationIds || [],
    createdAt: new Date().toISOString().split('T')[0]
  };
}