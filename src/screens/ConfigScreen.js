import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Pressable } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/themeContext';
import { deleteAllHabits } from '../repositories/HabitRepository';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ConfigScreen() {
  const { theme, setThemeMode, themeMode } = useTheme();
  const [isThemeModalVisible, setThemeModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isNotificationModalVisible, setNotificationModalVisible] = useState(false);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const loadNotificationSettings = async () => {
      try {
        const stored = await AsyncStorage.getItem('@habitos:notification_settings');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (typeof parsed.enabled === 'boolean') {
            setNotificationsEnabled(parsed.enabled);
          }
          if (typeof parsed.soundEnabled === 'boolean') {
            setSoundEnabled(parsed.soundEnabled);
          }
        }
      } catch (e) {
        console.log('Erro ao carregar configurações de notificação', e);
      }
    };

    loadNotificationSettings();
  }, []);

  const saveNotificationSettings = async (settings) => {
    try {
      await AsyncStorage.setItem('@habitos:notification_settings', JSON.stringify(settings));
    } catch (e) {
      console.log('Erro ao salvar configurações de notificação', e);
    }
  };

  const handleDeleteAllData = () => {
    setDeleteModalVisible(true);
  };

  const confirmDeleteData = async () => {
    try {
      await deleteAllHabits();
      Toast.show({ type: 'success', text1: 'Dados apagados com sucesso!' });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Erro ao apagar dados.' });
    } finally {
      setDeleteModalVisible(false);
    }
  };

  const handleSelectTheme = (mode) => {
    setThemeMode(mode);
    setThemeModalVisible(false);
  };

  return (
    <View style={styles(theme).container}>
      <View style={styles(theme).profileBox}>
        <View style={styles(theme).profileRow}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
            style={styles(theme).avatar}
          />
          <View style={{ flex: 1}}>
            <Text style={styles(theme).profileName}>Gabriela <Text style={{fontSize:18}}>👋</Text></Text>
          </View>
          <TouchableOpacity style={styles(theme).iconButton} onPress={() => setNotificationModalVisible(true)}>
            <Ionicons name="notifications-outline" size={24} color={theme.text_secondary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles(theme).optionsBox}>
        <OptionItem 
          icon={<Ionicons name="moon" size={28} color={theme.primary} />} 
          title="Tema" 
          subtitle={themeMode === 'system' ? 'Padrão do Sistema' : (themeMode === 'dark' ? 'Escuro' : 'Claro')} 
          onPress={() => setThemeModalVisible(true)}
          theme={theme}
        />
        <OptionItem 
          icon={<Ionicons name="trash" size={28} color= {theme.primary} />} 
          title="Apagar Dados" 
          onPress={handleDeleteAllData} 
          theme={theme} 
        />
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isThemeModalVisible}
        onRequestClose={() => setThemeModalVisible(false)}
      >
        <Pressable style={styles(theme).modalBackdrop} onPress={() => setThemeModalVisible(false)}>
          <View style={styles(theme).modalContent}>
            <Text style={styles(theme).modalTitle}>Escolha um tema</Text>
            
            <TouchableOpacity 
              style={[
                styles(theme).themeOption, 
                themeMode === 'light' && { backgroundColor: theme.divider }
              ]} 
              onPress={() => handleSelectTheme('light')}
            >
              <Ionicons 
                name="sunny-outline" 
                size={22} 
                color={themeMode === 'light' ? theme.primary : theme.text_secondary} 
                style={styles(theme).themeOptionIcon} 
              />
              <Text style={[
                styles(theme).themeOptionText,
                themeMode === 'light' && { color: theme.primary, fontWeight: 'bold' }
              ]}>
                Claro
              </Text>
              {themeMode === 'light' && <Ionicons name="checkmark" size={20} color={theme.primary} style={{marginLeft: 'auto'}}/>}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles(theme).themeOption, 
                themeMode === 'dark' && { backgroundColor: theme.divider }
              ]} 
              onPress={() => handleSelectTheme('dark')}
            >
              <Ionicons 
                name="moon-outline" 
                size={22} 
                color={themeMode === 'dark' ? theme.primary : theme.text_secondary} 
                style={styles(theme).themeOptionIcon} 
              />
              <Text style={[
                styles(theme).themeOptionText,
                themeMode === 'dark' && { color: theme.primary, fontWeight: 'bold' }
              ]}>
                Escuro
              </Text>
              {themeMode === 'dark' && <Ionicons name="checkmark" size={20} color={theme.primary} style={{marginLeft: 'auto'}}/>}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles(theme).themeOption, 
                themeMode === 'system' && { backgroundColor: theme.divider }
              ]} 
              onPress={() => handleSelectTheme('system')}
            >
              <Ionicons 
                name="cog-outline" 
                size={22} 
                color={themeMode === 'system' ? theme.primary : theme.text_secondary} 
                style={styles(theme).themeOptionIcon} 
              />
              <Text style={[
                styles(theme).themeOptionText,
                themeMode === 'system' && { color: theme.primary, fontWeight: 'bold' }
              ]}>
                Padrão do Sistema
              </Text>
              {themeMode === 'system' && <Ionicons name="checkmark" size={20} color={theme.primary} style={{marginLeft: 'auto'}}/>}
            </TouchableOpacity>

            <TouchableOpacity style={styles(theme).closeButton} onPress={() => setThemeModalVisible(false)}>
                <Text style={styles(theme).closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isDeleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <Pressable style={styles(theme).modalBackdrop} onPress={() => setDeleteModalVisible(false)}>
          <View style={styles(theme).modalContent}>
            <Ionicons name="warning-outline" size={48} color={theme.danger} style={{ marginBottom: 15 }} />
            <Text style={styles(theme).modalTitle}>Apagar Todos os Dados</Text>
            <Text style={styles(theme).modalDescription}>
              Você tem certeza? Esta ação não pode ser desfeita e todos os seus hábitos serão perdidos para sempre.
            </Text>

            <View style={styles(theme).modalButtonsRow}>
              <TouchableOpacity 
                style={[styles(theme).actionButton, { backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.divider }]} 
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={[styles(theme).actionButtonText, { color: theme.text_primary }]}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles(theme).actionButton, { backgroundColor: theme.danger }]} 
                onPress={confirmDeleteData}
              >
                <Text style={[styles(theme).actionButtonText, { color: '#FFF' }]}>Apagar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isNotificationModalVisible}
        onRequestClose={() => setNotificationModalVisible(false)}
      >
        <Pressable style={styles(theme).modalBackdrop} onPress={() => setNotificationModalVisible(false)}>
          <View style={styles(theme).modalContent}>
            <Text style={styles(theme).modalTitle}>Notificações</Text>

            <TouchableOpacity
              style={[
                styles(theme).themeOption,
                notificationsEnabled && { backgroundColor: theme.divider }
              ]}
              onPress={async () => {
                const next = !notificationsEnabled;
                setNotificationsEnabled(next);
                await saveNotificationSettings({ enabled: next, soundEnabled });
              }}
            >
              <Ionicons
                name={notificationsEnabled ? 'notifications' : 'notifications-off-outline'}
                size={22}
                color={notificationsEnabled ? theme.primary : theme.text_secondary}
                style={styles(theme).themeOptionIcon}
              />
              <Text
                style={[
                  styles(theme).themeOptionText,
                  notificationsEnabled && { color: theme.primary, fontWeight: 'bold' },
                ]}
              >
                {notificationsEnabled ? 'Notificações ativadas' : 'Notificações desativadas'}
              </Text>
              {notificationsEnabled && (
                <Ionicons
                  name="checkmark"
                  size={20}
                  color={theme.primary}
                  style={{ marginLeft: 'auto' }}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles(theme).themeOption,
                soundEnabled && { backgroundColor: theme.divider }
              ]}
              onPress={async () => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                await saveNotificationSettings({ enabled: notificationsEnabled, soundEnabled: next });
              }}
            >
              <Ionicons
                name={soundEnabled ? 'volume-high-outline' : 'volume-mute-outline'}
                size={22}
                color={soundEnabled ? theme.primary : theme.text_secondary}
                style={styles(theme).themeOptionIcon}
              />
              <Text
                style={[
                  styles(theme).themeOptionText,
                  soundEnabled && { color: theme.primary, fontWeight: 'bold' },
                ]}
              >
                {soundEnabled ? 'Som ativado' : 'Som desativado'}
              </Text>
              {soundEnabled && (
                <Ionicons
                  name="checkmark"
                  size={20}
                  color={theme.primary}
                  style={{ marginLeft: 'auto' }}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles(theme).closeButton}
              onPress={() => setNotificationModalVisible(false)}
            >
              <Text style={styles(theme).closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <TouchableOpacity style={styles(theme).logoutButton}>
        <Ionicons name="arrow-back-outline" size={20} color={theme.text_primary} style={{ marginRight: 8 }} />
        <Text style={styles(theme).logoutText}>Sair do aplicativo</Text>
      </TouchableOpacity>
    </View>
  );
}

