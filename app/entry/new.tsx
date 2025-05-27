// app/entry/new.tsx
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useEntries } from '../../data/EntriesContext';

const VISIBILITY_OPTIONS = ['Clear', 'Partly Cloudy', 'Cloudy', 'Hazy', 'Other'];

export default function NewEntryScreen() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [time, setTime] = useState<Date | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [location, setLocation] = useState('');
  const [visibility, setVisibility] = useState(VISIBILITY_OPTIONS[0]);
  const [otherVisibility, setOtherVisibility] = useState('');
  const [objects, setObjects] = useState<string[]>([]);
  const [objectInput, setObjectInput] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [triedSubmit, setTriedSubmit] = useState(false);
  const { addEntry } = useEntries();
  const router = useRouter();

  const addObject = () => {
    if (objectInput.trim() && !objects.includes(objectInput.trim())) {
      setObjects([...objects, objectInput.trim()]);
      setObjectInput('');
    }
  };

  const requiredFieldsFilled = title.trim() && date && location.trim();

  const handleDone = () => {
    setTriedSubmit(true);
    if (!requiredFieldsFilled) {
      Alert.alert('Missing required fields', 'Please fill in all required fields.');
      return;
    }
    // Create a new entry object
    const newEntry = {
      id: Date.now().toString(),
      title,
      date: date!.toISOString().substring(0, 10),
      time: time ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
      location,
      visibility: visibility === 'Other' ? otherVisibility : visibility,
      objects,
      images,
      description,
    };
    addEntry(newEntry);
    // Redirect to home page
    router.replace('/');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      {/* Top bar with Back and Done button */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
          <Text style={styles.backButtonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.doneButton, !requiredFieldsFilled && styles.doneButtonDisabled]}
          onPress={handleDone}
          disabled={!requiredFieldsFilled}
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.label}>Title <Text style={styles.required}>*</Text></Text>
      <TextInput
        style={[styles.input, triedSubmit && !title.trim() && styles.inputError]}
        value={title}
        onChangeText={setTitle}
        placeholder="Entry title"
        placeholderTextColor="#aaa"
      />

      {/* Date */}
      <Text style={styles.label}>Date <Text style={styles.required}>*</Text></Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={[styles.input, triedSubmit && !date && styles.inputError]}>
        <Text style={{ color: date ? '#fff' : '#aaa' }}>
          {date ? date.toLocaleDateString() : 'Select date'}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date || new Date()}
          mode="date"
          display="default"
          onChange={(_, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      {/* Time */}
      <Text style={styles.label}>Time</Text>
      <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.input}>
        <Text style={{ color: time ? '#fff' : '#aaa' }}>
          {time ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Select time'}
        </Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={time || new Date()}
          mode="time"
          display="default"
          onChange={(_, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) setTime(selectedTime);
          }}
        />
      )}

      {/* Location */}
      <Text style={styles.label}>Location <Text style={styles.required}>*</Text></Text>
      <TextInput
        style={[styles.input, triedSubmit && !location.trim() && styles.inputError]}
        value={location}
        onChangeText={setLocation}
        placeholder="Enter location"
        placeholderTextColor="#aaa"
      />

      {/* Visibility */}
      <Text style={styles.label}>Visibility</Text>
      <View style={styles.dropdown}>
        {VISIBILITY_OPTIONS.map(opt => (
          <TouchableOpacity
            key={opt}
            onPress={() => setVisibility(opt)}
            style={[styles.dropdownItem, visibility === opt && styles.dropdownItemSelected]}
          >
            <Text style={{ color: '#fff' }}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {visibility === 'Other' && (
        <TextInput
          style={styles.input}
          value={otherVisibility}
          onChangeText={setOtherVisibility}
          placeholder="Enter custom weather condition"
          placeholderTextColor="#aaa"
        />
      )}

      {/* Objects */}
      <Text style={styles.label}>Objects</Text>
      <View style={styles.objectRow}>
        {objects.map(obj => (
          <View key={obj} style={styles.objectTag}>
            <Text style={styles.objectText}>{obj}</Text>
          </View>
        ))}
        <TextInput
          style={[styles.input, { flex: 1, minWidth: 80, marginRight: 8 }]}
          value={objectInput}
          onChangeText={setObjectInput}
          placeholder="Add object"
          placeholderTextColor="#aaa"
          onSubmitEditing={addObject}
        />
        <TouchableOpacity onPress={addObject} style={styles.addObjectButton}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>+ Object</Text>
        </TouchableOpacity>
      </View>

      {/* Description */}
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.textArea}
        value={description}
        onChangeText={setDescription}
        placeholder="Talk about what you saw..."
        placeholderTextColor="#aaa"
        multiline
        numberOfLines={5}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a0d2e' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  doneButton: { backgroundColor: '#3a2459', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 8 },
  doneButtonDisabled: { opacity: 0.5 },
  doneButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  label: { color: '#fff', fontSize: 16, marginTop: 12, marginBottom: 4 },
  required: { color: 'red' },
  input: { backgroundColor: '#3a2459', color: '#fff', borderRadius: 8, padding: 10, marginBottom: 4, fontSize: 16 },
  inputError: { borderColor: 'red', borderWidth: 2 },
  dropdown: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4 },
  dropdownItem: { backgroundColor: '#3a2459', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12, marginRight: 8, marginBottom: 4 },
  dropdownItemSelected: { borderWidth: 2, borderColor: '#fff' },
  objectRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 },
  objectTag: { backgroundColor: '#fff2', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, marginRight: 8, marginBottom: 4 },
  objectText: { color: '#fff', fontSize: 14 },
  addObjectButton: { backgroundColor: '#3a2459', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12 },
  textArea: { backgroundColor: '#3a2459', color: '#fff', borderRadius: 8, padding: 10, fontSize: 16, minHeight: 100, textAlignVertical: 'top', marginTop: 4 },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 4,
  },
});