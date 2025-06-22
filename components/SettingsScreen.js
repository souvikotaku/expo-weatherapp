import { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const [unit, setUnit] = useState('metric');

  useEffect(() => {
    const loadUnit = async () => {
      const savedUnit = await AsyncStorage.getItem('tempUnit');
      if (savedUnit) setUnit(savedUnit);
    };
    loadUnit();
  }, []);

  const toggleUnit = async () => {
    const newUnit = unit === 'metric' ? 'imperial' : 'metric';
    setUnit(newUnit);
    await AsyncStorage.setItem('tempUnit', newUnit);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.settingsItem}>
        <Text style={styles.settingsText}>Temperature Unit</Text>
        <Button
          title={unit === 'metric' ? 'Celsius' : 'Fahrenheit'}
          onPress={toggleUnit}
          color='#ff00ff'
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00ffff',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: '#ff00ff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  settingsItem: {
    backgroundColor: '#2a2a4a',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#00ffff',
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingsText: {
    fontSize: 18,
    color: '#ffffff',
    textShadowColor: '#ff00ff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
});
