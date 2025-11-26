import { useState } from 'react';
import { View, Text } from 'react-native';
import { AnimatedFAB } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { fab } from '../styles/styles_components.js'

export default function HomeScreen({ navigation }) {
  const [isExtended, setIsExtended] = useState(true);

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

  return (
    <View style={{ flex: 1 }}>
      <Text>Welcome to the Home Screen!</Text>
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