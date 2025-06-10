import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import DashboardScreen from './screens/DashboardScreen';
import RegistrarGastoScreen from './screens/RegistrarGastoScreen';
import CategoriasScreen from './screens/CategoriasScreen';
import ExportarScreen from './screens/ExportarScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="RegistrarGasto" component={RegistrarGastoScreen} />
        <Stack.Screen name="Categorias" component={CategoriasScreen} />
        <Stack.Screen name="Exportar" component={ExportarScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
