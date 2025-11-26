import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
// TODO: trocar para createMaterialBottomTabNavigator e seguir o padrao do google material
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import HomeScreen from '../screens/Home';
import StatsScreen from '../screens/Stats';

import { colors_white } from '../styles/theme';

const Tab = createMaterialBottomTabNavigator();

export default function AppRoutes() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f2f2f2' }} edges={['top', 'left', 'right']}>
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
            tabBarIcon: ({ color, focused }) => ( // padrao google para material design
              <Ionicons 
                name={focused ? "checkbox" : "checkbox-outline"} 
                size={26} 
                color={color}
                style={{ marginTop: -1 }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Estatísticas"
          component={StatsScreen}
          options={{
            tabBarLabel: 'Estatísticas',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons 
                name={focused ? "stats-chart" : "stats-chart-outline"} 
                size={26} 
                color={color}
                style={{ marginTop: -1 }}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}