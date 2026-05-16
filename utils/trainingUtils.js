// ======================
// DISTANCIA GPS
// ======================

export const getDistance = (
  lat1,
  lon1,
  lat2,
  lon2
) => {

  const R = 6371e3;

  const toRad = (value) =>
    (value * Math.PI) / 180;

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);

  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) *
    Math.sin(Δφ / 2) +

    Math.cos(φ1) *
    Math.cos(φ2) *

    Math.sin(Δλ / 2) *
    Math.sin(Δλ / 2);

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return R * c;
};

// ======================
// VELOCIDAD MEDIA
// ======================

export const calculateAverageSpeed = (
  distanceMeters,
  durationSeconds
) => {

  const distanceKm =
    distanceMeters / 1000;

  const durationHours =
    durationSeconds / 3600;

  if (durationHours <= 0) {
    return 0;
  }

  return distanceKm / durationHours;
};

// ======================
// TIPO ENTRENAMIENTO
// ======================

export const getTrainingType = (
  avgSpeed
) => {

  if (avgSpeed >= 9) {
    return 'Running';
  }

  if (avgSpeed >= 6) {
    return 'Trote';
  }

  return 'Paseo';
};

// ======================
// FORMATEAR TIEMPO
// ======================

export const formatTime = (
  elapsedTime
) => {

  const minutes =
    Math.floor(elapsedTime / 60);

  const seconds =
    Math.floor(elapsedTime % 60);

  return `${minutes}:${seconds
    .toString()
    .padStart(2, '0')}`;
};

// ======================
// KCAL
// ======================

export const calculateCalories = (
  pesoKg,
  durationSeconds,
  avgSpeed
) => {

  let met = 3;

  // ======================
  // WALKING
  // ======================

  if (avgSpeed >= 9) {
    met = 10;
    
  } else if (avgSpeed >= 6) {
    met = 7;

  } else {
    met = 3;
  }

  const durationHours =
    durationSeconds / 3600;

  const kcal =met *pesoKg *durationHours;

  return kcal;
};