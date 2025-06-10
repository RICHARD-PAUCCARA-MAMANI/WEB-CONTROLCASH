import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert, 
  Platform 
} from 'react-native';
import { generarPdf } from '../api/exportacion';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

export default function ExportarScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [mes, setMes] = useState('');
  const [anio, setAnio] = useState('');

  const handleExportar = async () => {
    if (!mes || !anio) {
      Alert.alert('Error', 'Por favor ingresa mes y año.');
      return;
    }

    setLoading(true);
    try {
      const pdfBlob = await generarPdf(parseInt(mes), parseInt(anio));

      if (Platform.OS === 'web') {
        const blob = new Blob([pdfBlob], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_gastos_${mes}_${anio}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64 = reader.result.split(',')[1];
          const fileName = `reporte_gastos_${mes}_${anio}.pdf`;
          const fileUri = FileSystem.cacheDirectory + fileName;

          await FileSystem.writeAsStringAsync(fileUri, base64, {
            encoding: FileSystem.EncodingType.Base64
          });

          const { status } = await MediaLibrary.requestPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'No se pudo guardar el archivo en la carpeta Descargas.');
            return;
          }

          const asset = await MediaLibrary.createAssetAsync(fileUri);
          const album = await MediaLibrary.getAlbumAsync('Download');
          if (album == null) {
            await MediaLibrary.createAlbumAsync('Download', asset, false);
          } else {
            await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
          }

          Alert.alert('Éxito', 'El archivo PDF se guardó en la carpeta Descargas.');
        };
        reader.readAsDataURL(pdfBlob);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message || 'Error al generar PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exportar Reporte PDF</Text>

      <TextInput
        style={styles.input}
        placeholder="Mes (1-12)"
        keyboardType="numeric"
        value={mes}
        onChangeText={setMes}
      />

      <TextInput
        style={styles.input}
        placeholder="Año (e.g. 2025)"
        keyboardType="numeric"
        value={anio}
        onChangeText={setAnio}
      />

      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleExportar}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Generar PDF</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Volver</Text>
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
    marginBottom: 20,
    color: '#4a6da7',
    textAlign: 'center'
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#4a6da7',
    padding: 10, 
    marginBottom: 10, 
    borderRadius: 5 
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
  backButton: {
    alignItems: 'center',
    marginTop: 10
  },
  backButtonText: {
    color: '#42a5f5',
    fontWeight: 'bold'
  }
});
