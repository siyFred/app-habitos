import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';

import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <AppRoutes />
      </NavigationContainer>
    </PaperProvider>
  );
}
