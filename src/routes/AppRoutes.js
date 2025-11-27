import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
<<<<<<<<< Temporary merge branch 1
// TODO: trocar para createMaterialBottomTabNavigator e seguir o padrao do google material
=========
import { createNativeStackNavigator } from '@react-navigation/native-stack';
>>>>>>>>> Temporary merge branch 2
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import HomeScreen from '../screens/Home';
import StatsScreen from '../screens/StatusScreen';
import NewHabitScreen from '../screens/NewHabit';
import ConfigScreen from '../screens/ConfigScreen';

import { colors_white } from '../styles/theme';

const Tab = createMaterialBottomTabNavigator();
<<<<<<<<< Temporary merge branch 1
=========
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
              <Ionicons name={focused ? "checkbox" : "checkbox-outline"} size={26} color={color} style={{ marginTop: -1 }} />
            ),
        }}
      />
      <Tab.Screen 
        name="Estatísticas" 
        component={StatsScreen}
        options={{
            tabBarLabel: 'Estatísticas',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "stats-chart" : "stats-chart-outline"} size={26} color={color} style={{ marginTop: -1 }} />
            ),
        }}
      />
      <Tab.Screen 
        name="Configurações" 
        component={ConfigScreen}
        options={{
            tabBarLabel: 'Configurações',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "cog" : "cog"} size={26} color={color} style={{ marginTop: -1 }} />
            ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppRoutes() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f2f2f2' }} edges={['top', 'left', 'right']}>
<<<<<<<<< Temporary merge branch 1
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
=========
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={TabRoutes} />
        <Stack.Screen 
          name="NewHabit" 
          component={NewHabitScreen} 
          options={{
            ...TransitionPresets.ModalSlideFromBottomIOS,
            presentation: 'transparentModal',
            cardOverlayEnabled: true,
            cardStyle: { backgroundColor: 'transparent' },
          }}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
}