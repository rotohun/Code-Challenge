import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RootStackScreenProps } from '../types/navigation';
import { format } from 'date-fns';
import { useJournal } from '../contexts/JournalContext';

const JournalEntryScreen: React.FC<RootStackScreenProps<'JournalEntry'>> = ({ 
  navigation,
  route 
}) => {
  const insets = useSafeAreaInsets();
  const { entries } = useJournal();
  const { entryId } = route.params;
  const [entry, setEntry] = useState(entries.find(e => e.id === entryId));

  useEffect(() => {
    const foundEntry = entries.find(e => e.id === entryId);
    setEntry(foundEntry);
  }, [entries, entryId]);

  if (!entry) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text>Entry not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text variant="titleLarge" style={styles.date}>
          {format(new Date(entry.createdAt), 'MMMM d, yyyy')}
        </Text>
      </View>
      
      <ScrollView style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          {entry.title}
        </Text>
        
        <View style={styles.metadata}>
          <Text variant="bodyMedium" style={styles.time}>
            {format(new Date(entry.createdAt), 'h:mm a')}
          </Text>
        </View>

        <Text variant="bodyLarge" style={styles.contentText}>
          {entry.content}
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  date: {
    flex: 1,
    textAlign: 'center',
    marginRight: 48, // To center the text accounting for the back button
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  metadata: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  time: {
    color: '#757575',
  },
  contentText: {
    lineHeight: 24,
  },
});

export default JournalEntryScreen; 