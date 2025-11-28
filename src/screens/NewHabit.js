import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';

import { dayButton, dayButtonSelected, dayText, dayTextSelected, label, input } from '../styles/styles_components';
import { createAndSaveHabit, updateHabit } from '../repositories/HabitRepository';

const WEEK_DAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export default function NewHabitScreen({ navigation, route }) {
  // verifica se é edição
  const habitToEdit = route.params?.habitToEdit;
  const isEditing = !!habitToEdit;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState([]);
  const [notificationDate, setNotificationDate] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (isEditing) {
      setTitle(habitToEdit.title);
      setDescription(habitToEdit.description || '');
      setFrequency(habitToEdit.frequency || []);

      if (habitToEdit.notificationTime) {
        const [hours, minutes] = habitToEdit.notificationTime.split(':').map(Number);
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);
        setNotificationDate(date);
      }
    }
  }, [habitToEdit]);

  function toggleDay(dayIndex) {
    if (frequency.includes(dayIndex)) {
      setFrequency(prevState => prevState.filter(day => day !== dayIndex));
    } else {
      setFrequency(prevState => [...prevState, dayIndex]);
    }
  }

  const handleTimeChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
      if (selectedDate) setNotificationDate(selectedDate);
    } else {
      if (selectedDate) setNotificationDate(selectedDate);
    }
  };

  function formatTime(date) {
    if (!date) return null;
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  async function handleSave() {
    if (!title.trim()) {
      return Toast.show({ type: 'error', text1: 'Erro:', text2: 'O nome do hábito é obrigatório.' });
    }
    if (frequency.length === 0) {
      return Toast.show({ type: 'error', text1: 'Erro:', text2: 'Selecione a frequência.' });
    }

    try {
      const habitData = {
        title,
        description: description || null,
        frequency,
        notificationTime: formatTime(notificationDate)
      };

      if (isEditing) {
        await updateHabit(habitToEdit.id, habitData);
        Toast.show({ type: 'success', text1: 'Hábito atualizado!' });
      } else {
        await createAndSaveHabit(habitData);
        Toast.show({ type: 'success', text1: 'Hábito criado!' });
      }

      navigation.goBack();
    } catch (error) {
      console.log(error);
      Toast.show({ type: 'error', text1: 'Erro ao salvar.' });
    }
  }

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' }}>
          {isEditing ? 'Editar Hábito' : 'Novo Hábito'}
        </Text>

        <Text style={label}>Nome</Text>
        <TextInput
          style={input}
          placeholder="Ex: Beber Água"
          placeholderTextColor="#999"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={label}>Descrição (Opcional)</Text>
        <TextInput
          style={input}
          placeholder="Detalhes..."
          placeholderTextColor="#999"
          value={description}
          onChangeText={setDescription}
        />

        <Text style={label}>Horário (Opcional)</Text>
        <TouchableOpacity
          style={[input, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}
          onPress={() => setShowPicker(true)}
        >
          <Text style={{ color: notificationDate ? '#333' : '#999', fontSize: 16 }}>
            {notificationDate ? formatTime(notificationDate) : "Sem horário definido"}
          </Text>
          {notificationDate ? (
            <TouchableOpacity onPress={() => setNotificationDate(null)}>
              <Ionicons name="close-circle" size={24} color="#999" />
            </TouchableOpacity>
          ) : (
            <Ionicons name="time-outline" size={24} color="#999" />
          )}
        </TouchableOpacity>

        {showPicker && (
          <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: 10 }}>
            <DateTimePicker
              value={notificationDate || new Date()}
              mode="time"
              is24Hour={true}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleTimeChange}
              style={{ width: Platform.OS === 'ios' ? 320 : '100%' }}
            />
            {Platform.OS === 'ios' && (
              <TouchableOpacity onPress={() => setShowPicker(false)} style={{ marginTop: 8 }}>
                <Text style={{ color: '#7B1FA2', fontWeight: '600' }}>Concluído</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <Text style={label}>Selecione a frequência</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
          {WEEK_DAYS.map((day, index) => {
            const isSelected = frequency.includes(index);
            return (
              <TouchableOpacity
                key={index}
                style={[dayButton, isSelected && dayButtonSelected]}
                onPress={() => toggleDay(index)}
              >
                <Text style={[dayText, isSelected && dayTextSelected]}>{day}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, gap: 15 }}>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          textColor="#666"
          style={{ flex: 1, borderColor: '#DDD', borderRadius: 12 }}
          contentStyle={{ height: 50 }}
        >
          Cancelar
        </Button>
        <Button
          mode="contained"
          onPress={handleSave}
          buttonColor="#7B1FA2"
          textColor="#FFF"
          style={{ flex: 1, borderRadius: 12 }}
          contentStyle={{ height: 50 }}
        >
          {isEditing ? 'Atualizar' : 'Salvar'}
        </Button>
      </View>
    </View>
  );
}