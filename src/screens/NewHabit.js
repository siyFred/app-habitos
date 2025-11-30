import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';

import { createAndSaveHabit, updateHabit } from '../repositories/HabitRepository';
import { useTheme } from '../context/themeContext';

const WEEK_DAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export default function NewHabitScreen({ navigation, route }) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  
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
    <View style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>{isEditing ? 'Editar Hábito' : 'Novo Hábito'}</Text>
            <Text style={styles.headerSubtitle}>
              {isEditing ? 'Ajuste seus objetivos e continue evoluindo.' : 'Comece pequeno, sonhe grande.'}
            </Text>
          </View>

          <Text style={styles.label}>O QUE VOCÊ QUER FAZER?</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="sparkles-outline" size={20} color={theme.primary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Ex: Ler 10 páginas, Beber água..."
              placeholderTextColor={theme.text_tertiary}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <Text style={styles.label}>DETALHES (OPCIONAL)</Text>
          <View style={[styles.inputContainer, { alignItems: 'flex-start', paddingVertical: 6 }]}>
            <Ionicons name="document-text-outline" size={20} color={theme.text_secondary} style={[styles.inputIcon, { marginTop: 10 }]} />
            <TextInput
              style={[styles.input, { minHeight: 60, textAlignVertical: 'top' }]}
              placeholder="Adicione uma motivação ou detalhes..."
              placeholderTextColor={theme.text_tertiary}
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </View>

          <Text style={styles.label}>QUANDO?</Text>
          <View style={styles.frequencyContainer}>
            {WEEK_DAYS.map((day, index) => {
              const isSelected = frequency.includes(index);
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.dayButton, isSelected && styles.dayButtonSelected]}
                  onPress={() => toggleDay(index)}
                >
                  <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>{day}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.label}>LEMBRETE (OPCIONAL)</Text>
          <TouchableOpacity
            style={styles.timeCard}
            onPress={() => setShowPicker(true)}
            activeOpacity={0.7}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={[styles.iconBox, { backgroundColor: notificationDate ? theme.primary + '20' : theme.surface }]}>
                <Ionicons name={notificationDate ? "alarm" : "alarm-outline"} size={24} color={notificationDate ? theme.primary : theme.text_tertiary} />
              </View>
              <View style={{ marginLeft: 15 }}>
                <Text style={styles.timeCardTitle}>Horário da notificação</Text>
                <Text style={styles.timeCardValue}>
                  {notificationDate ? formatTime(notificationDate) : "Sem horário definido"}
                </Text>
              </View>
            </View>
            
            {notificationDate ? (
              <TouchableOpacity onPress={() => setNotificationDate(null)} style={{ padding: 5 }}>
                <Ionicons name="close" size={20} color={theme.text_tertiary} />
              </TouchableOpacity>
            ) : (
              <Ionicons name="chevron-forward" size={20} color={theme.text_tertiary} />
            )}
          </TouchableOpacity>

          {showPicker && (
            <View style={styles.pickerContainer}>
              <DateTimePicker
                value={notificationDate || new Date()}
                mode="time"
                is24Hour={true}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleTimeChange}
                style={{ width: Platform.OS === 'ios' ? 320 : '100%' }}
                textColor={theme.text_primary}
              />
              {Platform.OS === 'ios' && (
                <TouchableOpacity onPress={() => setShowPicker(false)} style={styles.iosPickerDone}>
                  <Text style={{ color: theme.primary, fontWeight: '600', fontSize: 16 }}>Pronto</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <Button
          mode="text"
          onPress={() => navigation.goBack()}
          textColor={theme.text_secondary}
          style={{ flex: 1, marginRight: 8 }}
          labelStyle={{ fontSize: 16, fontWeight: '600' }}
        >
          Cancelar
        </Button>
        <Button
          mode="contained"
          onPress={handleSave}
          buttonColor={theme.primary}
          textColor={theme.text_on_primary}
          style={styles.saveButton}
          labelStyle={{ fontSize: 16, fontWeight: 'bold', paddingVertical: 4 }}
        >
          {isEditing ? 'Salvar Alterações' : 'Criar Hábito'}
        </Button>
      </View>
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  headerContainer: {
    marginBottom: 32,
    marginTop: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.text_primary,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: theme.text_secondary,
    lineHeight: 22,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.text_secondary,
    marginBottom: 10,
    marginTop: 5,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56, // Altura fixa para input de linha única
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.border,
    // Sombra suave
    shadowColor: theme.black || '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.text_primary,
    height: '100%',
  },
  frequencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dayButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
    elevation: 1,
  },
  dayButtonSelected: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
    elevation: 4,
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  dayText: {
    fontSize: 14,
    color: theme.text_secondary,
    fontWeight: '600',
  },
  dayTextSelected: {
    color: theme.text_on_primary,
    fontWeight: 'bold',
  },
  timeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.border,
    shadowColor: theme.black || '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeCardTitle: {
    fontSize: 14,
    color: theme.text_secondary,
    marginBottom: 2,
  },
  timeCardValue: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text_primary,
  },
  pickerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 15,
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 10,
  },
  iosPickerDone: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: theme.background,
    borderRadius: 20,
  },
  footer: {
    padding: 20,
    backgroundColor: theme.background,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.divider,
  },
  saveButton: {
    flex: 2,
    borderRadius: 14,
    elevation: 4,
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  }
});