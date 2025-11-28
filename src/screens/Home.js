import { useCallback, useState } from 'react';
import { View, Text, FlatList, Modal, TouchableOpacity} from 'react-native';
import { AnimatedFAB , Button} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { fab } from '../styles/styles_components.js'
import { getAllHabits } from '../repositories/HabitRepository';
import { useFocusEffect } from '@react-navigation/native';


export default function HomeScreen({ navigation }) {
  const [isExtended, setIsExtended] = useState(true);
  const [habits, setHabits] = useState([])
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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

  //Carrega os hábitos quando a tela ganhar foco
  function onScroll({ nativeEvent }) {
    const currentScrollPosition = Math.floor(nativeEvent.contentOffset.y) ?? 0;
    if (currentScrollPosition > 30) {
      setIsExtended(false);
    } else if (currentScrollPosition <= 0) {
      setIsExtended(true)
    }
    function handleCreateHabit() {
      navigation.navigate('NewHabit')
    }

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
              <>
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
                    onPress={() => {}}
                    textColor="#B00020"
                    style={{ flex: 1, marginRight: 10 }}
                  >
                    Excluir
                  </Button>
                  <Button 
                    mode="contained" 
                    onPress={() => {}}
                    buttonColor="#7B1FA2"
                    textColor="#FFF"
                    style={{ flex: 1 }}
                  >
                    Editar
                  </Button>
                </View>
              </>
            )}
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
