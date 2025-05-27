import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { EntriesProvider } from '../data/EntriesContext';

export default function Layout() {
  return (
    <EntriesProvider>
      <Tabs
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'ellipse';
            if (route.name === 'index') {
              iconName = 'home-outline';
            } else if (route.name === 'entry/new') {
              iconName = 'add-circle-outline';
            } else if (route.name === 'help') {
              iconName = 'help-circle-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: '#aaa',
          tabBarStyle: { backgroundColor: '#2d1457' },
        })}
      >
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="entry/new" options={{ title: 'New Entry' }} />
        <Tabs.Screen name="help" options={{ title: 'Help' }} />
      </Tabs>
    </EntriesProvider>
  );
}