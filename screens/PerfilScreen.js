import { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

//import { auth } from '../firebase/firebaseConfig';
//import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getProfile, saveProfile } from '../services/firebase/profileService';

import { useDispatch, useSelector } from 'react-redux';

import { setProfile, setPeso, setAltura, setEdad, setLoading, setError } from '../redux/slices/profileSlice';

export default function Perfil() {

  const dispatch = useDispatch();
  const peso = useSelector(state => state.profile.peso);
  const altura = useSelector(state => state.profile.altura);
  const edad = useSelector(state => state.profile.edad);
  const loading = useSelector(state => state.profile.loading);

  const user = useSelector(state => state.auth.user);

  // CARGAR DATOS
  useEffect(() => {

    const cargarPerfil = async () => {

      try {

        dispatch(setLoading(true));
        dispatch(setError(null));

        if (!user) return;

        const data = await getProfile(user.uid);

        if (data) {

          dispatch(setProfile({
            peso: data.peso?.toString() || '',
            altura: data.altura?.toString() || '',
            edad: data.edad?.toString() || ''
          }));

        }

      } catch (error) {

        console.log(error);
        dispatch(setError(error.message));

      } finally {
        dispatch(setLoading(false));

      }
    };
    cargarPerfil();
  }, []);

  // GUARDAR DATOS
  const guardarPerfil = async () => {
    try {
      await saveProfile(user.uid, {
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
        onChangeText={(text) => dispatch(setPeso(text))}
        style={styles.input}
        keyboardType="numeric"
      />

      <TextInput
        label="Altura (cm)"
        value={altura}
        onChangeText={(text) => dispatch(setAltura(text))}
        style={styles.input}
        keyboardType="numeric"
      />

      <TextInput
        label="Edad"
        value={edad}
        onChangeText={(text) => dispatch(setEdad(text))}
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