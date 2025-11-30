import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme as usePaperTheme } from 'react-native-paper';

import HomeScreen from '../screens/Home';
import StatsScreen from '../screens/StatusScreen';
import NewHabitScreen from '../screens/NewHabit';
import ConfigScreen from '../screens/ConfigScreen';

import { useTheme } from '../context/themeContext';

const Tab = createMaterialBottomTabNavigator();

const Stack = createStackNavigator();

function TabRoutes() {
  const { theme, themeType } = useTheme();
  const paperTheme = usePaperTheme();

  return (
    <Tab.Navigator
        initialRouteName="Meus Hábitos"
        activeColor={themeType === 'dark' ? theme.primary : paperTheme.colors.primary}
        inactiveColor={themeType === 'dark' ? theme.text_on_primary : theme.neutral}
        shifting={true}
        barStyle={{ backgroundColor: theme.surface }}
        theme={paperTheme}
        activeIndicatorStyle={
          themeType === 'dark'
            ? { backgroundColor: theme.activeIndicatorStyle }
            : undefined
        }
    >
      <Tab.Screen
        name="Meus Hábitos"
        component={HomeScreen}
        options={{
            tabBarLabel: 'Hábitos',
            tabBarIcon: ({ color, focused }) => {
              const iconColor = themeType === 'dark'
                ? (focused ? theme.primary : theme.text_on_primary)
                : color;
              return (
                <Ionicons
                  name={focused ? "checkbox" : "checkbox-outline"}
                  size={26}
                  color={iconColor}
                  style={{ marginTop: -1 }}
                />
              );
            },
        }}
      />
      <Tab.Screen 
        name="Estatísticas" 
        component={StatsScreen}
        options={{
            tabBarLabel: 'Estatísticas',
            tabBarIcon: ({ color, focused }) => {
              const iconColor = themeType === 'dark'
                ? (focused ? theme.primary : theme.text_on_primary)
                : color;
              return (
                <Ionicons
                  name={focused ? "stats-chart" : "stats-chart-outline"}
                  size={26}
                  color={iconColor}
                  style={{ marginTop: -1 }}
                />
              );
            },
        }}
      />
      <Tab.Screen 
        name="Configurações" 
        component={ConfigScreen}
        options={{
            tabBarLabel: 'Configurações',
            tabBarIcon: ({ color, focused }) => {
              const iconColor = themeType === 'dark'
                ? (focused ? theme.primary : theme.text_on_primary)
                : color;
              return (
                <Ionicons
                  name={focused ? "cog" : "cog"}
                  size={26}
                  color={iconColor}
                  style={{ marginTop: -1 }}
                />
              );
            },
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppRoutes() {
  const { theme } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top', 'left', 'right']}>
      <Stack.Navigator screenOptions={{ headerShown: false, ...TransitionPresets.FadeFromBottomAndroid}}>
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