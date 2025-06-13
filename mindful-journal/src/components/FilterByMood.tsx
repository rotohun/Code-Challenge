import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Chip, Text } from 'react-native-paper';
import { useJournal } from '../contexts/JournalContext';

type FilterByMoodProps = {
  onFilterChange: (selectedMood: string | null) => void;
  selectedMood: string | null;
};

export const FilterByMood: React.FC<FilterByMoodProps> = ({
  onFilterChange,
  selectedMood,
}) => {
  const { entries } = useJournal();

  const uniqueMoods = useMemo(() => {
    const moods = new Set(entries.map(entry => entry.sentiment));
    return Array.from(moods);
  }, [entries]);

  if (uniqueMoods.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.title}>Filter by Mood</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Chip
          selected={selectedMood === null}
          onPress={() => onFilterChange(null)}
          style={styles.chip}
        >
          All
        </Chip>
        {uniqueMoods.map((mood) => (
          <Chip
            key={mood}
            selected={selectedMood === mood}
            onPress={() => onFilterChange(mood)}
            style={styles.chip}
          >
            {mood}
          </Chip>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  title: {
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    marginRight: 8,
  },
}); 