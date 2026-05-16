import {
  View,
  Text,
  StyleSheet
} from 'react-native';

import { MaterialCommunityIcons }
  from '@expo/vector-icons';

export default function TrainingCard({ item }) {

  const fecha = new Date(item.fecha);

  return (

    <View style={styles.card}>

      <View style={styles.topRow}>

        <View>

          <Text style={styles.type}>
            {item.tipoEntrenamiento}
          </Text>

          <Text style={styles.date}>

            📅 {fecha.toLocaleDateString()}

            {' '}

            🕒 {fecha.toLocaleTimeString([], {
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
}

const styles = StyleSheet.create({

  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
    elevation: 4
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
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

  info: {
    fontSize: 15
  }

});