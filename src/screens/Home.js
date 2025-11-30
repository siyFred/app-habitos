import { useCallback, useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView, Pressable, Platform, TouchableNativeFeedback } from 'react-native';
import { AnimatedFAB, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { createFabStyles } from '../styles/styles_components.js'
import { getAllHabits, updateHabit, deleteHabit } from '../repositories/HabitRepository';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import AllHabitsCard from './utils/AllHabitsCard';
import { useTheme } from '../context/themeContext';
import Animated, { LinearTransition } from 'react-native-reanimated';

const formatDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const getCurrentWeekDays = () => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 is Sunday
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - currentDay);
  
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    days.push(d);
  }
  return days;
};

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const fullWeekDays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

// card habit (deve ser movido para um arquivo separado dps)
const HabitCard = ({ item, isCompleted, onToggle, onOption, theme, styles }) => {
  return (
    <View style={styles.cardContainer}>

    <TouchableOpacity
      style={styles.checkboxArea}
      onPress={() => onToggle(item)}
    >
      <Ionicons
        name={isCompleted ? "checkbox" : "square-outline"}
        size={28}
        color={isCompleted ? theme.primary : theme.text_tertiary}
      />
    </TouchableOpacity>

    <View style={styles.cardContent}>
      <Text style={[
        styles.cardTitle,
        isCompleted && { textDecorationLine: 'line-through', color: theme.text_tertiary }
      ]}>
        {item.title}
      </Text>
      {item.description ? (
        <Text style={styles.cardDescription} numberOfLines={1}>
          {item.description}
        </Text>
      ) : null}
    </View>

    {item.notificationTime && (
      <View style={styles.timeContainer}>
        <Ionicons name="time-outline" size={14} color={theme.text_secondary} />
        <Text style={styles.timeText}>{item.notificationTime}</Text>
      </View>
    )}

    <TouchableOpacity
      style={styles.menuButton}
      onPress={() => onOption(item)}
    >
      <Ionicons name="ellipsis-vertical" size={20} color={theme.text_tertiary} />
    </TouchableOpacity>
  </View>
  );
};

const AnimatedHabitCard = ({ item, isCompleted, onToggle, onOption, theme, styles }) => (
  <Animated.View
    layout={LinearTransition.springify()}
  >
    <HabitCard item={item} isCompleted={isCompleted} onToggle={onToggle} onOption={onOption} theme={theme} styles={styles} />
  </Animated.View>
);

