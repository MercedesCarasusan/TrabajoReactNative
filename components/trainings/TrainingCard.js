import {
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
  TouchableOpacity
} from 'react-native';

import { useState } from 'react';
import { MaterialCommunityIcons }
  from '@expo/vector-icons';
import { getTrainingImageUri } from '../../services/local/trainingImageService';

export default function TrainingCard({ item, onLongPress }) {

  const [photoVisible, setPhotoVisible] = useState(false);
  const fecha = new Date(item.fecha);
  const imageUri = getTrainingImageUri(item.foto);

  return (

    <TouchableOpacity
      activeOpacity={0.95}
      onLongPress={onLongPress}
      delayLongPress={500}
      style={styles.card}
    >

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

      {imageUri && (
        <>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setPhotoVisible(true)}
          >
            <Image
              source={{ uri: imageUri }}
              style={styles.photo}
            />
          </TouchableOpacity>

          <Modal
            visible={photoVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setPhotoVisible(false)}
          >
            <View style={styles.fullscreenPhotoContainer}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setPhotoVisible(false)}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={28}
                  color="#fff"
                />
              </TouchableOpacity>

              <Image
                source={{ uri: imageUri }}
                style={styles.fullscreenPhoto}
                resizeMode="contain"
              />
            </View>
          </Modal>
        </>
      )}

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

    </TouchableOpacity>

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

  photo: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 15
  },

  fullscreenPhotoContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center'
  },

  fullscreenPhoto: {
    width: '100%',
    height: '100%'
  },

  closeButton: {
    position: 'absolute',
    top: 45,
    right: 20,
    zIndex: 1,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center'
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
