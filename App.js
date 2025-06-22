import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useState, useEffect } from 'react';

const Stack = createNativeStackNavigator();

// List of Indian cities
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

// Home Screen with city list
function HomeScreen({ navigation }) {
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
      <FlatList
        data={cities}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

// Weather Screen to display forecast
function WeatherScreen({ route }) {
  const { city } = route.params;
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Replace with your OpenWeatherMap API key
  const API_KEY = '7353020ee6b5ea4e932e98307c3b700e'; // Sign up at https://openweathermap.org/api
  const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${API_KEY}&units=metric`;

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('City not found or API error');
        }
        const data = await response.json();
        setWeatherData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchWeather();
  }, [city]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading weather data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather in {city}</Text>
      <Text style={styles.weatherText}>
        Temperature: {weatherData.main.temp}°C
      </Text>
      <Text style={styles.weatherText}>
        Weather: {weatherData.weather[0].description}
      </Text>
      <Text style={styles.weatherText}>
        Humidity: {weatherData.main.humidity}%
      </Text>
      <Text style={styles.weatherText}>
        Wind Speed: {weatherData.wind.speed} m/s
      </Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen
          name='Home'
          component={HomeScreen}
          options={{ title: 'Indian Cities' }}
        />
        <Stack.Screen
          name='Weather'
          component={WeatherScreen}
          options={({ route }) => ({ title: route.params.city })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  list: {
    paddingBottom: 20,
  },
  cityItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    elevation: 2,
  },
  cityText: {
    fontSize: 18,
    color: '#333',
  },
  weatherText: {
    fontSize: 18,
    marginVertical: 5,
    color: '#333',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#ff0000',
  },
});
