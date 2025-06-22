##Indian Cities Weather App
Welcome to the Indian Cities Weather App, a cyberpunk-themed React Native application built with Expo. This app provides real-time weather updates and a 5-day forecast for selected Indian cities, featuring animated weather icons and a neon-inspired design.
Features

Weather Display: Shows current temperature, humidity, wind speed, and conditions.
5-Day Forecast: Horizontal scrollable forecast with animated icons.
Unit Toggle: Switch between Celsius and Fahrenheit.
Cyberpunk Aesthetic: Neon cyan (#00ffff) and pink (#ff00ff) styling on a dark background (#1a1a2e).
Custom Splash Screen: Displays a neon weather icon during app startup.
Settings Navigation: Accessible via a gear icon in the header.

Tech Stack

Framework: React Native with Expo (~51.0.28)
Navigation: @react-navigation/native and @react-navigation/native-stack
Icons: @expo/vector-icons and react-native-animatable for weather animations
API: OpenWeatherMap API
Styling: Native StyleSheet with cyberpunk theme

Prerequisites

Node.js (v18+ recommended)
npm or yarn
Expo Go app (for testing) or an emulator
Internet connection (for API calls)

Installation

Clone the Repository:
git clone https://github.com/your-username/indian-cities-weather-app.git
cd indian-cities-weather-app


Install Dependencies:
npm install
# or
yarn install


Configure API Key:

Obtain an API key from OpenWeatherMap.
Update the API_KEY constant in components/WeatherScreen.js with your key.


Run the App:

Start the Expo development server:npx expo start


Open on:
Expo Go (scan QR code with your phone).
Emulator (e.g., Android Studio or Xcode).
Web (npx expo start --web).





Usage

Home Screen: Select a city to view weather details.
Weather Screen: Displays current weather and forecast; toggle units via the button.
Settings Screen: Accessible via the gear icon (currently a placeholder).
Splash Screen: See the custom neon icon during app launch.

Project Structure
indian-cities-weather-app/
├── assets/              # Splash screen and app icons
├── components/          # Screen components (HomeScreen.js, WeatherScreen.js, SettingsScreen.js)
├── App.js              # Navigation and app configuration
├── app.json            # Expo configuration (splash screen, icons)
├── package.json        # Dependencies and scripts
└── README.md           # This file

Contributing

Fork the repository.
Create a feature branch (git checkout -b feature-name).
Commit changes (git commit -m "Add feature").
Push to the branch (git push origin feature-name).
Open a Pull Request.

Issues

Report bugs or suggest features via GitHub Issues.
Common fixes:
Clear cache: npx expo start --clear.
Reinstall dependencies if modules are unresolved.



License
This project is licensed under the MIT License. See the LICENSE file for details (add a LICENSE file if not present).
Acknowledgments

xAI: For Grok 3 assistance in building this app.
OpenWeatherMap: For weather API services.
Expo: For the React Native development platform.

Screenshots
(Add screenshots of the app here after testing. Use Markdown image syntax:)
![Home Screen](./screenshots/home-screen.png)
![Weather Screen](./screenshots/weather-screen.png)
![Splash Screen](./screenshots/splash-screen.png)

(Create a screenshots folder and add images later.)
Contact

GitHub: your-username
Email: your-email@example.com (optional)
