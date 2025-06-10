import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Dimensions, 
  TouchableOpacity, 
  SafeAreaView, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const API_URL = 'https://controlcashapi.onrender.com/api/gastos'; // Ajusta la IP de tu backend

export default function DashboardScreen({ navigation }) {
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      obtenerGastos();
    }, [])
  );

  const obtenerGastos = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setGastos(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudieron cargar los gastos.');
    } finally {
      setLoading(false);
    }
  };

const cerrarSesion = async () => {
  try {
    // 1. Elimina el token de AsyncStorage
    await AsyncStorage.removeItem('token');

    // 2. Cierra el menú desplegable
    setDropdownVisible(false);

    // 3. Redirige al Login y limpia el historial de navegación
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });

    // 4. (Opcional) Verifica en consola que se eliminó el token
    const tokenVerificado = await AsyncStorage.getItem('token');
    console.log('Token luego del logout:', tokenVerificado); // Debería ser null
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    Alert.alert('Error', 'No se pudo cerrar la sesión.');
  }
};





  const gastosPorCategoria = gastos.reduce((acc, gasto) => {
    const categoria = gasto.categoria || 'Sin Categoría';
    if (!acc[categoria]) {
      acc[categoria] = 0;
    }
    acc[categoria] += parseFloat(gasto.monto);
    return acc;
  }, {});

  const dataPie = Object.entries(gastosPorCategoria).map(([categoria, monto], index) => ({
    name: categoria,
    amount: monto,
    color: getColor(index),
    legendFontColor: '#333',
    legendFontSize: 14,
  }));

  const totalGastado = Object.values(gastosPorCategoria).reduce((sum, monto) => sum + monto, 0).toFixed(2);

  const isPremium = false;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CONTROL CASH</Text>
        <View style={{ position: 'relative' }}>
          <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)}>
            <View style={styles.profileButton}>
              <Text style={styles.profileButtonText}>MA</Text>
            </View>
          </TouchableOpacity>
          {dropdownVisible && (
            <View style={styles.dropdownMenu}>
              <TouchableOpacity 
                onPress={cerrarSesion} 
                style={styles.dropdownItem}
                activeOpacity={0.7}
               >
                
                <View style={styles.fullButtonArea}>
                <Text style={styles.dropdownItemText}>Cerrar Sesión</Text>
                </View>
                </TouchableOpacity>
            </View>
          )}
        </View>
      </View>


 <View style={{ flex: 1, zIndex: 1 }}>
  <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.welcomeText}>Hola, Mauro</Text>
    <Text style={styles.title}>Resumen del Mes</Text>

    {loading ? (
      <ActivityIndicator size="large" color="#4a6da7" />
    ) : (
      <>
        <View style={styles.mainCard}>
          <Text style={styles.label}>Total gastado este mes:</Text>
          <Text style={styles.value}>S/ {totalGastado}</Text>
        </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Gasto por categoría</Text>
              {dataPie.length > 0 ? (
                <PieChart
                  data={dataPie}
                  width={Dimensions.get('window').width - 40}
                  height={220}
                  chartConfig={{
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    labelColor: () => '#333',
                  }}
                  accessor="amount"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute
                />
              ) : (
                <Text style={{ textAlign: 'center', marginTop: 20 }}>No hay gastos registrados aún.</Text>
              )}
            </View>
          </>
        )}

        {!isPremium && (
          <View style={styles.alertBox}>
            <Text style={styles.alertTitle}>Versión Gratuita</Text>
            <Text style={styles.alertText}>
              Verás anuncios y tienes límite de exportaciones. Actualiza a premium para acceder a todas las funciones.
            </Text>
            <TouchableOpacity style={styles.upgradeButton}>
              <Text style={styles.upgradeButtonText}>Actualizar Ahora</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>

        <View style={styles.buttonGroup}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => navigation.navigate('RegistrarGasto')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#5c6bc0' }]}>
               <Text style={styles.actionIconText}>+</Text>
            </View>
            <Text style={styles.actionText}>Registrar Gasto</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => navigation.navigate('Categorias')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#42a5f5' }]}>
              <Text style={styles.actionIconText}>≡</Text>
            </View>
            <Text style={styles.actionText}>Categorías</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => navigation.navigate('Exportar')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#26a69a' }]}>
              <Text style={styles.actionIconText}>↓</Text>
            </View>
            <Text style={styles.actionText}>Exportar</Text>
          </TouchableOpacity>
        </View>
</ScrollView>
</View>           
</SafeAreaView>

 ) ;
};
const colors = ['#5c6bc0', '#42a5f5', '#4a6da7', '#26a69a', '#7e57c2', '#ab47bc', '#26c6da', '#66bb6a'];
const getColor = (index) => colors[index % colors.length];

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f7fa' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a6da7',
    letterSpacing: 1,
  },
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4a6da7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
dropdownMenu: {
  position: 'absolute',
  top: 25, // ⬅️ antes 45, ahora más arriba
  right: 0,
  backgroundColor: '#fff',
  borderRadius: 8,
  elevation: 10,
  shadowColor: '#000',
  shadowOpacity: 0.3,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 6,
  zIndex: 9999,
  minWidth: 150,
},




  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  container: { padding: 20, paddingBottom: 40 },
  welcomeText: { fontSize: 16, color: '#666', marginBottom: 5 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  mainCard: { 
    backgroundColor: '#ffffff', 
    padding: 20, 
    borderRadius: 12, 
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  card: { 
    backgroundColor: '#ffffff', 
    padding: 20, 
    borderRadius: 12, 
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333'
  },
  label: { fontSize: 14, color: '#666', marginBottom: 5 },
  value: { fontSize: 28, fontWeight: 'bold', color: '#4a6da7', marginBottom: 15 },
  buttonGroup: { flexDirection: 'row', justifyContent: 'space-between' },
  actionButton: { alignItems: 'center', width: '30%' },
  actionIcon: { width: 54, height: 54, borderRadius: 27, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  actionIconText: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  actionText: { fontSize: 12, color: '#333', textAlign: 'center' },
  alertBox: { 
    backgroundColor: '#ffffff', 
    padding: 20, 
    marginVertical: 10, 
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4a6da7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  alertTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#333' },
  alertText: { color: '#666', fontSize: 14, lineHeight: 20 },
  upgradeButton: {
    backgroundColor: '#4a6da7',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  upgradeButtonText: { color: 'white', fontSize: 12, fontWeight: '600' },
});
