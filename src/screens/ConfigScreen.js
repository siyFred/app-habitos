import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Pressable } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { colors_white } from '../styles/theme';

export default function ConfigScreen() {
  const [isThemeModalVisible, setThemeModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.profileBox}>
        <View style={styles.profileRow}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
            style={styles.avatar}
          />
          <View style={{ flex: 1}}>
            <Text style={styles.profileName}>Gabriela <Text style={{fontSize:18}}>👋</Text></Text>
          </View>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color="#555" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.optionsBox}>
        <OptionItem 
          icon={<Ionicons name="moon" size={28} color={colors_white.primary} />} 
          title="Tema" 
          subtitle="Claro e Escuro" 
          onPress={() => setThemeModalVisible(true)}
        />
        <OptionItem icon={<Ionicons name="trash" size={28} color="#96d7eb" />} title="Apagar Dados" />
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isThemeModalVisible}
        onRequestClose={() => setThemeModalVisible(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setThemeModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Escolha um tema</Text>
            
            <TouchableOpacity style={styles.themeOption}>
              <Ionicons name="sunny-outline" size={22} color="#555" style={styles.themeOptionIcon} />
              <Text style={styles.themeOptionText}>Claro</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.themeOption}>
              <Ionicons name="moon-outline" size={22} color="#555" style={styles.themeOptionIcon} />
              <Text style={styles.themeOptionText}>Escuro</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.themeOption}>
              <Ionicons name="cog-outline" size={22} color="#555" style={styles.themeOptionIcon} />
              <Text style={styles.themeOptionText}>Padrão do Sistema</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={() => setThemeModalVisible(false)}>
                <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <TouchableOpacity style={styles.logoutButton}>
        <Ionicons name="arrow-back-outline" size={20} color="#222" style={{ marginRight: 8 }} />
        <Text style={styles.logoutText}>Sair do aplicativo</Text>
      </TouchableOpacity>
    </View>
  );
}

function OptionItem({ icon, title, subtitle, onPress }) {
  return (
    <TouchableOpacity style={styles.optionItem} onPress={onPress}>
      <View style={styles.optionIcon}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.optionTitle}>{title}</Text>
        {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={26} color="#bbb" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 20,
  },
  profileBox: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderColor: '#eee',
    borderRadius:10,
    marginBottom: 8,
    shadowColor: '#000',
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
    color: '#222',
    marginBottom: 2,
  },
  profileInfo: {
    fontSize: 13,
    color: '#666',
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
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 24,
    marginBottom: 16,
    shadowColor: '#000',
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
    color: '#222',
    fontWeight: '600',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 15,
    color: '#888',
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: '#ededed',
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
    color: '#222',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    width: '80%',
    alignItems: 'center',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  themeOption: {
    width: '100%',
    paddingVertical: 15 ,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeOptionIcon: {
    marginRight: 15,
  },
  themeOptionText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#000',
  },
  closeButton: {
      marginTop: 20,
      paddingVertical: 10,
      paddingHorizontal: 30,
      borderRadius: 20,
      backgroundColor: '#f1f1f1',
  },
  closeButtonText: {
      color: '#555',
      fontWeight: '600',
  }
});
