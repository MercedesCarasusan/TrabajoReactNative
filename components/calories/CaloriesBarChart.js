import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

const MAX_BAR_HEIGHT = 180;

export default function CaloriesBarChart({ data }) {
  const maxCalories = Math.max(
    ...data.map(day => day.kcal),
    0
  );

  if (maxCalories === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons
          name="chart-bar"
          size={64}
          color="#B0BEC5"
        />

        <Text style={styles.emptyText}>
          {'No hay calor\u00edas registradas en este periodo'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.chart}>
      {data.map((day) => {
        const barHeight = Math.max(
          (day.kcal / maxCalories) * MAX_BAR_HEIGHT,
          day.kcal > 0 ? 8 : 0
        );

        return (
          <View
            key={day.key}
            style={styles.barColumn}
          >
            <Text style={styles.barValue}>
              {day.kcal.toFixed(0)}
            </Text>

            <View style={styles.barTrack}>
              <View
                style={[
                  styles.bar,
                  { height: barHeight }
                ]}
              />
            </View>

            <Text style={styles.barLabel}>
              {day.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  chart: {
    height: 270,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },
  barColumn: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  barValue: {
    height: 22,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#455A64'
  },
  barTrack: {
    height: MAX_BAR_HEIGHT,
    width: 22,
    justifyContent: 'flex-end',
    backgroundColor: '#E3F2FD',
    borderRadius: 11,
    overflow: 'hidden'
  },
  bar: {
    width: '100%',
    backgroundColor: '#F57C00',
    borderRadius: 11
  },
  barLabel: {
    height: 38,
    marginTop: 8,
    textAlign: 'center',
    color: '#607D8B',
    fontSize: 11,
    textTransform: 'capitalize'
  },
  emptyContainer: {
    minHeight: 260,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    marginTop: 14,
    textAlign: 'center',
    color: '#607D8B',
    fontSize: 16
  }
});
