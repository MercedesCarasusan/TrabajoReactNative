import { useState } from 'react';
import { Accelerometer } from 'expo-sensors';

export default function useAccelerometer() {

  const [accData, setAccData] =
    useState({
      x: 0,
      y: 0,
      z: 0
    });

  const [accSubscription, setAccSubscription] =
    useState(null);

  // ======================
  // START ACCELEROMETER
  // ======================

  const startAccelerometer = () => {

    Accelerometer.setUpdateInterval(500);

    const sub =
      Accelerometer.addListener(data => {
        setAccData(data);
      });
    setAccSubscription(sub);

  };

  // ======================
  // STOP ACCELEROMETER
  // ======================

  const stopAccelerometer = () => {

    if (accSubscription) {
      accSubscription.remove();
      setAccSubscription(null);
    }

  };

  return {

    accData,
    startAccelerometer,
    stopAccelerometer

  };

}