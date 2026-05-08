import { Alert } from 'react-native';
import { auth, db } from '../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { useState, useRef, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Pedometer, Accelerometer } from 'expo-sensors';
import * as Location from 'expo-location';
import MapView, { Marker, Polyline } from 'react-native-maps';

const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // metros
  const toRad = (value) => (value * Math.PI) / 180;

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) *
    Math.cos(φ2) *
    Math.sin(Δλ / 2) *
    Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

export default function Entrenamientos() {

  const [running, setRunning] = useState(false);
  const [steps, setSteps] = useState(0);
  const [accData, setAccData] = useState({ x: 0, y: 0, z: 0 });

  const [pedSubscription, setPedSubscription] = useState(null);
  const [accSubscription, setAccSubscription] = useState(null);

  const [showMap, setShowMap] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationSub, setLocationSub] = useState(null);
  const [distance, setDistance] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [endTime, setEndTime] = useState(null);

  const [routeCoords, setRouteCoords] = useState([]);
  const mapRef = useRef(null);
  const lastLocationRef = useRef(null);
  const runningRef = useRef(false);

  useEffect(() => {

    let interval = null;

    if (running && startTime) {

      interval = setInterval(() => {

        const now = Date.now();

        const elapsedSeconds = (now - startTime) / 1000;

        setElapsedTime(elapsedSeconds);

      }, 1000); // cada 1 segundo
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };

  }, [running, startTime]);

  // ======================
  // LOCALIZACIÓN
  // ======================
  const startLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      alert('Permiso de ubicación denegado');
      return;
    }
    setDistance(0);
    //setLastLocation(null);
    lastLocationRef.current = null;

    const sub = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 3000,
        distanceInterval: 5,
      },
      (loc) => {
        if (!runningRef.current) return;
        const coords = loc.coords;
        setLocation(coords);

        if (!lastLocationRef.current) {

          const firstPoint = {
            latitude: coords.latitude,
            longitude: coords.longitude
          };

          setRouteCoords([firstPoint]);

          lastLocationRef.current = coords;

          return;
        }

        const d = getDistance(
          lastLocationRef.current.latitude,
          lastLocationRef.current.longitude,
          coords.latitude,
          coords.longitude
        );

        // IGNORAR ruido GPS
        if (d > 5 && d < 100) {

          setDistance(prev => prev + d);

          const newPoint = {
            latitude: coords.latitude,
            longitude: coords.longitude
          };

          setRouteCoords(prev => {

            const updatedCoords = [...prev, newPoint];

            if (mapRef.current) {

              mapRef.current.fitToCoordinates(updatedCoords, {
                edgePadding: {
                  top: 80,
                  right: 80,
                  bottom: 80,
                  left: 80
                },
                animated: true
              });
            }

            return updatedCoords;
          });
        }

        lastLocationRef.current = coords;

      }
    );

    setLocationSub(sub);
    setShowMap(true);
  };

  const stopLocation = () => {
    if (locationSub) {
      locationSub.remove();
      setLocationSub(null);
    }

  };

  // ======================
  // PEDOMETER
  // ======================
  const startPedometer = async () => {

    const isAvailable = await Pedometer.isAvailableAsync();

    if (!isAvailable) return;

    if (Platform.OS === 'android') {
      const { status } = await Pedometer.requestPermissionsAsync();

      if (status !== 'granted') return;
    }

    let initial = null;

    const sub = Pedometer.watchStepCount(result => {

      if (initial === null) {
        initial = result.steps;
      }

      setSteps(result.steps - initial);
    });

    setPedSubscription(sub);
  };

  const stopPedometer = () => {
    pedSubscription && pedSubscription.remove();
    setPedSubscription(null);
  };

  // ======================
  // ACCELERÓMETRO
  // ======================
  const startAccelerometer = () => {
    Accelerometer.setUpdateInterval(500);

    const sub = Accelerometer.addListener(data => {
      setAccData(data);
    });

    setAccSubscription(sub);
  };

  const stopAccelerometer = () => {
    accSubscription && accSubscription.remove();
    setAccSubscription(null);
  };

  // ======================
  // ENTRENAMIENTO
  // ======================
  const startTraining = async () => {

    setSteps(0);
    setDistance(0);
    setRouteCoords([]);
    setElapsedTime(0);

    lastLocationRef.current = null;

    setRunning(true);

    runningRef.current = true;

    setStartTime(Date.now());

    await startPedometer();
    startAccelerometer();
    await startLocation();
  };


  const guardarEntrenamiento = async (data) => {

    try {

      const user = auth.currentUser;

      if (!user) return;

      await addDoc(
        collection(db, 'entrenamientos', user.uid, 'sesiones'),
        data
      );

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
    stopLocation();

    const end = Date.now();

    setEndTime(end);

    // ======================
    // DURACIÓN
    // ======================
    const durationMs = end - startTime;
    const durationSeconds = durationMs / 1000;
    const durationMinutes = durationSeconds / 60;

    // ======================
    // VELOCIDAD MEDIA
    // ======================

    // distancia en km
    const distanceKm = distance / 1000;

    // tiempo en horas
    const durationHours = durationSeconds / 3600;

    const avgSpeed = durationHours > 0
      ? distanceKm / durationHours
      : 0;

    // ======================
    // TIPO ENTRENAMIENTO
    // ======================

    let trainingType = 'Paseo';

    if (avgSpeed >= 6 && avgSpeed < 9) {
      trainingType = 'Trote';
    }

    if (avgSpeed >= 9) {
      trainingType = 'Running';
    }

    // ======================
    // KCAL
    // ======================

    const kcal = steps * 0.04;

    // ======================
    // ALERT
    // ======================

    /*     alert(
          `Entrenamiento terminado\n\n` +
          `Tipo: ${trainingType}\n` +
          `Pasos: ${steps}\n` +
          `Distancia: ${distanceKm.toFixed(2)} km\n` +
          `Duración: ${durationMinutes.toFixed(1)} min\n` +
          `Velocidad media: ${avgSpeed.toFixed(2)} km/h\n` +
          `Kcal: ${kcal.toFixed(2)}`
        ); */

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

  const minutes = Math.floor(elapsedTime / 60);
  const seconds = Math.floor(elapsedTime % 60);

  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;


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