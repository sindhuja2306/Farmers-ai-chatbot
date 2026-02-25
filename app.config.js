import 'dotenv/config';

/** @param {{ config: any }} param0 */
export default ({ config }) => ({
  ...config,
  extra: {
    ...(config.extra || {}),
    openWeatherApiKey: process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY || '',
    geminiApiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY || '',
  },
});
