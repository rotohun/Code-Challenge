import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { analyzeLLM } from '../services/llm';
import { useAuth } from './AuthContext';

export type JournalEntry = {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
  sentiment: string;
};

type JournalContextType = {
  entries: JournalEntry[];
  loading: boolean;
  isSaving: boolean;
  addEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'sentiment' | 'userId'>) => Promise<void>;
  updateEntry: (id: string, entry: Omit<JournalEntry, 'id' | 'createdAt' | 'sentiment' | 'userId'>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  getEntry: (id: string) => JournalEntry | undefined;
};

const JournalContext = createContext<JournalContextType | undefined>(undefined);

const JOURNAL_ENTRIES_KEY = 'journal_entries';

export const JournalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadEntries();
    } else {
      setEntries([]);
      setLoading(false);
    }
  }, [user]);

  const loadEntries = async () => {
    if (!user) return;
    
    try {
      const storedEntries = await AsyncStorage.getItem(JOURNAL_ENTRIES_KEY);
      if (storedEntries) {
        const allEntries: JournalEntry[] = JSON.parse(storedEntries);
        const userEntries = allEntries.filter(entry => entry.userId === user.id);
        setEntries(userEntries);
      }
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveEntries = async (newEntries: JournalEntry[]) => {
    try {
      const storedEntries = await AsyncStorage.getItem(JOURNAL_ENTRIES_KEY);
      const allEntries: JournalEntry[] = storedEntries ? JSON.parse(storedEntries) : [];
      
      const otherUsersEntries = allEntries.filter(entry => entry.userId !== user?.id);
      
      const updatedEntries = [...otherUsersEntries, ...newEntries];
      
      await AsyncStorage.setItem(JOURNAL_ENTRIES_KEY, JSON.stringify(updatedEntries));
      setEntries(newEntries);
    } catch (error) {
      console.error('Error saving entries:', error);
    }
  };

  const addEntry = async (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'sentiment' | 'userId'>) => {
    if (!user) throw new Error('User must be logged in to add entries');
    
    setIsSaving(true);
    try {
      const sentiment = await analyzeLLM(entry.content);
      const newEntry: JournalEntry = {
        ...entry,
        id: Date.now().toString(),
        userId: user.id,
        createdAt: new Date().toISOString(),
        sentiment,
      };
      await saveEntries([...entries, newEntry]);
    } catch (error) {
      console.error('Error adding entry:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const updateEntry = async (id: string, entry: Omit<JournalEntry, 'id' | 'createdAt' | 'sentiment' | 'userId'>) => {
    if (!user) throw new Error('User must be logged in to update entries');
    
    setIsSaving(true);
    try {
      const existingEntry = entries.find(e => e.id === id);
      if (!existingEntry || existingEntry.userId !== user.id) {
        throw new Error('Entry not found or unauthorized');
      }

      const sentiment = await analyzeLLM(entry.content);
      const updatedEntry: JournalEntry = {
        ...entry,
        id,
        userId: user.id,
        createdAt: existingEntry.createdAt,
        sentiment,
      };
      await saveEntries(entries.map(e => e.id === id ? updatedEntry : e));
    } catch (error) {
      console.error('Error updating entry:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const deleteEntry = async (id: string) => {
    if (!user) throw new Error('User must be logged in to delete entries');
    
    try {
      const entry = entries.find(e => e.id === id);
      if (!entry || entry.userId !== user.id) {
        throw new Error('Entry not found or unauthorized');
      }
      await saveEntries(entries.filter(entry => entry.id !== id));
    } catch (error) {
      console.error('Error deleting entry:', error);
      throw error;
    }
  };

  const getEntry = (id: string) => {
    const entry = entries.find(entry => entry.id === id);
    if (entry && user && entry.userId !== user.id) {
      return undefined;
    }
    return entry;
  };

  return (
    <JournalContext.Provider
      value={{
        entries,
        loading,
        isSaving,
        addEntry,
        updateEntry,
        deleteEntry,
        getEntry,
      }}
    >
      {children}
    </JournalContext.Provider>
  );
};

export const useJournal = () => {
  const context = useContext(JournalContext);
  if (context === undefined) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
}; 