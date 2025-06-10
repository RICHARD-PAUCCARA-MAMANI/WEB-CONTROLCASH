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
import { signup } from '../api/auth';

export default function SignupScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!nombre.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }

    try {
      setIsLoading(true);
      const resultado = await signup(nombre, email, password);
      Alert.alert('Registro exitoso', 'Ahora puedes iniciar sesión');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', typeof error === 'string' ? error : 'No se pudo registrar');
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
          <Text style={styles.appName}>CONTROL CASH</Text>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.subtitle}>Registrate para controlar tus finanzas</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nombre completo</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Ej: Juan Pérez" 
              value={nombre} 
              onChangeText={setNombre} 
              autoCapitalize="words"
            />
          </View>
          
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
              placeholder="Mínimo 6 caracteres" 
              secureTextEntry 
              value={password} 
              onChangeText={setPassword}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.signupButton} 
            onPress={handleSignup}
            disabled={isLoading}
          >
            <Text style={styles.signupButtonText}>
              {isLoading ? 'Procesando...' : 'Registrarse'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Inicia sesión</Text>
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
  signupButton: {
    backgroundColor: '#4a6da7',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 10,
  },
  signupButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  loginText: {
    fontSize: 14,
    color: '#666',
  },
  loginLink: {
    fontSize: 14,
    color: '#4a6da7',
    fontWeight: '600',
  },
});