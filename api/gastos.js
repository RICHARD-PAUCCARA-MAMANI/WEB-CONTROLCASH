// src/api/gastos.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://controlcashapi.onrender.com/api/Gastos';

const getToken = async () => {
  return await AsyncStorage.getItem('token');
};

export const crearGasto = async (idCategoria, monto, descripcion) => {
  const token = await getToken();
  const response = await axios.post(API_URL, {
    idCategoria,
    monto,
    descripcion
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};
