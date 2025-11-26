import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity,ScrollView } from 'react-native'; 
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

import { dayButton, dayButtonSelected, dayText, dayTextSelected, label, input, cancelButton, cancelButtonText, saveButton, saveButtonText } from '../styles/styles_components';

const WEEK_DAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export default function NewHabitScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState([]);
  const [notificationDate, setNotificationDate] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  function toggleDay(dayIndex) {
    if (frequency.includes(dayIndex)) {
      setFrequency(prevState => prevState.filter(day => day !== dayIndex));
    } else {
      setFrequency(prevState => [...prevState, dayIndex]);
    }
  }

  const handleTimeChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      setNotificationDate(selectedDate);
    }
  };

  function formatTime(date) {
    if (!date) return null;
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  function handleSave() {
    if (!title.trim()) {
      return Alert.alert('Ops', 'Dê um nome para o seu hábito!');
    }
    if (frequency.length === 0) {
      return Alert.alert('Calma lá', 'Selecione pelo menos um dia da semana.');
    }

    const newHabit = {
      id: Date.now().toString(), // ID único temporário
      title,
      description: description || null,
      frequency,
      completedDates: [],
      notificationTime: formatTime(notificationDate) || null,
    };

    navigation.navigate('MainTabs', {
      screen: 'Meus Hábitos',
      params: { newHabit } 
    });
  }

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={label}>Nome</Text>
        <TextInput
          style={input}
          placeholder="Ex: Beber Água, Ler, Correr..."
          placeholderTextColor="#999"
          value={title}
          onChangeText={setTitle}
          autoFocus={false} 
        />
        <Text style={label}>Descrição (Opcional)</Text>
        <TextInput
          style={input}
          placeholder="Ex: Beber 2L de água antes das 18h"
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
            <TouchableOpacity onPress={(e) => {
              e.stopPropagation();
              setNotificationDate(null);
            }}>
              <Ionicons name="close-circle" size={24} color="#999" />
            </TouchableOpacity>
          ) : (
            <Ionicons name="time-outline" size={24} color="#999" />
          )}
        </TouchableOpacity>
        {showPicker && (
          <DateTimePicker
            value={notificationDate || new Date()}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={handleTimeChange}
          />
        )}
        <Text style={label}>Selecione a frequência</Text>
        <View flexDirection="row" justifyContent="space-between" marginTop={5}>
          {WEEK_DAYS.map((day, index) => {
            const isSelected = frequency.includes(index);
            return (
              <TouchableOpacity
                key={index}
                style={[
                  dayButton,
                  isSelected && dayButtonSelected
                ]}
                onPress={() => toggleDay(index)}
              >
                <Text style={[
                  dayText,
                  isSelected && dayTextSelected
                ]}>
                  {day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <View flexDirection="row" justifyContent="space-between" widtgh="100%" marginTop={20} marginBottom={5}>
        <TouchableOpacity style={cancelButton} onPress={() => navigation.goBack()}>
        <Text style={cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={saveButton} onPress={handleSave}>
          <Text style={saveButtonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}