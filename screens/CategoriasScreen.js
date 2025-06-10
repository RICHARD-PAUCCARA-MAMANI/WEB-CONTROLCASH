import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { crearCategoria, eliminarCategoria, obtenerCategorias } from '../api/categorias';

export default function CategoriasScreen() {
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [categorias, setCategorias] = useState([]);

  const cargarCategorias = async () => {
    try {
      const data = await obtenerCategorias();
      setCategorias(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo cargar las categorías');
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  const agregarCategoria = async () => {
    if (nuevaCategoria.trim() === '') return;
    try {
      await crearCategoria(nuevaCategoria);
      setNuevaCategoria('');
      cargarCategorias();
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar la categoría');
    }
  };

  const eliminar = async (id) => {
    try {
      await eliminarCategoria(id);
      cargarCategorias();
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar la categoría');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categorías</Text>
      
      <TextInput
        style={styles.input}
        value={nuevaCategoria}
        onChangeText={setNuevaCategoria}
        placeholder="Nueva categoría"
      />
      
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={agregarCategoria}
      >
        <Text style={styles.buttonText}>Agregar</Text>
      </TouchableOpacity>
      
      <FlatList
        data={categorias}
        keyExtractor={item => item.idCategoria.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.categoryText}>{item.nombreCategoria}</Text>
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => eliminar(item.idCategoria)}
            >
              <Text style={styles.deleteButtonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
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
    marginBottom: 20,
    color: '#4a6da7'
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#4a6da7',
    padding: 10, 
    marginBottom: 10, 
    borderRadius: 5 
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 10,
    backgroundColor: '#e6edf7',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center'
  },
  addButton: {
    backgroundColor: '#4a6da7',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  categoryText: {
    fontSize: 16,
    color: '#4a6da7'
  },
  deleteButton: {
    backgroundColor: '#ff6b6b',
    padding: 8,
    borderRadius: 5
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold'
  }
});