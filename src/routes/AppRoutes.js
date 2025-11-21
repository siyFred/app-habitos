import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import HomeScreen from '../screens/Home';
import StatsScreen from '../screens/Stats';

const Tab = createBottomTabNavigator();

export default function AppRoutes() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f2f2f2' }} edges={['top', 'left', 'right']}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#7B1FA2',
          tabBarInactiveTintColor: 'gray',
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Meus Hábitos') {
              iconName = focused ? 'checkbox' : 'checkbox-outline';
            } else if (route.name === 'Estatísticas') {
              iconName = focused ? 'stats-chart' : 'stats-chart-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name="Meus Hábitos"
          component={HomeScreen}
        />
        <Tab.Screen
          name="Estatísticas"
          component={StatsScreen}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}