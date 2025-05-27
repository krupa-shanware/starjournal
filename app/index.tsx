// app/index.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useEntries } from '../data/EntriesContext';
import { Entry } from '../data/entries';

type Section = {
  title: string;
  data: Entry[];
};

function groupEntriesByMonth(entries: Entry[]): Section[] {
  const groups: Record<string, Entry[]> = {};
  entries.forEach((entry) => {
    const date = new Date(entry.date);
    const key = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!groups[key]) groups[key] = [];
    groups[key].push(entry);
  });
  // Sort groups by date descending
  return Object.entries(groups)
    .sort((a, b) => {
      const aDate = new Date(a[1][0].date).getTime();
      const bDate = new Date(b[1][0].date).getTime();
      return bDate - aDate;
    })
    .map(([title, data]) => ({ title, data: data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) }));
}

export default function HomeScreen() {
  const router = useRouter();
  const { entries } = useEntries();
  const sections = groupEntriesByMonth(entries);

  // Calculate unique planetary objects (case-insensitive)
  const uniqueObjects = new Set(
    entries.flatMap(e => e.objects.map(obj => obj.trim().toLowerCase()))
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Star Journal</Text>
            <TouchableOpacity
              style={styles.newEntryButton}
              onPress={() => router.push('/entry/new')}
            >
              <Text style={styles.newEntryText}>+ New Entry</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.metricsRow}>
            <View style={styles.metricBox}>
              <Ionicons name="document-text-outline" size={18} color="#fff" style={styles.metricIcon} />
              <Text style={styles.metricText}>{entries.length} entries</Text>
            </View>
            <Text style={styles.metricDivider}>|</Text>
            <View style={styles.metricBox}>
              <Ionicons name="planet-outline" size={18} color="#fff" style={styles.metricIcon} />
              <Text style={styles.metricText}>{uniqueObjects.size} planetary objects</Text>
            </View>
          </View>
        </View>
      </View>
      {entries.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <Ionicons name="telescope-outline" size={64} color="#fff" style={{ marginBottom: 16 }} />
          <Text style={styles.emptyStateText}>No entries yet. Tap + New Entry to start your journal!</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={item => item.id}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => router.push(`/entry/${item.id}`)}>
              <Text style={styles.cardDate}>{item.date}</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardInfo}>{item.location}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a0d2e',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 0,
  },
  metricBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricIcon: {
    marginRight: 4,
  },
  metricText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  metricDivider: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
  newEntryButton: {
    backgroundColor: '#3a2459',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  newEntryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionHeader: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#3a2459',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardDate: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
    fontWeight: '600',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  cardInfo: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 6,
  },
  imageRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  cardImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: '#222',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.8,
  },
});