import { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

import { Pedometer, Accelerometer } from 'expo-sensors';

export default function Entrenamientos() {

  const [running, setRunning] = useState(false);
  const [steps, setSteps] = useState(0);
  const [accData, setAccData] = useState({ x: 0, y: 0, z: 0 });

  const [pedSubscription, setPedSubscription] = useState(null);
  const [accSubscription, setAccSubscription] = useState(null);

  // PEDOMETER
  const startPedometer = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();

    if (!isAvailable) {
      alert("Pedometer no disponible");
      return;
    }

    const sub = Pedometer.watchStepCount(result => {
      setSteps(prev => prev + result.steps);
    });

    setPedSubscription(sub);
  };

  const stopPedometer = () => {
    pedSubscription && pedSubscription.remove();
    setPedSubscription(null);
  };

  // ACCELEROMETER
  const startAccelerometer = () => {
    const sub = Accelerometer.addListener(data => {
      setAccData(data);
    });

    setAccSubscription(sub);
  };

  const stopAccelerometer = () => {
    accSubscription && accSubscription.remove();
    setAccSubscription(null);
  };

  // INICIAR
  const startTraining = () => {
    setSteps(0);
    setRunning(true);

    startPedometer();
    startAccelerometer();
  };

  // PARAR
  const stopTraining = () => {
    setRunning(false);

    stopPedometer();
    stopAccelerometer();

    // 🔥 kcal simple
    const kcal = steps * 0.04;

    alert(`Entrenamiento terminado\nPasos: ${steps}\nKcal: ${kcal.toFixed(2)}`);
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Entrenamiento</Text>

      <Text>Pasos: {steps}</Text>

      <Text>Accel X: {accData.x.toFixed(2)}</Text>
      <Text>Accel Y: {accData.y.toFixed(2)}</Text>
      <Text>Accel Z: {accData.z.toFixed(2)}</Text>

      {!running ? (
        <Button title="Iniciar entrenamiento" onPress={startTraining} />
      ) : (
        <Button title="Parar entrenamiento" onPress={stopTraining} />
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, marginBottom: 20 }
});