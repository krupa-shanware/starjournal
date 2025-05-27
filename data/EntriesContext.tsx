import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Entry } from './entries';

type EntriesContextType = {
  entries: Entry[];
  addEntry: (entry: Entry) => void;
  updateEntry: (entry: Entry) => void;
  deleteEntry: (id: string) => void;
};

const STORAGE_KEY = 'starjournal_entries';

const EntriesContext = createContext<EntriesContextType | undefined>(undefined);

export function EntriesProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>([]);

  // Load entries from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setEntries(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Failed to load entries from storage', e);
      }
    })();
  }, []);

  // Save entries to AsyncStorage whenever they change
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries)).catch(e =>
      console.error('Failed to save entries to storage', e)
    );
  }, [entries]);

  const addEntry = (entry: Entry) => {
    setEntries(prev => [entry, ...prev]);
  };

  const updateEntry = (updated: Entry) => {
    setEntries(prev => prev.map(e => (e.id === updated.id ? updated : e)));
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  return (
    <EntriesContext.Provider value={{ entries, addEntry, updateEntry, deleteEntry }}>
      {children}
    </EntriesContext.Provider>
  );
}

export function useEntries() {
  const context = useContext(EntriesContext);
  if (!context) throw new Error('useEntries must be used within EntriesProvider');
  return context;
}
