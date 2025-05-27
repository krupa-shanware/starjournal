import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useEntries } from '../../data/EntriesContext';

// export const options = {
//     tabBarButton: () => null,
//     tabBarStyle: { display: 'none' },
//   };

export const unstable_settings = {
    initialRouteName: 'index',
    // Hide tab bar for this screen
    tabBarStyle: { display: 'none' },
    tabBarButton: () => null,
};

export default function EntryViewScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { entries, deleteEntry } = useEntries();
  const entry = entries.find(e => e.id === id);

  if (!entry) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Entry not found</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
            deleteEntry(entry.id);
            router.replace('/');
          }
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 16, alignSelf: 'flex-start' }}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{entry.title}</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={styles.editButton} onPress={() => router.push(`/entry/edit/${entry.id}`)}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.info}>{entry.date} {entry.time} • {entry.location}</Text>
      <Text style={styles.info}>Visibility: {entry.visibility}</Text>
      <View style={styles.objectRow}>
        {entry.objects.map(obj => (
          <View key={obj} style={styles.objectTag}><Text style={styles.objectText}>{obj}</Text></View>
        ))}
      </View>
      <Text style={styles.desc}>{entry.description}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2d1457' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 4 },
  editButton: { backgroundColor: '#4b2e83', paddingVertical: 6, paddingHorizontal: 16, borderRadius: 8 },
  deleteButton: { backgroundColor: '#b00020', paddingVertical: 6, paddingHorizontal: 16, borderRadius: 8, marginLeft: 8 },
  editButtonText: { color: '#fff', fontWeight: 'bold' },
  deleteButtonText: { color: '#fff', fontWeight: 'bold' },
  info: { color: '#fff', fontSize: 16, marginBottom: 2 },
  objectRow: { flexDirection: 'row', marginVertical: 8 },
  objectTag: { backgroundColor: '#fff2', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, marginRight: 8 },
  objectText: { color: '#fff', fontSize: 14 },
  desc: { color: '#fff', fontSize: 16, marginTop: 12 },
});