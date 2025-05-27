// app/index.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>StarJournal</Text>
          <Text style={styles.entryCount}>{entries.length} entries</Text>
        </View>
        <TouchableOpacity
          style={styles.newEntryButton}
          onPress={() => router.push('/entry/new')}
        >
          <Text style={styles.newEntryText}>+ New Entry</Text>
        </TouchableOpacity>
      </View>
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
            <View style={styles.imageRow}>
              {item.images && item.images.length > 0 && item.images.map((img: string, idx: number) => (
                <Image key={idx} source={{ uri: img }} style={styles.cardImage} />
              ))}
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
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
  entryCount: {
    color: '#fff',
    fontSize: 16,
    marginTop: 4,
    marginBottom: 0,
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
});