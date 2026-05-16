import { Alert } from 'react-native';
import { saveTraining } from '../services/firebase/trainingService';
import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useSelector } from 'react-redux';
import { calculateAverageSpeed, getTrainingType, formatTime, calculateCalories } from '../utils/trainingUtils';
import useTrainingTimer from '../hooks/useTrainingTimer';
import usePedometer from '../hooks/usePedometer';
import useAccelerometer from '../hooks/useAccelerometer';
import useLocationTracking from '../hooks/useLocationTracking';

export default function Entrenamientos() {

  const user = useSelector(state => state.auth.user);
  const peso = useSelector(state => state.profile.peso);

  const [running, setRunning] = useState(false);
  const mapRef = useRef(null);
  const runningRef = useRef(false);

  const {
    showMap,
    location,
    distance,
    routeCoords,

    startLocationTracking,
    stopLocationTracking,
    resetRoute
  } = useLocationTracking(runningRef, mapRef);

  const {
    startTime,
    elapsedTime,
    startTimer,
    stopTimer
  } = useTrainingTimer(running);

  const {
    steps,
    startPedometer,
    stopPedometer,
    resetSteps
  } = usePedometer();

  const {
    accData,
    startAccelerometer,
    stopAccelerometer
  } = useAccelerometer();

  // ======================
  // ENTRENAMIENTO
  // ======================
  const startTraining = async () => {

    resetSteps();
    resetRoute();
    startTimer();

    setRunning(true);
    runningRef.current = true;

    await startPedometer();
    startAccelerometer();
    await startLocationTracking();
  };


  const guardarEntrenamiento = async (data) => {

    try {

      if (!user) return;

      await saveTraining(user.uid, data);

      Alert.alert(
        'Entrenamiento guardado',
        'Los datos se han almacenado correctamente'
      );

    } catch (error) {

      console.log(error);
      Alert.alert(
        'Error',
        'No se pudo guardar el entrenamiento'
      );
    }
  };


  const stopTraining = () => {
    setRunning(false);

    runningRef.current = false;

    stopPedometer();
    stopAccelerometer();
    stopLocationTracking();

    const end = stopTimer();

    // ======================
    // DURACIÓN
    // ======================
    const durationMs = end - startTime;
    const durationSeconds = durationMs / 1000;
    const durationMinutes = durationSeconds / 60;

    // ======================
    // VELOCIDAD MEDIA
    // ======================

    const avgSpeed = calculateAverageSpeed(distance, durationSeconds);

    // ======================
    // TIPO ENTRENAMIENTO
    // ======================

    const trainingType = getTrainingType(avgSpeed);

    // ======================
    // KCAL
    // ======================

    const kcal = calculateCalories(Number(peso),durationSeconds,avgSpeed);

    // ======================
    // ALERT
    // ======================

    const distanceKm = distance / 1000;

    const trainingData = {

      fecha: new Date().toISOString(),
      tipoEntrenamiento: trainingType,
      duracion: Number(durationSeconds.toFixed(1)),
      distancia: Number(distanceKm.toFixed(2)),
      velocidadMedia: Number(avgSpeed.toFixed(2)),
      pasos: steps,
      kcal: Number(kcal.toFixed(2)),
      foto: ''

    };

    Alert.alert(
      'Entrenamiento terminado',
      `Tipo: ${trainingType}\n` +
      `Pasos: ${steps}\n` +
      `Distancia: ${distanceKm.toFixed(2)} km\n` +
      `Duración: ${durationMinutes.toFixed(1)} min\n` +
      `Velocidad media: ${avgSpeed.toFixed(2)} km/h\n` +
      `Kcal: ${kcal.toFixed(2)}`,

      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Guardar entrenamiento',
          onPress: () => guardarEntrenamiento(trainingData)
        }
      ]
    );

  };

  const formattedTime = formatTime(elapsedTime);


  return (
    <View style={styles.container}>

      <View style={styles.card}>
        <Text style={styles.title}>Entrenamiento</Text>

        <View style={styles.statsBox}>
          <Text style={styles.stat}>Pasos: {steps}</Text>
          <Text style={styles.stat}>X: {accData.x.toFixed(2)}</Text>
          <Text style={styles.stat}>Y: {accData.y.toFixed(2)}</Text>
          <Text style={styles.stat}>Z: {accData.z.toFixed(2)}</Text>
          <Text style={styles.stat}>Distancia: {(distance / 1000).toFixed(2)} km</Text>
          <Text style={styles.stat}>Tiempo: {formattedTime} min</Text>
        </View>

        {showMap && location && (

          <MapView
            ref={mapRef}
            style={styles.map}
            showsUserLocation
            region={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
          >
            <Marker coordinate={location} />
            <Polyline
              coordinates={routeCoords}
              strokeWidth={5}
              strokeColor="#1E88E5"
            />
          </MapView>

        )}

        {!running ? (
          <TouchableOpacity style={styles.startBtn} onPress={startTraining}>
            <Text style={styles.btnText}>Iniciar entrenamiento</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.stopBtn} onPress={stopTraining}>
            <Text style={styles.btnText}>Parar entrenamiento</Text>
          </TouchableOpacity>
        )}

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2f7',
    justifyContent: 'center',
    alignItems: 'center'
  },

  card: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 20,
    elevation: 5
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },

  statsBox: {
    marginBottom: 20
  },

  stat: {
    fontSize: 16,
    marginBottom: 5
  },

  startBtn: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10
  },

  stopBtn: {
    backgroundColor: '#E53935',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10
  },

  mapBtn: {
    backgroundColor: '#1E88E5',
    padding: 15,
    borderRadius: 10
  },

  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  map: {
    width: '100%',
    height: 300,
    borderRadius: 15,
    marginBottom: 20
  },
});