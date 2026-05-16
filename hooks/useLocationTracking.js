import { useState, useRef } from 'react';

import * as Location from 'expo-location';

import { getDistance } from '../utils/trainingUtils';

export default function useLocationTracking(runningRef, mapRef) {

  const [showMap, setShowMap] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationSub, setLocationSub] = useState(null);
  const [distance, setDistance] = useState(0);
  const [routeCoords, setRouteCoords] = useState([]);
  const lastLocationRef = useRef(null);

  // ======================
  // START LOCATION
  // ======================

  const startLocationTracking =
    async () => {

      const { status } =
        await Location
          .requestForegroundPermissionsAsync();

      if (status !== 'granted') {

        alert(
          'Permiso de ubicación denegado'
        );

        return;
      }

      setDistance(0);
      lastLocationRef.current = null;

      const sub = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,

            timeInterval: 3000,
            distanceInterval: 5
          },

          (loc) => {

            if (!runningRef.current) {
              return;
            }

            const coords = loc.coords;
            setLocation(coords);

            // ======================
            // PRIMER PUNTO
            // ======================

            if (!lastLocationRef.current) {

              const firstPoint = {

                latitude: coords.latitude,
                longitude: coords.longitude
              };

              setRouteCoords([firstPoint]);
              lastLocationRef.current = coords;

              return;
            }

            // ======================
            // DISTANCIA
            // ======================

            const d = getDistance(

              lastLocationRef.current.latitude,
              lastLocationRef.current.longitude,

              coords.latitude,
              coords.longitude

            );

            // ======================
            // IGNORAR RUIDO GPS
            // ======================

            if (d > 5 && d < 100) {

              setDistance(prev => prev + d);

              const newPoint = {
                latitude: coords.latitude,
                longitude: coords.longitude
              };

              setRouteCoords(prev => {

                const updatedCoords = [
                  ...prev,
                  newPoint
                ];

                // ======================
                // AUTO FIT MAP
                // ======================

                if (mapRef.current) {

                  mapRef.current.fitToCoordinates(
                      updatedCoords,
                      {
                        edgePadding: {
                          top: 80,
                          right: 80,
                          bottom: 80,
                          left: 80
                        },

                        animated: true
                      }
                    );
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

  // ======================
  // STOP LOCATION
  // ======================

  const stopLocationTracking = () => {

    if (locationSub) {

      locationSub.remove();
      setLocationSub(null);
    }
  };

  // ======================
  // RESET ROUTE
  // ======================

  const resetRoute = () => {

    setDistance(0);
    setRouteCoords([]);
    lastLocationRef.current = null;

  };

  return {
    showMap,
    location,
    distance,
    routeCoords,

    startLocationTracking,
    stopLocationTracking,
    resetRoute
  };

}