export default function HomeScreen({ navigation }) {
  const [isExtended, setIsExtended] = useState(true);
  const [habits, setHabits] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState([]);

  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [isFabVisible, setIsFabVisible] = useState(false);
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);

  const { theme } = useTheme();
  const styles = createStyles(theme);
  const fabStyles = createFabStyles(theme);

  const selectedDateStr = formatDate(selectedDate);
  const selectedDayIndex = selectedDate.getDay();
  const isToday = selectedDateStr === formatDate(new Date());

  useEffect(() => {
    setWeekDates(getCurrentWeekDays());
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHabits();
      setIsFabVisible(true);
      return () => setIsFabVisible(false);
    }, [])
  );

  async function loadHabits() {
    const data = await getAllHabits();
    setHabits(Array.isArray(data) ? data : []);
  }

  async function handleToggleCheck(habit) {
    try {
      const completedDates = habit.completedDates || [];
      const isCompletedOnSelectedDate = completedDates.includes(selectedDateStr);

      let newDates;

      if (isCompletedOnSelectedDate) {
        newDates = completedDates.filter(date => date !== selectedDateStr);
      } else {
        newDates = [...completedDates, selectedDateStr];
      }

      await updateHabit(habit.id, { completedDates: newDates });

      await loadHabits();

      if (!isCompletedOnSelectedDate) {
        Toast.show({ type: 'success', text1: 'Hábito concluído!', visibilityTime: 2000 });
      }

    } catch (error) {
      console.error('Erro ao marcar hábito:', error);
      Toast.show({ type: 'error', text1: 'Erro ao atualizar.' });
    }
  }

  const displayedHabits = habits.filter(h => (h.frequency || []).includes(selectedDayIndex));
  const pendingHabits = displayedHabits.filter(h => !(h.completedDates || []).includes(selectedDateStr));
  const completedHabits = displayedHabits.filter(h => (h.completedDates || []).includes(selectedDateStr));

  pendingHabits.sort((a, b) => {
    if (!a.notificationTime) return -1;
    if (!b.notificationTime) return 1;
    return a.notificationTime.localeCompare(b.notificationTime);
  });

  function onScroll({ nativeEvent }) {
    const currentScrollPosition = Math.floor(nativeEvent.contentOffset.y) ?? 0;
    setIsExtended(currentScrollPosition <= 30);
  }

  function handleCreateHabit() {
    navigation.navigate('NewHabit');
  }

  function handleOpenOptions(habit) {
    setSelectedHabit(habit);
    setOptionsModalVisible(true);
  }

  function handleEdit() {
    setOptionsModalVisible(false);
    navigation.navigate('NewHabit', { habitToEdit: selectedHabit });
  }

  function handleDeleteRequest() {
    setOptionsModalVisible(false);
    setTimeout(() => {
      setDeleteConfirmVisible(true);
    }, 300);
  }

  async function confirmDelete() {
    if (!selectedHabit) return;
    try {
      await deleteHabit(selectedHabit.id);
      await loadHabits();
      Toast.show({ type: 'success', text1: 'Hábito excluído.' });
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Erro ao excluir.' });
    } finally {
      setDeleteConfirmVisible(false);
      setSelectedHabit(null);
    }
  }

  const renderItems = () => {
    const items = [];

    items.push({
      type: 'header',
      key: 'header-pending',
      title: `Hábitos não completados - ${pendingHabits.length}`
    });

    if (pendingHabits.length === 0 && completedHabits.length === 0) {
      items.push({
        type: 'empty',
        key: 'empty-all',
        text: isToday ? 'Você não tem hábitos para hoje. Crie um novo! :)' : 'Nenhum hábito planejado para este dia.'
      });
    } else if (pendingHabits.length === 0) {
      items.push({
        type: 'empty',
        key: 'empty-pending',
        text: 'Tudo feito! 🎉'
      });
    } else {
      pendingHabits.forEach(h => {
        items.push({ type: 'habit', key: h.id, data: h, isCompleted: false });
      });
    }

    if (completedHabits.length > 0) {
      items.push({
        type: 'header',
        key: 'header-completed',
        title: `Hábitos completados - ${completedHabits.length}`,
        style: { marginTop: 25 }
      });
      completedHabits.forEach(h => {
        items.push({ type: 'habit', key: h.id, data: h, isCompleted: true });
      });
    }

    return items.map(item => {
      if (item.type === 'header') {
        return (
          <Text key={item.key} style={[styles.sectionTitle, item.style]}>
            {item.title}
          </Text>
        );
      }
      if (item.type === 'empty') {
        return (
          <Text key={item.key} style={styles.emptyText}>
            {item.text}
          </Text>
        );
      }
      if (item.type === 'habit') {
        return (
          <AnimatedHabitCard 
            key={item.key} 
            item={item.data} 
            isCompleted={item.isCompleted} 
            onToggle={handleToggleCheck}
            onOption={handleOpenOptions}
            theme={theme}
            styles={styles}
          />
        );
      }
      return null;
    });
  };

  return (
    <View style={styles.container}>

      <View style={styles.calendarContainer}>
        {weekDates.map((date, index) => {
          const isSelected = formatDate(date) === selectedDateStr;
          const isTodayDate = formatDate(date) === formatDate(new Date());
          
          if (Platform.OS === 'android') {
            return (
              <View 
                key={index}
                style={[
                  styles.dayButton, 
                  isTodayDate && styles.dayButtonToday,
                  { 
                    borderRadius: 12, 
                    overflow: 'hidden',
                    backgroundColor: isSelected ? theme.primary : 'transparent'
                  }
                ]}
              >
                <TouchableNativeFeedback
                  onPress={() => setSelectedDate(date)}
                  background={TouchableNativeFeedback.Ripple(isSelected ? "rgba(255, 255, 255, 0.32)" : "rgba(123, 31, 162, 0.2)", false)}
                  useForeground={true}
                >
                  <View style={{ 
                    flex: 1, 
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <Text numberOfLines={1} style={[styles.dayLabel, isSelected && styles.dayTextSelected]}>{weekDays[index]}</Text>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.dayNumber, isSelected && styles.dayTextSelected]}>
                      {String(date.getDate()).padStart(2, '0')}
                    </Text>
                  </View>
                </TouchableNativeFeedback>
              </View>
            );
          }

          return (
            <TouchableOpacity
              key={index} 
              onPress={() => setSelectedDate(date)}
              style={[
                styles.dayButton, 
                isTodayDate && !isSelected && styles.dayButtonToday,
                { 
                  backgroundColor: isSelected ? theme.primary : 'transparent',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden'
                }
              ]}
            >
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text numberOfLines={1} style={[styles.dayLabel, isSelected && styles.dayTextSelected]}>{weekDays[index]}</Text>
                <Text 
                  numberOfLines={1} 
                  adjustsFontSizeToFit
                  style={[styles.dayNumber, isSelected && styles.dayTextSelected]}
                >
                  {String(date.getDate()).padStart(2, '0')}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <Text style={[styles.dateHeader, { marginBottom: 0 }]}>
            {isToday 
              ? 'Hoje' 
              : `${fullWeekDays[selectedDayIndex]} - ${selectedDate.getDate()}/${selectedDate.getMonth() + 1}${selectedDate.getFullYear() !== new Date().getFullYear() ? `/${selectedDate.getFullYear()}` : ''}`
            }
          </Text>
          <TouchableOpacity onPress={() => setCalendarModalVisible(true)}>
            <Ionicons name="calendar" size={24} color={theme.primary} />
          </TouchableOpacity>
        </View>

        {renderItems()}
      </ScrollView>

      <Modal
        visible={optionsModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setOptionsModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setOptionsModalVisible(false)}
        >
          <View style={styles.optionsModalContent}>
            <Text style={styles.modalTitle}>Opções</Text>

            <TouchableOpacity style={styles.optionButton} onPress={handleEdit}>
              <Ionicons name="pencil" size={20} color={theme.text_primary} />
              <Text style={styles.optionText}>Editar Hábito</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.optionButton} onPress={handleDeleteRequest}>
              <Ionicons name="trash-outline" size={20} color={theme.danger} />
              <Text style={[styles.optionText, { color: theme.danger }]}>Excluir Hábito</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={deleteConfirmVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDeleteConfirmVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalContent}>
            <Text style={styles.modalTitle}>Excluir Hábito?</Text>
            <Text style={{ marginBottom: 20, color: theme.text_secondary, textAlign: 'center' }}>
              Isso apagará "{selectedHabit?.title}" e todo o histórico dele para sempre.
            </Text>

            <View style={styles.modalButtonsRow}>
              <Button mode="outlined" onPress={() => setDeleteConfirmVisible(false)} textColor={theme.text_secondary} style={{ flex: 1, marginRight: 10 }}>
                Cancelar
              </Button>
              <Button mode="contained" onPress={confirmDelete} buttonColor={theme.danger} style={{ flex: 1 }}>
                Excluir
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      {isFabVisible && (
        <AnimatedFAB
          label="Novo Hábito"
          icon={({ size, color }) => <Ionicons name="add" size={size} color={color} />}
          labelStyle={{ fontSize: 14, fontWeight: '600', marginLeft: -8 }}
          extended={isExtended}
          onPress={handleCreateHabit}
          visible={true}
          animateFrom={'right'}
          iconMode={'dynamic'}
          style={fabStyles}
          color={theme.text_on_primary}
        />
      )}

      <AllHabitsCard 
        visible={calendarModalVisible} 
        onClose={() => setCalendarModalVisible(false)} 
        habits={habits}
        onSelectDate={(date) => {
          setSelectedDate(date);
          setCalendarModalVisible(false);
        }}
      />
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  dateHeader: { fontSize: 30, fontWeight: 'bold', color: theme.text_primary, marginBottom: 10 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: theme.primary, marginBottom: 10, marginTop: 10, textTransform: 'uppercase', letterSpacing: 1 },
  emptyText: { color: theme.text_tertiary, fontStyle: 'italic', marginTop: 10 },
  
  cardContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.surface, paddingVertical: 15, paddingHorizontal: 15, marginBottom: 12, borderRadius: 16, elevation: 2, shadowColor: theme.black, shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 },
  checkboxArea: { marginRight: 15 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: theme.text_primary },
  cardDescription: { fontSize: 12, color: theme.text_secondary, marginTop: 2 },
  timeContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.background, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginRight: 10 },
  timeText: { fontSize: 12, color: theme.text_secondary, marginLeft: 4, fontWeight: '500' },
  menuButton: { padding: 5 },
  
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.overlay },
  optionsModalContent: { backgroundColor: theme.surface, padding: 20, borderRadius: 16, width: '70%', elevation: 5 },
  optionButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  optionText: { fontSize: 16, marginLeft: 15, color: theme.text_primary, fontWeight: '500' },
  divider: { height: 1, backgroundColor: theme.divider, marginVertical: 5 },
  confirmModalContent: { backgroundColor: theme.surface, padding: 24, borderRadius: 20, width: '85%', elevation: 5, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: theme.text_primary },
  modalButtonsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, width: '100%' },
  
  calendarContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 5, paddingVertical: 15, backgroundColor: theme.surface, marginBottom: 10, elevation: 2 },
  dayButton: { flex: 1, height: 60, marginHorizontal: 1, borderRadius: 12, minWidth: 40, padding: 0 },
  dayButtonContent: { height: 60, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 0 },
  dayButtonToday: { borderWidth: 1, borderColor: theme.primary },
  dayLabel: { fontSize: 12, color: theme.text_tertiary, marginBottom: 0, lineHeight: 14, textAlign: 'center' },
  dayNumber: { fontSize: 16, fontWeight: 'bold', color: theme.text_primary, lineHeight: 20, textAlign: 'center' },
  dayTextSelected: { color: theme.text_on_primary }
});