function OptionItem({ icon, title, subtitle, onPress, theme }) {
  return (
    <TouchableOpacity style={styles(theme).optionItem} onPress={onPress}>
      <View style={styles(theme).optionIcon}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles(theme).optionTitle}>{title}</Text>
        {subtitle && <Text style={styles(theme).optionSubtitle}>{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={26} color={theme.text_tertiary} />
    </TouchableOpacity>
  );
}

const styles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    padding: 20,
  },
  profileBox: {
    backgroundColor: theme.surface,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderColor: theme.divider,
    borderRadius:10,
    marginBottom: 8,
    shadowColor: theme.black || '#000',
    elevation: 2,
    
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 16,
  },
  profileName: {
    fontSize: 19,
    fontWeight: 'bold',
    color: theme.text_primary,
    marginBottom: 2,
  },
  profileInfo: {
    fontSize: 13,
    color: theme.text_secondary,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
  optionsBox: {
    marginTop: 10,
    marginBottom: 18,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 24,
    marginBottom: 16,
    shadowColor: theme.black || '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 70,
  },
  optionIcon: {
    marginRight: 22,
    alignItems: 'center',
    justifyContent: 'center',
    width: 38,
  },
  optionTitle: {
    fontSize: 18,
    color: theme.text_primary,
    fontWeight: '600',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 15,
    color: theme.text_secondary,
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: theme.divider,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginTop: 18,
    marginBottom: 18,
  },
  logoutText: {
    color: theme.text_primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.overlay || 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: theme.surface,
    padding: 20,
    borderRadius: 15,
    width: '80%',
    alignItems: 'center',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: theme.text_primary,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    color: theme.text_secondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  themeOption: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.divider,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
  },
  themeOptionIcon: {
    marginRight: 15,
  },
  themeOptionText: {
    textAlign: 'center',
    fontSize: 16,
    color: theme.text_primary,
  },
  closeButton: {
      marginTop: 20,
      paddingVertical: 10,
      paddingHorizontal: 30,
      borderRadius: 20,
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.divider
  },
  closeButtonText: {
      color: theme.text_primary,
      fontWeight: '600',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  }
});