import { View, Text, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { button_create_habit } from '../styles/styles_components.js'

export default function HomeScreen({ navigation }) {

  function handleCreateHabit() {
    
  }

  return (
    <View style={{ flex: 1}}>
      <Text>Welcome to the Home Screen!</Text>
      <TouchableOpacity
        style={button_create_habit}
        onPress={handleCreateHabit}
      >
      <Ionicons name="add" size={30} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}