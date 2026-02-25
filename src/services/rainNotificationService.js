import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

let lastRainAlertAt = 0;
const RAIN_ALERT_COOLDOWN_MS = 3 * 60 * 60 * 1000;

const isRainCondition = (condition = '') => {
  const normalized = condition.toLowerCase();
  return normalized.includes('rain') || normalized.includes('drizzle') || normalized.includes('thunderstorm');
};

/** @param {{ condition?: string; area?: string } | null | undefined} weather */
export const maybeSendRainAlert = async (weather) => {
  if (!weather || !isRainCondition(weather.condition)) {
    return;
  }

  const now = Date.now();
  if (now - lastRainAlertAt < RAIN_ALERT_COOLDOWN_MS) {
    return;
  }

  const permission = await Notifications.requestPermissionsAsync();
  if (!permission.granted) {
    return;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('rain-alerts', {
      name: 'Rain Alerts',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#16A34A',
      sound: 'default',
    });
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🌧️ Rain Alert',
      body: `Rain expected in ${weather.area || 'your area'}. Please protect crops and adjust irrigation plans.`,
      sound: true,
    },
    trigger: null,
  });

  lastRainAlertAt = now;
};
