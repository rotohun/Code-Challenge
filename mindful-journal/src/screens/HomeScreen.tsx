import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text } from 'react-native-paper';
import type { TabScreenProps } from '../types/navigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WeekCalendar } from '../components/WeekCalendar';
import { Greeting } from '../components/Greeting';
import { useCalendar } from '../contexts/CalendarContext';
import { JournalCard } from '../components/JournalCard';
import { FilterByMood } from '../components/FilterByMood';

const NoEntries = () => {
  return (
    <View style={styles.noEntriesContainer}>
      <Text variant="titleMedium" style={styles.noEntriesText}>
        No entries for this day.
      </Text>
    </View> 
  );
};

const HomeScreen: React.FC<TabScreenProps<'HomeTab'>> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { visibleEntries } = useCalendar();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const filteredEntries = useMemo(() => {
    if (!selectedMood) {
      return visibleEntries;
    }
    return visibleEntries.filter(entry => entry.sentiment === selectedMood);
  }, [visibleEntries, selectedMood]);

  const handleJournalPress = (entryId: string) => {
    navigation.navigate('JournalEntry', { entryId });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.greetingContainer}>
          <Greeting />
        </View>
      </View>
      <WeekCalendar />

      <FilterByMood
        selectedMood={selectedMood}
        onFilterChange={setSelectedMood}
      />

      {filteredEntries.length === 0 ? (
        <NoEntries />
      ) : (
        <FlatList
          data={filteredEntries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <JournalCard
              id={item.id}
              title={item.title}
              onPress={() => handleJournalPress(item.id)}
              sentiment={item.sentiment}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  separator: {
    height: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  greetingContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  noEntriesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noEntriesText: {
    color: '#757575',
  },
});

export default HomeScreen; 