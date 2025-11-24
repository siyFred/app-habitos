import { View, Text, TouchableOpacity} from 'react-native';
import { button_create_task } from '../styles/styles_components.js'

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1}}>
      <Text>Welcome to the Home Screen!</Text>
      <TouchableOpacity style={button_create_task}>
      <Text style={{color: '#FFFFFF'}}>+</Text>
      </TouchableOpacity>
    </View>
  );
}