// import { useState } from 'react';
// import { View, Text, Button, StyleSheet, Platform } from 'react-native';
// import { Pedometer, Accelerometer } from 'expo-sensors';
// import * as Location from 'expo-location';
// import MapView, { Marker } from 'react-native-maps';

// export default function Entrenamientos() {

//   const [running, setRunning] = useState(false);
//   const [steps, setSteps] = useState(0);
//   const [accData, setAccData] = useState({ x: 0, y: 0, z: 0 });

//   const [pedSubscription, setPedSubscription] = useState(null);
//   const [accSubscription, setAccSubscription] = useState(null);

//   // ======================
//   // MAPA / LOCALIZACIÓN
//   // ======================
//   const [showMap, setShowMap] = useState(false);
//   const [location, setLocation] = useState(null);
//   const [locationSub, setLocationSub] = useState(null);

//   const startLocation = async () => {
//     const { status } = await Location.requestForegroundPermissionsAsync();

//     if (status !== 'granted') {
//       alert('Permiso de ubicación denegado');
//       return;
//     }

//     const sub = await Location.watchPositionAsync(
//       {
//         accuracy: Location.Accuracy.High,
//         timeInterval: 2000,
//         distanceInterval: 1,
//       },
//       (loc) => {
//         setLocation(loc.coords);
//       }
//     );

//     setLocationSub(sub);
//     setShowMap(true);
//   };

//   const stopLocation = () => {
//     if (locationSub) {
//       locationSub.remove();
//       setLocationSub(null);
//     }
//     setShowMap(false);
//   };

//   // ======================
//   // PEDOMETER
//   // ======================
//   const startPedometer = async () => {
//     const isAvailable = await Pedometer.isAvailableAsync();

//     if (!isAvailable) {
//       alert("Pedometer no disponible en este dispositivo");
//       return;
//     }

//     if (Platform.OS === 'android') {
//       const { status } = await Pedometer.requestPermissionsAsync();

//       if (status !== 'granted') {
//         alert('Permiso de actividad física denegado');
//         return;
//       }
//     }

//     const sub = Pedometer.watchStepCount(result => {
//       setSteps(result.steps);
//     });

//     setPedSubscription(sub);
//   };

//   const stopPedometer = () => {
//     pedSubscription && pedSubscription.remove();
//     setPedSubscription(null);
//   };

//   // ======================
//   // ACCELEROMETER
//   // ======================
//   const startAccelerometer = () => {
//     Accelerometer.setUpdateInterval(500);

//     const sub = Accelerometer.addListener(data => {
//       setAccData(data);
//     });

//     setAccSubscription(sub);
//   };

//   const stopAccelerometer = () => {
//     accSubscription && accSubscription.remove();
//     setAccSubscription(null);
//   };

//   // ======================
//   // INICIAR ENTRENAMIENTO
//   // ======================
//   const startTraining = async () => {
//     setSteps(0);
//     setRunning(true);

//     await startPedometer();
//     startAccelerometer();
//   };

//   // ======================
//   // PARAR ENTRENAMIENTO
//   // ======================
//   const stopTraining = () => {
//     setRunning(false);

//     stopPedometer();
//     stopAccelerometer();
//     stopLocation();

//     const kcal = steps * 0.04;

//     alert(
//       `Entrenamiento terminado\nPasos: ${steps}\nKcal: ${kcal.toFixed(2)}`
//     );
//   };

//   // ======================
//   // UI
//   // ======================
//   if (showMap && location) {
//     return (
//       <View style={{ flex: 1 }}>
//         <MapView
//           style={{ flex: 1 }}
//           showsUserLocation
//           region={{
//             latitude: location.latitude,
//             longitude: location.longitude,
//             latitudeDelta: 0.005,
//             longitudeDelta: 0.005,
//           }}
//         >
//           <Marker coordinate={location} />
//         </MapView>

//         <Button title="Cerrar mapa" onPress={stopLocation} />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Entrenamiento</Text>

//       <Text style={styles.text}>Pasos: {steps}</Text>

//       <Text style={styles.text}>Accel X: {accData.x.toFixed(2)}</Text>
//       <Text style={styles.text}>Accel Y: {accData.y.toFixed(2)}</Text>
//       <Text style={styles.text}>Accel Z: {accData.z.toFixed(2)}</Text>

//       {!running ? (
//         <Button title="Iniciar entrenamiento" onPress={startTraining} />
//       ) : (
//         <Button title="Parar entrenamiento" onPress={stopTraining} />
//       )}
//       {!showMap ? (
//         <Button title="Abrir mapa" onPress={startLocation} />
//       ) : null}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     justifyContent: 'center', 
//     alignItems: 'center',
//     padding: 20
//   },
//   title: { 
//     fontSize: 22, 
//     marginBottom: 20,
//     fontWeight: 'bold'
//   },
//   text: {
//     fontSize: 16,
//     marginBottom: 5
//   }
// });

import { useState } from 'react';
import { View, Text, Button, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Pedometer, Accelerometer } from 'expo-sensors';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

export default function Entrenamientos() {

  const [running, setRunning] = useState(false);
  const [steps, setSteps] = useState(0);
  const [accData, setAccData] = useState({ x: 0, y: 0, z: 0 });

  const [pedSubscription, setPedSubscription] = useState(null);
  const [accSubscription, setAccSubscription] = useState(null);

  const [showMap, setShowMap] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationSub, setLocationSub] = useState(null);

  // ======================
  // LOCALIZACIÓN
  // ======================
  const startLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      alert('Permiso de ubicación denegado');
      return;
    }

    const sub = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 2000,
        distanceInterval: 1,
      },
      (loc) => {
        setLocation(loc.coords);
      }
    );

    setLocationSub(sub);
    setShowMap(true);
  };

  const stopLocation = () => {
    locationSub && locationSub.remove();
    setLocationSub(null);
    setShowMap(false);
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

    const sub = Pedometer.watchStepCount(result => {
      setSteps(result.steps);
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
    setRunning(true);

    await startPedometer();
    startAccelerometer();
  };

  const stopTraining = () => {
    setRunning(false);

    stopPedometer();
    stopAccelerometer();
    stopLocation();

    const kcal = steps * 0.04;

    alert(`Entrenamiento terminado\nPasos: ${steps}\nKcal: ${kcal.toFixed(2)}`);
  };

  // ======================
  // MAPA
  // ======================
  if (showMap && location) {
    return (
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1 }}
          showsUserLocation
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker coordinate={location} />
        </MapView>

        <TouchableOpacity style={styles.closeMapBtn} onPress={stopLocation}>
          <Text style={styles.btnText}>Cerrar mapa</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <View style={styles.card}>
        <Text style={styles.title}>Entrenamiento</Text>

        <View style={styles.statsBox}>
          <Text style={styles.stat}>Pasos: {steps}</Text>
          <Text style={styles.stat}>X: {accData.x.toFixed(2)}</Text>
          <Text style={styles.stat}>Y: {accData.y.toFixed(2)}</Text>
          <Text style={styles.stat}>Z: {accData.z.toFixed(2)}</Text>
        </View>

        {!running ? (
          <TouchableOpacity style={styles.startBtn} onPress={startTraining}>
            <Text style={styles.btnText}>Iniciar entrenamiento</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.stopBtn} onPress={stopTraining}>
            <Text style={styles.btnText}>Parar entrenamiento</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.mapBtn} onPress={startLocation}>
          <Text style={styles.btnText}>Abrir mapa</Text>
        </TouchableOpacity>

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

  closeMapBtn: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#E53935',
    padding: 15,
    borderRadius: 10
  },

  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  }
});