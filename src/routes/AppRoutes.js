import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import HomeScreen from '../screens/Home';
import StatsScreen from '../screens/Stats';
import NewHabitScreen from '../screens/NewHabit';

import { colors_white } from '../styles/theme';

const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabRoutes() {
  return (
    <Tab.Navigator
        initialRouteName="Meus Hábitos"
        activeColor={colors_white.primary}
        inactiveColor={colors_white.neutral}
        shifting={true}
        barStyle={{ backgroundColor: '#fff' }}
    >
      <Tab.Screen
        name="Meus Hábitos"
        component={HomeScreen}
        options={{
            tabBarLabel: 'Hábitos',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "checkbox" : "checkbox-outline"} size={26} color={color} style={{ marginTop: -5 }} />
            ),
        }}
      />
      <Tab.Screen 
        name="Estatísticas" 
        component={StatsScreen}
        options={{
            tabBarLabel: 'Estatísticas',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "stats-chart" : "stats-chart-outline"} size={26} color={color} style={{ marginTop: -5 }} />
            ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppRoutes() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f2f2f2' }} edges={['top', 'left', 'right']}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={TabRoutes} />
        <Stack.Screen 
          name="NewHabit" 
          component={NewHabitScreen} 
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom'
          }}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
}