import { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WeatherScreen({ route, navigation }) {
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
          color='#ff00ff'
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
      <TouchableOpacity
        onPress={toggleUnit}
        style={{
          backgroundColor: '#6200ee',
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 10,
          alignSelf: 'center',
          marginVertical: 10,
        }}
      >
        <Text style={{ color: 'yellow', fontSize: 16, fontWeight: 'bold' }}>
          Switch to {unit === 'metric' ? 'Fahrenheit' : 'Celsius'}
        </Text>
      </TouchableOpacity>
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
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'yellow',
    marginVertical: 10,
    // textShadowColor: '#00ffff',
    // textShadowOffset: { width: 0, height: 0 },
    // textShadowRadius: 8,
  },
  weatherCard: {
    backgroundColor: '#2a2a4a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#00ffff',
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 4,
  },
  weatherText: {
    fontSize: 18,
    color: '#ffffff',
    marginVertical: 5,
    textShadowColor: '#ff00ff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  forecastList: {
    paddingVertical: 10,
  },
  forecastItem: {
    backgroundColor: '#2a2a4a',
    padding: 10,
    marginRight: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ff00ff',
    shadowColor: '#ff00ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 4,
    minWidth: 120,
  },
  forecastText: {
    fontSize: 16,
    color: '#ffffff',
    textShadowColor: '#00ffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#00ffff',
    textShadowColor: '#ff00ff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#ff0000',
    marginBottom: 20,
    textShadowColor: '#00ffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
});
