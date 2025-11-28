import { useCallback, useState } from 'react';
import { View, Text, FlatList, Modal, TouchableOpacity, TextInput} from 'react-native';
import { AnimatedFAB , Button} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { fab } from '../styles/styles_components.js'
import { getAllHabits, updateHabit, deleteHabit} from '../repositories/HabitRepository';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
  const [isExtended, setIsExtended] = useState(true);
  const [habits, setHabits] = useState([])
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editFrequency, setEditFrequency] = useState(''); 
  const [editNotificationTime, setEditNotificationTime] = useState('');
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);

  //Carrega os hábitos quando a tela ganhar foco
  function onScroll({ nativeEvent }) {
    const currentScrollPosition = Math.floor(nativeEvent.contentOffset.y) ?? 0;
    if (currentScrollPosition > 30) {
      setIsExtended(false);
    } 
    else if (currentScrollPosition <= 0) {
      setIsExtended(true);
    }
  }

  function handleCreateHabit() {
    navigation.navigate('NewHabit');
  }

  useFocusEffect(
    useCallback(() => {
      async function loadHabits() {
        const data = await getAllHabits();
        setHabits(Array.isArray(data) ? data : []);
      }
      loadHabits();
    }, [])
  )
  //Função responsável por abrir o modal
  function openHabitDetails(habit) {
    setSelectedHabit(habit);
    setModalVisible(true);
  }

  function openEditModal(habit) {
    setEditTitle(habit.title);
    setEditDescription(habit.description || '');
    setEditFrequency(Array.isArray(habit.frequency) ? habit.frequency.join(', ') : '');
    setEditNotificationTime(habit.notificationTime || '');
    setEditModalVisible(true);
  }

  async function handleSaveEdit() {
    if (!selectedHabit) return;

    const updatedHabit = {
      title: editTitle.trim(),
      description: editDescription.trim(),
      frequency: editFrequency.split(',').map(f => f.trim()).filter(Boolean),
      notificationTime: editNotificationTime.trim()
    };

    try {
      await updateHabit(selectedHabit.id, updatedHabit);
      const data = await getAllHabits();
      setHabits(Array.isArray(data) ? data : []);
      setEditModalVisible(false);
      setSelectedHabit(null);
    } catch (e) {
      console.error('Erro ao atualizar hábito', e);
    }
  }

   async function handleConfirmDelete() {
    if (!selectedHabit) return;
    await deleteHabit(selectedHabit.id);
    const data = await getAllHabits();
    setHabits(Array.isArray(data) ? data : []);
    setConfirmDeleteVisible(false);
    setModalVisible(false);
    setSelectedHabit(null);
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{
      backgroundColor: "#3e2465",
      height: 30,
      width: 400,
      alignItems: "center",
      justifyContent: "center", 
      borderRadius: 5
    }}>
        <Text style={{ color: '#FFFFFF', alignItems: 'center', justifyContent: 'center', flex: 1}}>Meus hábitos</Text>
      </View>

      {/*Função resonsável por mostrar os habitos criados*/}

    <View style={{ flex: 1, padding: 20 }}>
        {habits.length === 0 ? (
          <Text style={{ color: '#999', fontSize: 16 }}>Nenhum hábito criado ainda.</Text>
        ) : (
          <FlatList
            data={habits}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => openHabitDetails(item)}>
                <View style={{
                  backgroundColor: '#EEE',
                  padding: 15,
                  marginBottom: 10,
                  borderRadius: 10
                }}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.title}</Text>
                  {item.description && (
                    <Text style={{ color: '#555' }}>{item.description}</Text>
                  )}
                  <Text style={{ marginTop: 5 }}>
                    Frequência: {item.frequency.join(', ')}
                  </Text>
                  {item.notificationTime && (
                    <Text>Horário: {item.notificationTime}</Text>
                  )}
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
      {/* Modal principal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)'
        }}>
          <View style={{
            backgroundColor: '#FFF',
            padding: 20,
            borderRadius: 12,
            width: '80%'
          }}>
            {selectedHabit && (
              <View>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
                  {selectedHabit.title}
                </Text>
                {selectedHabit.description && (
                  <Text style={{ marginBottom: 10 }}>{selectedHabit.description}</Text>
                )}
                <Text>Frequência: {selectedHabit.frequency.join(', ')}</Text>
                {selectedHabit.notificationTime && (
                  <Text>Horário: {selectedHabit.notificationTime}</Text>
                )}

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                  <Button 
                    mode="outlined" 
                    onPress={() => {setConfirmDeleteVisible(true)}}
                    textColor="#B00020"
                    style={{ flex: 1, marginRight: 10 }}
                  >
                    Excluir
                  </Button>
                  <Button 
                    mode="contained" 
                    onPress={() => {
                      setModalVisible(false);
                      openEditModal(selectedHabit);
                    }}
                    buttonColor="#7B1FA2"
                    textColor="#FFF"
                    style={{ flex: 1 }}
                  >
                    Editar
                  </Button>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
      {/*Modal da função de editar */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)'
          }}>
          <View style={{
            backgroundColor: '#FFF',
            padding: 20,
            borderRadius: 12,
            width: '80%'
          }}>
            <Text>Título:</Text>
            <TextInput
              value={editTitle}
              onChangeText={setEditTitle}
              style={{ borderWidth: 1, borderColor: '#CCC', marginBottom: 10, padding: 8, borderRadius: 6 }}
            />
            <Text>Descrição:</Text>
            <TextInput
              value={editDescription}
              onChangeText={setEditDescription}
              multiline
              style={{ borderWidth: 1, borderColor: '#CCC', marginBottom: 10, padding: 8, borderRadius: 6 }}
            />
            <Text>Frequência:</Text>
            <TextInput
              value={editFrequency}
              onChangeText={setEditFrequency}
              placeholder="Segunda, Quarta, Sexta"
              style={{ borderWidth: 1, borderColor: '#CCC', marginBottom: 10, padding: 8, borderRadius: 6 }}
            />
            <Text>Horário:</Text>
            <TextInput
              value={editNotificationTime}
              onChangeText={setEditNotificationTime}
              placeholder="07:00"
              style={{ borderWidth: 1, borderColor: '#CCC', marginBottom: 10, padding: 8, borderRadius: 6 }}
            />
          </View>
        </View>
      </Modal>
      {/* Modal da função de excluir */}
      <Modal visible={confirmDeleteVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setConfirmDeleteVisible(false)}
      >
        <View
        View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)'
        }}>
          <View style={{
            backgroundColor: '#FFF',
            padding: 20,
            borderRadius: 12,
            width: '80%'
          }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>
              Deseja mesmo excluir esse hábito?
            </Text>
                <View
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button 
                mode="outlined" 
                onPress={() => setConfirmDeleteVisible(false)} 
                textColor="#555"
                style={{ flex: 1, marginRight: 10 }}
              >
                Cancelar
              </Button>
              <Button
                mode="contained" 
                  onPress={handleConfirmDelete} 
                  buttonColor="#B00020"
                  textColor="#FFF"
                  style={{ flex: 1 }}
                >
                  Excluir
                </Button>
              </View>
          </View>
        </View>
      </Modal>

      <AnimatedFAB
        label="Novo Hábito "
        icon={({ size, color }) => (
          <Ionicons name="add" size={size} color={color}/>
        )}
        labelStyle={{
          marginTop: -1, 
          fontSize: 16,
          fontWeight: '600',
        }}
        extended={isExtended} 
        onPress={() => handleCreateHabit()}
        visible={true} 
        animateFrom={'right'}
        iconMode={'dynamic'}
        style={fab}
        color="#FFF"
      />
    </View>
  );
}
