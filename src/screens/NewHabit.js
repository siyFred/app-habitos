import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity,ScrollView } from 'react-native'; 
import { Ionicons } from '@expo/vector-icons';

import { label, input, cancelButton, cancelButtonText, saveButton, saveButtonText } from '../styles/styles_components';

export default function NewHabitScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState([]);

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
      notificationTime: null
    };

    // navigation.navigate('MainTabs', {
    //   screen: 'Meus Hábitos',
    //   params: { newHabit } 
    // });
  }

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
      {/* <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity> */}

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