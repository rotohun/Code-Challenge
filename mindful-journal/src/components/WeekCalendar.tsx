import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { useCalendar } from '../contexts/CalendarContext';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const WeekCalendar = () => {
  const { selectedDate, setSelectedDate } = useCalendar();
  const startOfWeekDate = startOfWeek(selectedDate);

  const weekDays = DAYS.map((day, index) => {
    const date = addDays(startOfWeekDate, index);
    const isSelected = isSameDay(date, selectedDate);
    const isToday = isSameDay(date, new Date());

    return {
      day,
      date,
      isSelected,
      isToday,
    };
  });

  return (
    <View style={styles.container}>
      {weekDays.map((item) => (
        <Pressable
          key={item.date.toISOString()}
          onPress={() => setSelectedDate(item.date)}
          style={[
            styles.dayContainer,
            item.isSelected && styles.selectedContainer,
            item.isToday && styles.todayContainer,
          ]}
        >
          <Text
            variant="bodyMedium"
            style={[
              styles.dayText,
              item.isSelected && styles.selectedText,
              item.isToday && styles.todayText,
            ]}
          >
            {item.day}
          </Text>
          <Text
            variant="titleMedium"
            style={[
              styles.dateText,
              item.isSelected && styles.selectedText,
              item.isToday && styles.todayText,
            ]}
          >
            {format(item.date, 'd')}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  dayContainer: {
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  selectedContainer: {
    backgroundColor: '#000',
  },
  todayContainer: {
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  dayText: {
    color: '#9E9E9E',
    fontSize: 14,
  },
  dateText: {
    marginTop: 4,
    color: '#9E9E9E',
  },
  selectedText: {
    color: '#fff',
  },
  todayText: {
    color: '#000',
  },
}); 