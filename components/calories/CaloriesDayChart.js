import { StyleSheet, Text, View } from 'react-native';

export default function CaloriesDayChart({ totalCalories, label = 'Hoy' }) {
  return (
    <View style={styles.dayChart}>
      <View style={styles.calorieCircle}>
        <Text style={styles.circleValue}>
          {totalCalories.toFixed(0)}
        </Text>

        <Text style={styles.circleLabel}>
          kcal
        </Text>
      </View>

      <Text style={styles.dayHint}>
        {label === 'Hoy' ? 'Calor\u00edas quemadas hoy' : `Calor\u00edas quemadas el ${label}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  dayChart: {
    minHeight: 260,
    justifyContent: 'center',
    alignItems: 'center'
  },
  calorieCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 18,
    borderColor: '#F57C00',
    backgroundColor: '#FFF8E1',
    justifyContent: 'center',
    alignItems: 'center'
  },
  circleValue: {
    fontSize: 46,
    fontWeight: 'bold',
    color: '#263238'
  },
  circleLabel: {
    marginTop: 2,
    fontSize: 18,
    color: '#F57C00',
    fontWeight: 'bold'
  },
  dayHint: {
    marginTop: 18,
    color: '#607D8B',
    fontSize: 16
  }
});
