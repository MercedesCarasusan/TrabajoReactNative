import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import {
  deleteTrainingThunk,
  fetchTrainingsThunk,
  setFilter,
  setError
} from '../redux/slices/trainingSlice';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Alert, View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';

import TrainingFilters from '../components/trainings/TrainingFilters';
import TrainingCard from '../components/trainings/TrainingCard';


export default function MisEntrenamientos() {

  const dispatch = useDispatch();
  const filter = useSelector(state => state.trainings.filter);
  const trainings = useSelector(state => state.trainings.trainings);
  const loading = useSelector(state => state.trainings.loading);
  const user = useSelector(state => state.auth.user);

  const filters = [
    'Hoy',
    'Ayer',
    'Últimos 7 días',
    'Este mes',
    'Este año',
    'Todos'
  ];

  useFocusEffect(
    useCallback(() => {

      cargarEntrenamientos();

    }, [dispatch, user])
  );

  const cargarEntrenamientos = async () => {

    try {
      dispatch(setError(null));

      if (!user) return;

      await dispatch(fetchTrainingsThunk(user.uid)).unwrap();

    } catch (error) {

      console.log(error);
      dispatch(setError(error.message));

    }
  };

  const borrarEntrenamiento = async (training) => {

    try {
      if (!user) return;

      await dispatch(deleteTrainingThunk({
        userId: user.uid,
        trainingId: training.id,
        foto: training.foto
      })).unwrap();

    } catch (error) {

      console.log(error);
      Alert.alert(
        'Error',
        error.message || 'No se pudo borrar el entrenamiento'
      );
    }
  };

  const confirmarBorradoEntrenamiento = (training) => {
    Alert.alert(
      'Borrar entrenamiento',
      'Esta accion eliminara el entrenamiento guardado',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Borrar entrenamiento',
          style: 'destructive',
          onPress: () => borrarEntrenamiento(training)
        }
      ]
    );
  };

  // FILTRO
  const filteredTrainings = trainings.filter((item) => {

    if (filter === 'Todos') return true;

    const fecha = new Date(item.fecha);
    const now = new Date();

    // ======================
    // HOY
    // ======================

    if (filter === 'Hoy') {

      return (
        fecha.getDate() === now.getDate() &&
        fecha.getMonth() === now.getMonth() &&
        fecha.getFullYear() === now.getFullYear()
      );
    }

    // ======================
    // AYER
    // ======================

    if (filter === 'Ayer') {

      const yesterday = new Date();
      yesterday.setDate(now.getDate() - 1);

      return (
        fecha.getDate() === yesterday.getDate() &&
        fecha.getMonth() === yesterday.getMonth() &&
        fecha.getFullYear() === yesterday.getFullYear()
      );
    }

    // ======================
    // ÚLTIMOS 7 DÍAS
    // ======================

    if (filter === 'Últimos 7 días') {

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      return fecha >= sevenDaysAgo;
    }

    // ======================
    // ESTE MES
    // ======================

    if (filter === 'Este mes') {
      return (
        fecha.getMonth() === now.getMonth() &&
        fecha.getFullYear() === now.getFullYear()
      );
    }

    // ======================
    // ESTE AÑO
    // ======================

    if (filter === 'Este año') {
      return (
        fecha.getFullYear() === now.getFullYear()
      );
    }

    return true;
  });

  // ======================
  // LOADING
  // ======================

  if (loading) {

    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // ======================
  // RENDER
  // ======================

  return (

    <View style={styles.container}>
      <TrainingFilters
        filters={filters}
        selectedFilter={filter}
        onSelectFilter={(value) =>
          dispatch(setFilter(value))
        }
      />

      {
        filteredTrainings.length === 0 ? (

          <View style={styles.emptyContainer}>

            <MaterialCommunityIcons
              name="run-fast"
              size={70}
              color="#B0BEC5"
            />

            <Text style={styles.empty}>
              No hay entrenamientos guardados
            </Text>

          </View>

        ) : (
          <FlatList
            data={filteredTrainings}
            contentContainerStyle={{ paddingBottom: 20 }}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TrainingCard
                item={item}
                onLongPress={() => confirmarBorradoEntrenamiento(item)}
              />
            )}
          />
        )
      }

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2f7',
    padding: 15
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 18
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
});
