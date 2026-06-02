import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchTrainingsThunk,
  setError
} from '../redux/slices/trainingSlice';
import CaloriesBarChart from '../components/calories/CaloriesBarChart';
import CaloriesDayChart from '../components/calories/CaloriesDayChart';

const FILTERS = [
  { key: 'day', label: 'Hoy' },
  { key: 'week', label: '7 d\u00edas' }
];

const WEEK_DAYS = 7;

const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const formatShortDay = (date) => (
  date.toLocaleDateString('es-ES', {
    weekday: 'short',
    day: '2-digit'
  })
);

const formatDayNumber = (date) => (
  date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit'
  })
);

const buildDailyCalories = (trainings, daysToShow, periodOffset = 0) => {
  const today = new Date();
  const endDate = new Date(today);
  endDate.setDate(today.getDate() - (periodOffset * daysToShow));

  const days = Array.from({ length: daysToShow }, (_, index) => {
    const date = new Date(endDate);
    date.setHours(0, 0, 0, 0);
    date.setDate(endDate.getDate() - (daysToShow - 1 - index));

    return {
      key: formatDateKey(date),
      date,
      label: daysToShow === 1 && periodOffset === 0 ? 'Hoy' : formatShortDay(date),
      kcal: 0
    };
  });

  const caloriesByDay = days.reduce((acc, day) => {
    acc[day.key] = day;
    return acc;
  }, {});

  trainings.forEach((training) => {
    if (!training.fecha) return;

    const trainingDate = new Date(training.fecha);
    const key = formatDateKey(trainingDate);
    const dayData = caloriesByDay[key];

    if (!dayData) return;

    dayData.kcal += Number(training.kcal) || 0;
  });

  return days.map((day) => ({
    ...day,
    kcal: Number(day.kcal.toFixed(2))
  }));
};

const getFilterTitle = (filter, chartData) => {
  if (filter === 'day') {
    const selectedDay = chartData[0];

    return selectedDay?.label === 'Hoy'
      ? 'Hoy'
      : formatDayNumber(selectedDay.date);
  }

  const firstDay = chartData[0];
  const lastDay = chartData[chartData.length - 1];

  if (!firstDay || !lastDay) return '\u00daltimos 7 d\u00edas';

  return `${formatDayNumber(firstDay.date)} - ${formatDayNumber(lastDay.date)}`;
};

export default function CaloriasScreen() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const trainings = useSelector(state => state.trainings.trainings);
  const loading = useSelector(state => state.trainings.loading);
  const error = useSelector(state => state.trainings.error);
  const [selectedFilter, setSelectedFilter] = useState('week');
  const [dayOffset, setDayOffset] = useState(0);
  const [weekOffset, setWeekOffset] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const cargarEntrenamientos = async () => {
        try {
          dispatch(setError(null));

          if (!user) return;

          await dispatch(fetchTrainingsThunk(user.uid)).unwrap();

        } catch (err) {
          console.log(err);
          dispatch(setError(err.message));
        }
      };

      cargarEntrenamientos();
    }, [dispatch, user])
  );

  const dayCalories = useMemo(
    () => buildDailyCalories(trainings, 1, dayOffset),
    [trainings, dayOffset]
  );
  const weekCalories = useMemo(
    () => buildDailyCalories(trainings, WEEK_DAYS, weekOffset),
    [trainings, weekOffset]
  );

  const chartData = selectedFilter === 'day'
    ? dayCalories
    : weekCalories;

  const totalCalories = chartData.reduce(
    (sum, day) => sum + day.kcal,
    0
  );
  const averageCalories = totalCalories / WEEK_DAYS;
  const currentOffset = selectedFilter === 'day' ? dayOffset : weekOffset;

  const goToPreviousPeriod = () => {
    if (selectedFilter === 'day') {
      setDayOffset(offset => offset + 1);
      return;
    }

    setWeekOffset(offset => offset + 1);
  };

  const goToNextPeriod = () => {
    if (selectedFilter === 'day') {
      setDayOffset(offset => Math.max(offset - 1, 0));
      return;
    }

    setWeekOffset(offset => Math.max(offset - 1, 0));
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="fire"
          size={44}
          color="#F57C00"
        />

        <View style={styles.headerText}>
          <Text style={styles.title}>{'Calor\u00edas quemadas'}</Text>
          <Text style={styles.subtitle}>{getFilterTitle(selectedFilter, chartData)}</Text>
        </View>
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((filter) => {
          const isSelected = selectedFilter === filter.key;

          return (
            <TouchableOpacity
              key={filter.key}
              activeOpacity={0.85}
              onPress={() => setSelectedFilter(filter.key)}
              style={[
                styles.filterButton,
                isSelected && styles.filterButtonSelected
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  isSelected && styles.filterTextSelected
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.periodNavigation}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={goToPreviousPeriod}
          style={styles.periodButton}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={28}
            color="#1565C0"
          />
        </TouchableOpacity>

        <Text style={styles.periodText}>
          {selectedFilter === 'day' ? 'D\u00eda seleccionado' : 'Semana seleccionada'}
        </Text>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={goToNextPeriod}
          disabled={currentOffset === 0}
          style={[
            styles.periodButton,
            currentOffset === 0 && styles.periodButtonDisabled
          ]}
        >
          <MaterialCommunityIcons
            name="chevron-right"
            size={28}
            color={currentOffset === 0 ? '#B0BEC5' : '#1565C0'}
          />
        </TouchableOpacity>
      </View>

      {selectedFilter === 'week' && (
        <View style={styles.summaryRow}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryValue}>
              {totalCalories.toFixed(0)}
            </Text>
            <Text style={styles.summaryLabel}>Kcal totales</Text>
          </View>

          <View style={styles.summaryBox}>
            <Text style={styles.summaryValue}>
              {averageCalories.toFixed(0)}
            </Text>
            <Text style={styles.summaryLabel}>Media diaria</Text>
          </View>
        </View>
      )}

      <View style={styles.chartPanel}>
        {selectedFilter === 'day'
          ? (
            <CaloriesDayChart
              totalCalories={totalCalories}
              label={chartData[0]?.label}
            />
          )
          : (
            <CaloriesBarChart
              data={chartData}
            />
          )}
      </View>

      {error && (
        <Text style={styles.error}>
          {error}
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2f7'
  },
  content: {
    padding: 16,
    paddingBottom: 28
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 14,
    elevation: 3
  },
  headerText: {
    marginLeft: 12,
    flex: 1
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#263238'
  },
  subtitle: {
    marginTop: 4,
    color: '#607D8B',
    fontSize: 15
  },
  filterRow: {
    flexDirection: 'row',
    backgroundColor: '#DCE8F5',
    borderRadius: 12,
    padding: 4,
    marginBottom: 14
  },
  filterButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center'
  },
  filterButtonSelected: {
    backgroundColor: '#1565C0'
  },
  filterText: {
    color: '#455A64',
    fontWeight: 'bold'
  },
  filterTextSelected: {
    color: '#fff'
  },
  periodNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    marginBottom: 14,
    elevation: 3
  },
  periodButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center'
  },
  periodButtonDisabled: {
    backgroundColor: '#ECEFF1'
  },
  periodText: {
    flex: 1,
    textAlign: 'center',
    color: '#455A64',
    fontWeight: 'bold'
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14
  },
  summaryBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 3
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1565C0'
  },
  summaryLabel: {
    marginTop: 4,
    color: '#607D8B'
  },
  chartPanel: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    minHeight: 300,
    elevation: 3
  },
  error: {
    marginTop: 14,
    color: '#C62828',
    textAlign: 'center'
  }
});
