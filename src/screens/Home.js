import { useCallback, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { AnimatedFAB, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { fab } from '../styles/styles_components.js'
import { getAllHabits, updateHabit, deleteHabit } from '../repositories/HabitRepository';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const getTodayDateString = () => {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export default function HomeScreen({ navigation }) {
  const [isExtended, setIsExtended] = useState(true);
  const [habits, setHabits] = useState([]);

  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);

  const todayDateStr = getTodayDateString();
  const todayDayIndex = new Date().getDay();

  useFocusEffect(
    useCallback(() => {
      loadHabits();
    }, [])
  );

  async function loadHabits() {
    const data = await getAllHabits();
    setHabits(Array.isArray(data) ? data : []);
  }

  async function handleToggleCheck(habit) {
    try {
      const completedDates = habit.completedDates || [];
      const isCompletedToday = completedDates.includes(todayDateStr);

      let newDates;

      if (isCompletedToday) {
        newDates = completedDates.filter(date => date !== todayDateStr);
      } else {
        newDates = [...completedDates, todayDateStr];
      }

      await updateHabit(habit.id, { completedDates: newDates });

      await loadHabits();

      if (!isCompletedToday) {
        Toast.show({ type: 'success', text1: 'Hábito concluído!', visibilityTime: 2000 });
      }

    } catch (error) {
      console.error('Erro ao marcar hábito:', error);
      Toast.show({ type: 'error', text1: 'Erro ao atualizar.' });
    }
  }

  const todaysHabits = habits.filter(h => (h.frequency || []).includes(todayDayIndex));
  const pendingHabits = todaysHabits.filter(h => !(h.completedDates || []).includes(todayDateStr));
  const completedHabits = todaysHabits.filter(h => (h.completedDates || []).includes(todayDateStr));

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

  // card habit (deve ser movido para um arquivo separado dps)
  const HabitCard = ({ item, isCompleted }) => (
    <View style={styles.cardContainer}>

      <TouchableOpacity
        style={styles.checkboxArea}
        onPress={() => handleToggleCheck(item)}
      >
        <Ionicons
          name={isCompleted ? "checkbox" : "square-outline"}
          size={28}
          color={isCompleted ? "#7B1FA2" : "#999"}
        />
      </TouchableOpacity>

      <View style={styles.cardContent}>
        <Text style={[
          styles.cardTitle,
          isCompleted && { textDecorationLine: 'line-through', color: '#999' }
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
          <Ionicons name="time-outline" size={14} color="#777" />
          <Text style={styles.timeText}>{item.notificationTime}</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => handleOpenOptions(item)}
      >
        <Ionicons name="ellipsis-vertical" size={20} color="#999" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F7FA' }}>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.dateHeader}>Hoje</Text>

        <Text style={styles.sectionTitle}>A fazer - {pendingHabits.length}</Text>
        {pendingHabits.length === 0 && completedHabits.length === 0 ? (
          <Text style={styles.emptyText}>Você não tem hábitos para hoje. Crie um novo! :)</Text>
        ) : pendingHabits.length === 0 ? (
          <Text style={styles.emptyText}>Tudo feito por hoje! 🎉</Text>
        ) : (
          pendingHabits.map(item => <HabitCard key={item.id} item={item} isCompleted={false} />)
        )}

        {completedHabits.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 25 }]}>Concluídos - {completedHabits.length}</Text>
            {completedHabits.map(item => <HabitCard key={item.id} item={item} isCompleted={true} />)}
          </>
        )}
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
              <Ionicons name="pencil" size={20} color="#333" />
              <Text style={styles.optionText}>Editar Hábito</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.optionButton} onPress={handleDeleteRequest}>
              <Ionicons name="trash-outline" size={20} color="#B00020" />
              <Text style={[styles.optionText, { color: '#B00020' }]}>Excluir Hábito</Text>
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
            <Text style={{ marginBottom: 20, color: '#666', textAlign: 'center' }}>
              Isso apagará "{selectedHabit?.title}" e todo o histórico dele para sempre.
            </Text>

            <View style={styles.modalButtonsRow}>
              <Button mode="outlined" onPress={() => setDeleteConfirmVisible(false)} textColor="#555" style={{ flex: 1, marginRight: 10 }}>
                Cancelar
              </Button>
              <Button mode="contained" onPress={confirmDelete} buttonColor="#B00020" style={{ flex: 1 }}>
                Excluir
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      <AnimatedFAB
        label="Novo Hábito"
        icon={({ size, color }) => <Ionicons name="add" size={size} color={color} />}
        labelStyle={{ fontSize: 14, fontWeight: '600', marginLeft: -8 }}
        extended={isExtended}
        onPress={handleCreateHabit}
        visible={true}
        animateFrom={'right'}
        iconMode={'dynamic'}
        style={fab}
        color="#FFF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  dateHeader: { fontSize: 30, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#7B1FA2', marginBottom: 10, marginTop: 10, textTransform: 'uppercase', letterSpacing: 1 },
  emptyText: { color: '#999', fontStyle: 'italic', marginTop: 10 },

  cardContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingVertical: 15, paddingHorizontal: 15, marginBottom: 12, borderRadius: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 },
  checkboxArea: { marginRight: 15 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
  cardDescription: { fontSize: 12, color: '#888', marginTop: 2 },
  timeContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F0F0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginRight: 10 },
  timeText: { fontSize: 12, color: '#555', marginLeft: 4, fontWeight: '500' },
  menuButton: { padding: 5 },

  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  optionsModalContent: { backgroundColor: '#FFF', padding: 20, borderRadius: 16, width: '70%', elevation: 5 },
  optionButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  optionText: { fontSize: 16, marginLeft: 15, color: '#333', fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 5 },
  confirmModalContent: { backgroundColor: '#FFF', padding: 24, borderRadius: 20, width: '85%', elevation: 5, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  modalButtonsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, width: '100%' }
});