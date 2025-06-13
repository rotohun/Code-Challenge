import React, { createContext, useState, useContext } from 'react';
import { isSameDay } from 'date-fns';
import { useJournal, type JournalEntry } from './JournalContext';

type CalendarContextType = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  visibleEntries: JournalEntry[];
  todayEntries: JournalEntry[];
  morningEntry?: JournalEntry;
  eveningEntry?: JournalEntry;
};

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { entries } = useJournal();

  const visibleEntries = entries.filter((entry) =>
    isSameDay(new Date(entry.createdAt), selectedDate)
  );

  const todayEntries = entries.filter((entry) =>
    isSameDay(new Date(entry.createdAt), new Date())
  );

  // Get the morning and evening entries for the selected date
  const morningEntry = visibleEntries.find((entry) => {
    const entryDate = new Date(entry.createdAt);
    const hours = entryDate.getHours();
    return hours >= 5 && hours < 12;
  });

  const eveningEntry = visibleEntries.find((entry) => {
    const entryDate = new Date(entry.createdAt);
    const hours = entryDate.getHours();
    return hours >= 18;
  });

  return (
    <CalendarContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        visibleEntries,
        todayEntries,
        morningEntry,
        eveningEntry,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
}; 