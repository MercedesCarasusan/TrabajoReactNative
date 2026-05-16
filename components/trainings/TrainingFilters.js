import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function TrainingFilters({
  filters,
  selectedFilter,
  onSelectFilter
}) {

  return (

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
              selectedFilter === item &&
              styles.activeFilter
            ]}
            onPress={() => onSelectFilter(item)}
          >

            <Text
              style={[
                styles.filterText,
                selectedFilter === item &&
                styles.activeFilterText
              ]}
            >
              {item}
            </Text>

          </TouchableOpacity>
        ))
      }

    </ScrollView>

  );
}

const styles = StyleSheet.create({

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
  }

});