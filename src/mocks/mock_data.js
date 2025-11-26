/*
 *
 *
 * REQUISITOS DE OBJETO (HABIT)
 * 
 * title : string
 * description : string | null
 * completedDates : string[] (YYYY-MM-DD)
 * frequency : number[] (0 - domingo, 1 - segunda, ..., 6 - sábado)
 * notificationTime : string | null (HH:mm)
 * 
 * 
 */

export const MOCK_HABITS = [
  {
    id: '1',
    title: 'Beber água',
    description: 'Beber água regularmente ao longo do dia',
    completedDates: ['2025-11-23', '2025-11-25'],
    frequency: [0, 1, 2, 3, 4, 5, 6],
    notificationTime: '09:00'
  },
  {
    id: '2',
    title: 'Ir na Academia',
    description: null,
    completedDates: [],
    frequency: [1, 3, 5],
    notificationTime: '18:30',
  },
  {
    id: '3',
    title: 'Ler Livro',
    description: 'Ler pelo menos 10 páginas de um livro',
    completedDates: ['2025-11-23'],
    frequency: [0, 6],
    notificationTime: null,
  }
]

