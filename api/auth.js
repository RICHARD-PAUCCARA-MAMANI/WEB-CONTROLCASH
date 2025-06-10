// src/api/auth.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


// Asegúrate que esta IP esté activa y el backend esté corriendo allí
const API_URL = 'https://controlcashapi.onrender.com/api/Auth';

export const signup = async (nombre, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/registrarse-usuarios`, {  
      nombre,
      email,
      password
    });
    return response.data;
  } catch (error) {
    console.error('Error de signup:', error.response?.data || error.message);
    throw error.response?.data || 'Error en el registro';
  }
};

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password
    });

    const token = response.data.token;

    // GUARDAR el token en almacenamiento local
    await AsyncStorage.setItem('token', token);

    return token;
  } catch (error) {
    console.error('Error de login:', error.response?.data || error.message);
    throw error.response?.data || 'Error al iniciar sesión';
  }
};
