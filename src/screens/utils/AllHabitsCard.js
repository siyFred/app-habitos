import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/themeContext';

const months = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export default function AllHabitsCard({ visible, onClose, habits, onSelectDate }) {
  const { theme } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState([]);

  useEffect(() => {
    if (visible) {
      generateDays();
    }
  }, [currentDate, visible, habits]);

  const generateDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const days = [];

    for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
      days.push(null);
    }

    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    setDaysInMonth(days);
  };

  const hasHabitOnDay = (date) => {
    if (!date) return false;
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();

    return habits.some(habit => {
      const habitCreatedAt = habit.createdAt || '2000-01-01';
      if (dateStr < habitCreatedAt) {
        return false;
      }

      return habit.frequency && habit.frequency.includes(dayOfWeek);
    });
  };

  const changeMonth = (increment) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentDate(newDate);
  };

  const changeYear = (increment) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(newDate.getFullYear() + increment);
    setCurrentDate(newDate);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles(theme).modalOverlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles(theme).modalContent} onStartShouldSetResponder={() => true}>
          <View style={styles(theme).header}>
            <Text style={styles(theme).title}>Calendário de Hábitos</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.text_primary} />
            </TouchableOpacity>
          </View>

          <View style={styles(theme).controlsRow}>
            <IconButton icon="chevron-left" size={20} onPress={() => changeYear(-1)} />
            <Text style={styles(theme).yearText}>{currentDate.getFullYear()}</Text>
            <IconButton icon="chevron-right" size={20} onPress={() => changeYear(1)} />
          </View>

          <View style={styles(theme).controlsRow}>
            <IconButton icon="chevron-left" size={20} onPress={() => changeMonth(-1)} />
            <Text style={styles(theme).monthText}>{months[currentDate.getMonth()]}</Text>
            <IconButton icon="chevron-right" size={20} onPress={() => changeMonth(1)} />
          </View>

          <View style={styles(theme).weekDaysRow}>
            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, index) => (
              <Text key={index} style={styles(theme).weekDayText}>{day}</Text>
            ))}
          </View>

          <View style={styles(theme).daysGrid}>
            {daysInMonth.map((date, index) => {
              if (!date) {
                return <View key={index} style={styles(theme).emptyDay} />;
              }

              const hasHabit = hasHabitOnDay(date);
              const isToday = date.toDateString() === new Date().toDateString();

              return (
                <Button
                  key={index}
                  mode="outlined"
                  style={[
                    styles(theme).dayButton,
                    hasHabit ? styles(theme).dayButtonWithHabit : styles(theme).dayButtonNoHabit,
                    isToday && styles(theme).dayButtonToday
                  ]}
                  contentStyle={styles(theme).dayButtonContent}
                  labelStyle={[
                    styles(theme).dayButtonLabel,
                    !hasHabit && styles(theme).dayButtonLabelNoHabit
                  ]}
                  compact
                  onPress={() => {
                    if (hasHabit && onSelectDate) {
                      onSelectDate(date);
                    }
                  }}
                  disabled={!hasHabit}
                >
                  {date.getDate()}
                </Button>
              );
            })}
          </View>
          
          <View style={styles(theme).legendContainer}>
            <View style={styles(theme).legendItem}>
              <View style={[styles.legendColor, { backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border }]} />
              <Text style={styles(theme).legendText}>Com hábitos</Text>
            </View>
            <View style={styles(theme).legendItem}>
              <View style={[styles.legendColor, { backgroundColor: theme.disabled }]} />
              <Text style={styles(theme).legendText}>Sem hábitos</Text>
            </View>
          </View>

        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = (theme) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.surface,
    width: '90%',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    maxHeight: '80%'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text_primary,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  yearText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.text_secondary,
  },
  monthText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.primary,
    textTransform: 'uppercase',
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 10,
    paddingHorizontal: 5,

  },
  weekDayText: {
    width: 35,
    textAlign: 'center',
    fontWeight: 'bold',
    color: theme.text_secondary,
    fontSize: 12
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  emptyDay: {
    width: '13.5%',
    aspectRatio: 1,
    margin: '0.3%',
  },
  dayButton: {
    width: '13.5%',
    aspectRatio: 1,
    margin: '0.3%',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.border,
  },
  dayButtonContent: {
    height: '100%',
    width: '100%',
    padding: 0,
  },
  dayButtonWithHabit: {
    backgroundColor: theme.surface,
  },
  dayButtonNoHabit: {
    backgroundColor: theme.disabled,
    borderColor: theme.disabled,
  },
  dayButtonToday: {
    borderColor: theme.primary,
    borderWidth: 2,
  },
  dayButtonLabel: {
    fontSize: 12,
    color: theme.text_primary,
    marginHorizontal: 0,
    marginVertical: 0,
  },
  dayButtonLabelNoHabit: {
    color: theme.text_tertiary,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: theme.divider,
    paddingTop: 15
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: theme.text_secondary,
  }
});
