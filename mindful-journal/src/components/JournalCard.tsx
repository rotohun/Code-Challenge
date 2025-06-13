import React from 'react';
import { View, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { Swipeable } from 'react-native-gesture-handler';
import { useJournal } from '../contexts/JournalContext';

type Props = {
  title: string;
  isDark?: boolean;
  onPress: () => void;
  sentiment?: string;
  id: string;
};

export const JournalCard: React.FC<Props> = ({
  title,
  isDark = false,
  onPress,
  sentiment,
  id,
}) => {
  const { deleteEntry } = useJournal();
  return (
    <Swipeable renderRightActions={() => (
      <TouchableOpacity style={styles.deleteContainer} onPress={() => {
        deleteEntry(id);
      }}>
        <Text>Delete</Text>
      </TouchableOpacity>
    )}>
    <Pressable onPress={onPress}>
      <View
        style={styles.container}
      >
        <View style={styles.textContainer}>
          <Text
            variant="headlineSmall"
            style={styles.title}
          >
            {title}
          </Text>

        </View>
        <View style={styles.sentimentContainer}>
        <Text
            style={styles.sentiment}
          >
            {sentiment}
          </Text>
        </View>
      </View>
    </Pressable>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    justifyContent: 'space-between',
    backgroundColor: '#FFF8E7',
    flexDirection: 'row',
  },
  textContainer: {
    flex: 1,
    color: '#4E342E',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sentimentContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  sentiment: {
    fontSize: 24,
  },
  deleteContainer: {
    backgroundColor: '#F6CFCF',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: '100%',
  },
}); 