import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';

import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

import AppRoutes from './routes/AppRoutes';
import { colors_white } from './styles/theme';

const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: colors_white.primary,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
      }}
      text2Style={{
        fontSize: 13,
        fontWeight: '400',
      }}
    />
  )
};

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <AppRoutes />
        <Toast config={toastConfig} />
      </NavigationContainer>
    </PaperProvider>
  );
}
