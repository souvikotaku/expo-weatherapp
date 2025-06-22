import { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
} from 'react-native';
import * as Location from 'expo-location';

const cities = [
  'Delhi',
  'Mumbai',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
];

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCities, setFilteredCities] = useState(cities);

  useEffect(() => {
    setFilteredCities(
      cities.filter((city) =>
        city.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery]);

  const getLocationWeather = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to fetch your weather.'
        );
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=7353020ee6b5ea4e932e98307c3b700e`
      );
      const data = await response.json();
      if (data && data[0]) {
        navigation.navigate('Weather', { city: data[0].name });
      } else {
        Alert.alert('Error', 'Could not determine city from location.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch location. Please try again.');
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.cityItem}
      onPress={() => navigation.navigate('Weather', { city: item })}
    >
      <Text style={styles.cityText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a City</Text>
      <TextInput
        style={styles.searchInput}
        placeholder='Search city...'
        placeholderTextColor='#00ffff'
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={() => {
          if (filteredCities.length > 0) {
            navigation.navigate('Weather', { city: filteredCities[0] });
          } else {
            Alert.alert('Error', 'No matching city found.');
          }
        }}
      />
      <FlatList
        data={filteredCities}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.list}
      />
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
  searchInput: {
    backgroundColor: '#2a2a4a',
    color: '#00ffff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ff00ff',
    shadowColor: '#ff00ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
  },
  list: {
    paddingBottom: 20,
  },
  cityItem: {
    backgroundColor: '#2a2a4a',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#00ffff',
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 4,
  },
  cityText: {
    fontSize: 18,
    color: '#ffffff',
    textShadowColor: '#00ffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
});
