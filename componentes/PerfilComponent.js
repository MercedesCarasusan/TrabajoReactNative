import { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

import { auth, db } from '../firebase/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function Perfil() {

  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [edad, setEdad] = useState('');
  const [loading, setLoading] = useState(true);

  const user = auth.currentUser;

  // CARGAR DATOS
  useEffect(() => {
    const cargarPerfil = async () => {
      if (!user) return;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setPeso(data.peso?.toString() || '');
        setAltura(data.altura?.toString() || '');
        setEdad(data.edad?.toString() || '');
      }

      setLoading(false);
    };

    cargarPerfil();
  }, []);

  // GUARDAR DATOS
  const guardarPerfil = async () => {
    try {
      await setDoc(doc(db, "users", user.uid), {
        peso: Number(peso),
        altura: Number(altura),
        edad: Number(edad)
      });

      alert("Perfil guardado");
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <Text>Cargando...</Text>;
  }

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Perfil</Text>

      <TextInput
        label="Peso (kg)"
        value={peso}
        onChangeText={setPeso}
        style={styles.input}
        keyboardType="numeric"
      />

      <TextInput
        label="Altura (cm)"
        value={altura}
        onChangeText={setAltura}
        style={styles.input}
        keyboardType="numeric"
      />

      <TextInput
        label="Edad"
        value={edad}
        onChangeText={setEdad}
        style={styles.input}
        keyboardType="numeric"
      />

      <Button mode="contained" onPress={guardarPerfil}>
        Guardar
      </Button>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { marginBottom: 10 },
  title: { fontSize: 22, textAlign: 'center', marginBottom: 20 }
});