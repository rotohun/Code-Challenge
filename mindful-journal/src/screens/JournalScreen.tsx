import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, IconButton, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RootStackScreenProps } from '../types/navigation';
import { useJournal } from '../contexts/JournalContext';
import { LoadingScreen } from '../components/LoadingScreen';
import { debounce } from 'lodash';

const JournalScreen: React.FC<RootStackScreenProps<'Journal'>> = ({
  navigation,
  route,
}) => {
  const insets = useSafeAreaInsets();
  const { addEntry, updateEntry, entries, isSaving } = useJournal();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const { entryId } = route.params || {
    entryId: undefined,
  };

  const existingEntry = entryId ? entries.find(e => e.id === entryId) : undefined;
  
  React.useEffect(() => {
    if (existingEntry) {
      setContent(existingEntry.content);
      setTitle(existingEntry.title);
    }
  }, [existingEntry]);

  const validateEntry = () => {
    if (!content.trim() && !title.trim()) return false;
    if (content.length < 10) {
      Alert.alert('Please enter at least 10 characters for your journal entry');
      return false;
    }
    if (title.length < 5) {
      Alert.alert('Please enter at least 5 characters for your journal title');
      return false;
    }
    return true;
  };

  const saveEntry = async () => {
    if (!validateEntry()) return;
    
    try {
      const entry = {
        id: entryId || Date.now().toString(),
        content: content.trim(),
        createdAt: new Date().toISOString(),
        title: title.trim(),
      };

      if (entryId) {
        await updateEntry(entryId, entry);
      } else {
        await addEntry(entry);
      }
      navigation.goBack();
      setContent('');
      setTitle('');
    } catch (error) {
      console.error('Error processing entry:', error);
    }
  };

  // Create a debounced save function
  const debouncedSave = useCallback(
    debounce(saveEntry, 1000, { leading: true, trailing: false }),
    [content, title, entryId]
  );

  const handleSave = () => {
    if (isSaving) return;
    debouncedSave();
  };

  const handleCancel = () => {
    debouncedSave.cancel();
    setContent('');
    setTitle('');
    navigation.goBack();
  };

  if (isSaving) {
    return <LoadingScreen message="Saving your journal entry..." />;
  }

  const isDisabled = content.length < 10 || title.length < 5;
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={handleCancel}
        />
        <Button 
          mode="contained" 
          onPress={handleSave} 
          disabled={isDisabled || isSaving} 
          style={isDisabled ? styles.saveButtonDisabled : styles.saveButton}
        >
          Save
        </Button>
      </View>

      <TextInput
        style={styles.title}
        multiline={false}
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
        placeholderTextColor="#9E9E9E"
      />

      <TextInput
        style={styles.body}
        multiline={true}
        value={content}
        onChangeText={setContent}
        placeholder="How was your day?"
        placeholderTextColor="#9E9E9E"
        maxLength={1000}
      />
      <View style={styles.contentCounter}>
        <Text variant="bodyMedium" style={content.length > 1000 ? styles.contentCounterTextLimit : styles.contentCounterText}>
          {content.length} / 1000
        </Text>
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    backgroundColor: 'transparent',
    padding: 20,
    textAlignVertical: 'top',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  body: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 20,
    textAlignVertical: 'top',
    borderBottomWidth: 0,
    paddingBottom: 100,
  },
  contentCounter: {
    paddingBottom: 150,
    backgroundColor: '#fff',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  contentCounterTextLimit: {
    color: '#FF0000',
  },
  contentCounterText: {
    color: '#000',
  },
  saveButton: {
    backgroundColor: '#21005d',
    color: '#fff',
  },
  saveButtonDisabled: {
    backgroundColor: '#E0E0E0',
    color: '#000',
  },
});

export default JournalScreen; 