import * as Location from 'expo-location';
import Constants from 'expo-constants';

const WEATHER_API_KEY =
  process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY ||
  Constants?.expoConfig?.extra?.openWeatherApiKey ||
  '';

/** @type {Record<string, string[]>} */
const STATE_SCHEMES = {
  maharashtra: ['PM-KISAN', 'PM Fasal Bima Yojana', 'Mahatma Phule Karj Mukti'],
  karnataka: ['PM-KISAN', 'Raitha Siri', 'PM Fasal Bima Yojana'],
  gujarat: ['PM-KISAN', 'Ikhedut Portal Schemes', 'PM Fasal Bima Yojana'],
  punjab: ['PM-KISAN', 'Soil Health Card', 'PM Fasal Bima Yojana'],
  haryana: ['PM-KISAN', 'Meri Fasal Mera Byora', 'PM Fasal Bima Yojana'],
  default: ['PM-KISAN', 'PM Fasal Bima Yojana', 'Kisan Credit Card'],
};

/** @param {string | undefined | null} stateName */
const normalizeState = (stateName) => (stateName || '').trim().toLowerCase();

/** @param {string | undefined | null} stateName */
const pickSchemes = (stateName) => {
  const key = normalizeState(stateName);
  return STATE_SCHEMES[key] || STATE_SCHEMES.default;
};

/**
 * @param {{ city?: string | null; subregion?: string | null; district?: string | null; name?: string | null; region?: string | null }} geo
 */
const getAreaName = (geo = {}) => {
  const city = geo.city || geo.subregion || geo.district || geo.name || 'Your area';
  const state = geo.region || geo.subregion || '';
  return { city, state };
};

/** @param {string} area */
const getFallbackWeather = (area) => ({
  area,
  state: '',
  temperature: 28,
  condition: 'Weather service unavailable',
  wind: 0,
  humidity: 60,
});

export async function getAreaInsights() {
  const permission = await Location.requestForegroundPermissionsAsync();

  if (!permission.granted) {
    throw new Error('Location permission is required for area-based weather updates.');
  }

  const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
  const geocode = await Location.reverseGeocodeAsync({
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  });

  const geo = geocode[0] || {};
  const { city, state } = getAreaName(geo);

  if (!WEATHER_API_KEY) {
    throw new Error('Weather API key is missing. Restart Expo after setting EXPO_PUBLIC_OPENWEATHER_API_KEY in .env.');
  }

  const weatherResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${WEATHER_API_KEY}&units=metric`
  );

  const weatherJson = await weatherResponse.json();

  if (!weatherResponse.ok) {
    const apiMessage = weatherJson?.message || 'Unable to fetch weather data right now.';

    if (weatherResponse.status === 401) {
      return {
        weather: getFallbackWeather(city),
        schemes: pickSchemes(state),
        warning: `OpenWeather auth failed (401): ${apiMessage}`,
      };
    }

    throw new Error(`Weather API error (${weatherResponse.status}): ${apiMessage}`);
  }

  const weather = {
    area: weatherJson?.name || city,
    state,
    temperature: Math.round(weatherJson?.main?.temp ?? 0),
    condition: weatherJson?.weather?.[0]?.description || 'Unknown',
    wind: Math.round(weatherJson?.wind?.speed ?? 0),
    humidity: Math.round(weatherJson?.main?.humidity ?? 0),
  };

  const schemes = pickSchemes(state);

  return {
    weather,
    schemes,
  };
}
