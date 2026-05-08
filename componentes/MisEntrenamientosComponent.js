import { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

import { ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';

import { collection, getDocs, query, orderBy } from 'firebase/firestore';

import { auth, db } from '../firebase/firebaseConfig';

export default function MisEntrenamientos() {

  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Todos');
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

    }, [])
  );

  const cargarEntrenamientos = async () => {

    try {

      const user = auth.currentUser;
      if (!user) return;
      const q = query(
        collection(db, 'entrenamientos', user.uid, 'sesiones'),
        orderBy('fecha', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach((doc) => {

        data.push({
          id: doc.id,
          ...doc.data()
        });

      });

      setTrainings(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >

        {
          filters.map((item) => (

            <TouchableOpacity
              key={item}
              style={[
                styles.filterButton,
                filter === item && styles.activeFilter
              ]}
              onPress={() => setFilter(item)}
            >

              <Text
                style={[
                  styles.filterText,
                  filter === item && styles.activeFilterText
                ]}
              >
                {item}
              </Text>

            </TouchableOpacity>
          ))
        }

      </ScrollView>

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
            renderItem={({ item }) => {

              const fecha = new Date(item.fecha);

              return (

                <View style={styles.card}>
                  <View style={styles.topRow}>
                    <View>
                      <Text style={styles.type}>
                        {item.tipoEntrenamiento}
                      </Text>

                      <Text style={styles.date}>
                        📅 {fecha.toLocaleDateString()} 🕒 {fecha.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Text>

                    </View>
                    <MaterialCommunityIcons
                      name={
                        item.tipoEntrenamiento === 'Running'
                          ? 'run'
                          : item.tipoEntrenamiento === 'Trote'
                            ? 'walk'
                            : 'shoe-print'
                      }
                      size={40}
                      color="#1565C0"
                    />

                  </View>

                  <View style={styles.separator} />

                  <View style={styles.statsGrid}>

                    <View style={styles.statBox}>
                      <Text style={styles.statValue}>
                        {item.distancia}
                      </Text>
                      <Text style={styles.statLabel}>
                        km
                      </Text>
                    </View>

                    <View style={styles.statBox}>
                      <Text style={styles.statValue}>
                        {item.velocidadMedia}
                      </Text>
                      <Text style={styles.statLabel}>
                        km/h
                      </Text>
                    </View>

                    <View style={styles.statBox}>
                      <Text style={styles.statValue}>
                        {item.pasos}
                      </Text>
                      <Text style={styles.statLabel}>
                        pasos
                      </Text>
                    </View>

                  </View>

                  <View style={styles.bottomInfo}>

                    <Text style={styles.info}>
                      🔥 {item.kcal} kcal
                    </Text>

                    <Text style={styles.info}>
                      ⏱ {(item.duracion / 60).toFixed(1)} min
                    </Text>

                  </View>

                </View>
              );
            }}

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

  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
    elevation: 4
  },

  type: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5
  },

  date: {
    color: 'gray',
    marginBottom: 15
  },

  infoBox: {
    gap: 6
  },

  info: {
    fontSize: 15
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
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15
  },

  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15
  },

  statBox: {
    alignItems: 'center'
  },

  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1565C0'
  },

  statLabel: {
    color: 'gray'
  },

  bottomInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  filtersContainer: {
    marginBottom: 15,
    height: 50,
    flexGrow: 0
  },
  filtersContent: {
    alignItems: 'center',
    paddingRight: 10,
    height: 50
  },

  filterButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    elevation: 2,
    justifyContent: 'center'
  },

  activeFilter: {
    backgroundColor: '#1565C0'
  },

  filterText: {
    color: '#1565C0',
    fontWeight: '600'
  },

  activeFilterText: {
    color: '#fff'
  },


});