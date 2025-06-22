import * as React from 'react';
import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();

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

function HomeScreen({ navigation }) {
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
      {/* Fallback Settings Button */}
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => navigation.navigate('Settings')}
      >
        <Ionicons name='settings-outline' size={24} color='#fff' />
        <Text style={styles.settingsButtonText}>Go to Settings</Text>
      </TouchableOpacity>
      <FlatList
        data={filteredCities}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

function WeatherScreen({ route, navigation }) {
  const { city } = route.params;
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('metric');

  const API_KEY = '7353020ee6b5ea4e932e98307c3b700e';
  const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unit}`;
  const FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=${unit}`;

  useEffect(() => {
    const loadUnit = async () => {
      const savedUnit = await AsyncStorage.getItem('tempUnit');
      if (savedUnit) setUnit(savedUnit);
    };
    loadUnit();
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const weatherResponse = await fetch(WEATHER_API_URL);
        if (!weatherResponse.ok) {
          throw new Error('Invalid city or API error');
        }
        const weatherData = await weatherResponse.json();
        setWeatherData(weatherData);

        const forecastResponse = await fetch(FORECAST_API_URL);
        if (!forecastResponse.ok) {
          throw new Error('Forecast API error');
        }
        const forecastData = await forecastResponse.json();
        const dailyForecast = forecastData.list
          .filter((item) => item.dt_txt.includes('12:00:00'))
          .slice(0, 5);
        setForecastData(dailyForecast);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchWeather();
  }, [city, unit]);

  const toggleUnit = async () => {
    const newUnit = unit === 'metric' ? 'imperial' : 'metric';
    setUnit(newUnit);
    await AsyncStorage.setItem('tempUnit', newUnit);
  };

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
        <Button
          title='Try Again'
          onPress={() => navigation.navigate('Weather', { city })}
          color='#6200ee'
        />
      </View>
    );
  }

  const renderForecastItem = ({ item }) => (
    <View style={styles.forecastItem}>
      <Text style={styles.forecastText}>
        {new Date(item.dt * 1000).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        })}
      </Text>
      <Text style={styles.forecastText}>
        Temp: {item.main.temp}°{unit === 'metric' ? 'C' : 'F'}
      </Text>
      <Text style={styles.forecastText}>{item.weather[0].description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather in {city}</Text>
      <View style={styles.weatherCard}>
        <Text style={styles.weatherText}>
          Temperature: {weatherData.main.temp}°{unit === 'metric' ? 'C' : 'F'}
        </Text>
        <Text style={styles.weatherText}>
          Condition: {weatherData.weather[0].description}
        </Text>
        <Text style={styles.weatherText}>
          Humidity: {weatherData.main.humidity}%
        </Text>
        <Text style={styles.weatherText}>
          Wind Speed: {weatherData.wind.speed}{' '}
          {unit === 'metric' ? 'm/s' : 'mph'}
        </Text>
      </View>
      <Button
        title={`Switch to ${unit === 'metric' ? 'Fahrenheit' : 'Celsius'}`}
        onPress={toggleUnit}
        color='#6200ee'
      />
      <Text style={styles.subtitle}>5-Day Forecast</Text>
      <FlatList
        data={forecastData}
        renderItem={renderForecastItem}
        keyExtractor={(item) => item.dt.toString()}
        horizontal
        contentContainerStyle={styles.forecastList}
      />
    </View>
  );
}

function SettingsScreen() {
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
          color='#6200ee'
        />
      </View>
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
          options={({ navigation }) => ({
            title: 'Indian Cities',
            headerShown: true,
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('Settings')}
                style={{ paddingHorizontal: 15, paddingVertical: 10 }}
              >
                <Ionicons name='settings-outline' size={24} color='#6200ee' />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name='Weather'
          component={WeatherScreen}
          options={({ route }) => ({ title: route.params.city })}
        />
        <Stack.Screen
          name='Settings'
          component={SettingsScreen}
          options={{ title: 'Settings' }}
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
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
    elevation: 2,
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
  weatherCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  weatherText: {
    fontSize: 18,
    marginVertical: 5,
    color: '#333',
  },
  forecastList: {
    paddingVertical: 10,
  },
  forecastItem: {
    backgroundColor: '#fff',
    padding: 10,
    marginRight: 10,
    borderRadius: 10,
    elevation: 2,
    minWidth: 120,
  },
  forecastText: {
    fontSize: 16,
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
    marginBottom: 20,
  },
  settingsItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingsText: {
    fontSize: 18,
    color: '#333',
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  settingsButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
});
