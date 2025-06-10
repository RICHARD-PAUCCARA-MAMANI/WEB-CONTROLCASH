import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  Alert, 
  TouchableOpacity, 
  KeyboardAvoidingView,
  Platform,
  SafeAreaView
} from 'react-native';
import { login } from '../api/auth';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Ingresa correo y contraseña');
      return;
    }

    try {
      setIsLoading(true);
      const token = await login(email, password);
      console.log('TOKEN:', token); // puedes guardarlo en AsyncStorage si deseas

      Alert.alert('Bienvenido', 'Inicio de sesión exitoso');
      navigation.navigate('Dashboard'); // Asumiendo que tu pantalla se llama Dashboard

    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Credenciales inválidas o error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.appName}>CONTROLCASH</Text>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Correo electrónico</Text>
            <TextInput 
              style={styles.input} 
              placeholder="nombre@ejemplo.com" 
              value={email} 
              onChangeText={setEmail} 
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Contraseña</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Ingresa tu contraseña" 
              secureTextEntry 
              value={password} 
              onChangeText={setPassword}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.forgotPasswordContainer} 
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Cargando...' : 'Iniciar sesión'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>¿No tienes una cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupLink}>Regístrate</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#ffffff',
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4a6da7',
    letterSpacing: 1.5,
  },
  formContainer: {
    paddingHorizontal: 30,
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: { 
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    fontSize: 16,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 30,
  },
  forgotPassword: {
    color: '#666',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#4a6da7',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  signupText: {
    fontSize: 14,
    color: '#666',
  },
  signupLink: {
    fontSize: 14,
    color: '#4a6da7',
    fontWeight: '600',
  },
});