import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function HelpScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Star Journal!</Text>
      <Text style={styles.subtitle}>
        This app helps you log your stargazing observations and enhance your night sky photos.
      </Text>

      <Text style={styles.sectionTitle}>Feature breakdown:</Text>

      {/* Journal Entries Section */}
      <View style={styles.featureBox}>
        <Text style={styles.featureHeader}>Journal entries</Text>
        <View style={styles.row}>
          <View style={styles.iconTextBox}>
            <Ionicons name="document-text-outline" size={32} color="#fff" style={styles.icon} />
            <Text style={styles.featureText}>Write notes and include photos of your observations. Include weather conditions, planetary objects, and more.</Text>
          </View>
          <View style={styles.iconTextBox}>
            <Ionicons name="image-outline" size={32} color="#fff" style={styles.icon} />
            <Text style={styles.featureText}>Freely edit entries and view by date. We'll keep track of your acheivements, such as # entries.</Text>
          </View>
        </View>
      </View>

      {/* Photo Editor Section */}
      <View style={styles.featureBox}>
        <Text style={styles.featureHeader}>Photo Editor</Text>
        <View style={styles.row}>
          <View style={styles.iconTextBox}>
            <Ionicons name="document-text-outline" size={32} color="#fff" style={styles.icon} />
            <Text style={styles.featureText}>Upload photos of the night sky for automatic enhancement.</Text>
          </View>
          <View style={styles.iconTextBox}>
            <Ionicons name="image-outline" size={32} color="#fff" style={styles.icon} />
            <Text style={styles.featureText}>Easily adjust settings to make stars and other planetary objects more visible..</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a0d2e',
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: { color: '#fff', fontSize: 16, marginBottom: 24, textAlign: 'center' },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  featureBox: {
    backgroundColor: '#3a2459',
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
  },
  featureHeader: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  iconTextBox: { flex: 1, alignItems: 'center', marginHorizontal: 4 },
  icon: { marginBottom: 4 },
  featureText: { color: '#fff', fontSize: 14, textAlign: 'center', marginBottom: 8 },
  section: {
    marginBottom: 24,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#3a2459',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});