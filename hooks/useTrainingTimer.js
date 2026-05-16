import { useState, useEffect } from 'react';

export default function useTrainingTimer(running) {

  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // ======================
  // TIMER
  // ======================

  useEffect(() => {

    let interval = null;

    if (running && startTime) {

      interval = setInterval(() => {

        const now = Date.now();
        const elapsedSeconds = (now - startTime) / 1000;

        setElapsedTime(elapsedSeconds);

      }, 1000);

    }

    return () => {

      if (interval) {
        clearInterval(interval);
      }

    };

  }, [running, startTime]);

  // ======================
  // START TIMER
  // ======================

  const startTimer = () => {

    setElapsedTime(0);
    setStartTime(Date.now());
  };

  // ======================
  // STOP TIMER
  // ======================

  const stopTimer = () => {
    return Date.now();
  };

  return {
    startTime,
    elapsedTime,
    startTimer,
    stopTimer
  };
}