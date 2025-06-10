import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://controlcashapi.onrender.com/api/exportacion'; // cambia IP si es diferente

const token = async () => {
  const auth = await AsyncStorage.getItem('token');
  return auth;
};

export const generarPdf = async (mes, anio) => {
  const auth = await token();
  const response = await axios.post(
    `${API_URL}/generar-pdf`,
    { mes, anio },
    {
      headers: {
        Authorization: `Bearer ${auth}`
      },
      responseType: 'blob' // para recibir binario
    }
  );
  return response.data;
};
