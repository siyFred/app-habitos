import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native'; 
import { Ionicons } from '@expo/vector-icons';

export default function NewHabitScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState([]);

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
    </View>
  )
}