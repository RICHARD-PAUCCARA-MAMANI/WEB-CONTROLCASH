import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { crearGasto } from '../api/gastos';
import { obtenerCategorias } from '../api/categorias';

export default function RegistrarGastoScreen() {
  const [monto, setMonto] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const data = await obtenerCategorias();
        setCategorias(data);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
        Alert.alert('Error', 'No se pudieron cargar las categorías');
      }
    };

    cargarCategorias();
  }, []);

  const handleGuardar = async () => {
    if (!monto || !categoriaId) {
      Alert.alert('Error', 'Ingresa monto y selecciona una categoría');
      return;
    }

    try {
      const resultado = await crearGasto(parseInt(categoriaId), parseFloat(monto), descripcion);
      Alert.alert('Éxito', resultado || 'Gasto registrado');
      setMonto('');
      setCategoriaId('');
      setDescripcion('');
    } catch (error) {
      console.error('Error al registrar gasto:', error);
      Alert.alert('Error', 'No se pudo registrar el gasto');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nuevo Gasto</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Monto</Text>
        <TextInput
          placeholder="Monto (S/)"
          keyboardType="numeric"
          value={monto}
          onChangeText={setMonto}
          style={styles.input}
          placeholderTextColor="#a0a0a0"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Categoría</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={categoriaId}
            onValueChange={(itemValue) => setCategoriaId(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Selecciona una categoría" value="" color="#a0a0a0" />
            {categorias.map((cat) => (
              <Picker.Item 
                key={cat.idCategoria} 
                label={cat.nombreCategoria} 
                value={cat.idCategoria} 
                color="#4a6da7"
              />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Descripción</Text>
        <TextInput
          placeholder="Descripción (opcional)"
          value={descripcion}
          onChangeText={setDescripcion}
          style={styles.input}
          placeholderTextColor="#a0a0a0"
          multiline={true}
          numberOfLines={3}
        />
      </View>

      <TouchableOpacity 
        style={styles.saveButton} 
        onPress={handleGuardar}
      >
        <Text style={styles.saveButtonText}>Guardar Gasto</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20,
    backgroundColor: '#f8f9fc' 
  },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 25,
    color: '#4a6da7',
    textAlign: 'center'
  },
  formGroup: {
    marginBottom: 15
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
    color: '#4a6da7'
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#4a6da7',
    padding: 12, 
    borderRadius: 8,
    backgroundColor: 'white',
    fontSize: 16
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#4a6da7',
    borderRadius: 8,
    backgroundColor: 'white',
    overflow: 'hidden'
  },
  picker: {
    height: 50,
  },
  saveButton: {
    backgroundColor: '#4a6da7',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  }
});