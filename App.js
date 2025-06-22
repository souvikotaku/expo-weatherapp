import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './components/HomeScreen';
import WeatherScreen from './components/WeatherScreen';
import SettingsScreen from './components/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Home'
        screenOptions={{
          headerStyle: {
            backgroundColor: 'yellow', // Cyberpunk dark background
          },
          headerTintColor: 'black', // Neon cyan title
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
        }}
      >
        <Stack.Screen
          name='Home'
          component={HomeScreen}
          options={({ navigation }) => ({
            headerShown: true,
            headerTitle: () => (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 10,
                  paddingVertical: 20,
                  height: 60,
                }}
              >
                <Text
                  style={{
                    color: 'black',
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}
                >
                  Indian Cities Weather
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    console.log('Settings icon pressed');
                    navigation.navigate('Settings');
                  }}
                  style={{
                    height: 25,
                  }}
                >
                  <Ionicons
                    name='settings-outline'
                    size={25}
                    color='black'
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                  />
                </TouchableOpacity>
              </View>
            ),
          })}
        />
        <Stack.Screen
          name='Weather'
          component={WeatherScreen}
          options={({ route }) => ({
            title: route.params.city,
            headerTitleStyle: { color: 'black' },
          })}
        />
        <Stack.Screen
          name='Settings'
          component={SettingsScreen}
          options={{
            title: 'Settings',
            headerTitleStyle: { color: 'black' },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
