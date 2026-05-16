import { useState } from 'react';
import { Platform } from 'react-native';
import { Pedometer } from 'expo-sensors';

export default function usePedometer() {

  const [steps, setSteps] = useState(0);
  const [pedSubscription, setPedSubscription] = useState(null);

  // ======================
  // START PEDOMETER
  // ======================

  const startPedometer = async () => {

    const isAvailable =
      await Pedometer.isAvailableAsync();

    if (!isAvailable) return;

    if (Platform.OS === 'android') {

      const { status } =
        await Pedometer.requestPermissionsAsync();

      if (status !== 'granted') return;
    }

    let initial = null;

    const sub =
      Pedometer.watchStepCount(result => {

        if (initial === null) {
          initial = result.steps;
        }
        setSteps(
          result.steps - initial
        );
      });
    setPedSubscription(sub);
  };

  // ======================
  // STOP PEDOMETER
  // ======================

  const stopPedometer = () => {

    if (pedSubscription) {

      pedSubscription.remove();
      setPedSubscription(null);
    }
  };

  // ======================
  // RESET
  // ======================

  const resetSteps = () => {
    setSteps(0);
  };

  return {

    steps,
    startPedometer,
    stopPedometer,
    resetSteps
  };
}