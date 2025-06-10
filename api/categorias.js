import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://controlcashapi.onrender.com/api/Categoria'; // cambia IP si es diferente
const token = async () => {
  // Idealmente esto se guarda tras login
  const auth = await AsyncStorage.getItem('token');
  return auth;
};

export const obtenerCategorias = async () => {
  const auth = await token();
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${auth}` }
  });
  return response.data;
};

export const crearCategoria = async (nombreCategoria) => {
  const auth = await token();
  const response = await axios.post(API_URL, { nombreCategoria }, {
    headers: { Authorization: `Bearer ${auth}` }
  });
  return response.data;
};

export const eliminarCategoria = async (id) => {
  const auth = await token();
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${auth}` }
  });
  return response.data;
};
