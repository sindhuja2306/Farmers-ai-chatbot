import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getAreaInsights } from '../services/areaInsightsService';
import { maybeSendRainAlert } from '../services/rainNotificationService';

export default function HomeScreen({ userName, onOpenProfile, onOpenUpload, onOpenChat }) {
  const farmerName = userName || 'Farmer';
  const [loadingInsights, setLoadingInsights] = useState(true);
  const [insightsError, setInsightsError] = useState('');
  const [weather, setWeather] = useState(null);
  const [schemes, setSchemes] = useState([]);

  const loadInsights = useCallback(async () => {
    try {
      setLoadingInsights(true);
      setInsightsError('');
      const data = await getAreaInsights();
      setWeather(data.weather);
      setSchemes(data.schemes);
      await maybeSendRainAlert(data.weather);
    } catch (error) {
      setInsightsError(error?.message || 'Unable to load area insights.');
    } finally {
      setLoadingInsights(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadInsights();

      const refreshId = setInterval(() => {
        loadInsights();
      }, 120000);

      return () => clearInterval(refreshId);
    }, [loadInsights])
  );

  const schemesText = schemes.length ? schemes.join(', ') : 'Schemes will appear after area detection.';

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Pressable style={styles.heroCard} onPress={onOpenProfile}>
        <View style={styles.rowBetweenTop}>
          <View style={styles.heroTextWrap}>
            <Text style={styles.heroLabel}>KRISHINOVA AI</Text>
            <Text style={styles.heroTitle}>Welcome back, {farmerName}</Text>
            <Text style={styles.heroSubtitle}>Your farm assistant is ready with today’s updates.</Text>
          </View>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatarText}>👨‍🌾</Text>
          </View>
        </View>

        <View style={styles.heroStatsRow}>
          <View style={styles.heroStatChip}>
            <Text style={styles.heroStatIcon}>🌤️</Text>
            <Text style={styles.heroStatText}>
              {weather ? `${weather.temperature}°C` : '--'}
            </Text>
          </View>
          <View style={styles.heroStatChip}>
            <Text style={styles.heroStatIcon}>💧</Text>
            <Text style={styles.heroStatText}>
              {weather ? `Humidity ${weather.humidity}%` : 'Humidity --'}
            </Text>
          </View>
          <View style={styles.heroStatChip}>
            <Text style={styles.heroStatIcon}>🌾</Text>
            <Text style={styles.heroStatText}>Your Area</Text>
            <Text style={styles.heroStatTextValue}>{weather?.area || 'Detecting...'}</Text>
          </View>
        </View>
      </Pressable>

      <View style={styles.insightTopRow}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <Pressable onPress={loadInsights}>
          <Text style={styles.refreshText}>Refresh</Text>
        </Pressable>
      </View>

      {loadingInsights ? (
        <View style={styles.statusCard}>
          <ActivityIndicator color="#166534" />
          <Text style={styles.statusText}>Fetching weather and schemes for your area...</Text>
        </View>
      ) : null}

      {!loadingInsights && insightsError ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{insightsError}</Text>
        </View>
      ) : null}

      <View style={styles.quickActionsRow}>
        <Pressable style={[styles.quickActionCard, styles.quickActionPrimary]} onPress={onOpenUpload}>
          <Text style={styles.quickActionIcon}>📷</Text>
          <Text style={styles.quickActionTitle}>Upload</Text>
          <Text style={styles.quickActionSubtitle}>Crop image</Text>
        </Pressable>

        <Pressable style={[styles.quickActionCard, styles.quickActionDark]} onPress={onOpenChat}>
          <Text style={styles.quickActionIcon}>🤖</Text>
          <Text style={styles.quickActionTitleLight}>Ask AI</Text>
          <Text style={styles.quickActionSubtitleLight}>Get advice</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Today’s Insights</Text>

      <View style={styles.infoCard}>
        <View style={styles.rowBetween}>
          <View style={styles.rowStart}>
            <View style={[styles.infoIconWrap, styles.weatherIconBg]}>
              <Text style={styles.infoIcon}>⛅</Text>
            </View>
            <View>
              <Text style={styles.infoTitle}>Weather Insights</Text>
              <Text style={styles.infoCaption}>Your Area: {weather?.area || 'Detecting area'}</Text>
            </View>
          </View>
          <Text style={styles.badgeGreen}>Good</Text>
        </View>
        <Text style={styles.infoText}>
          {weather
            ? `${weather.condition}, ${weather.temperature}°C in ${weather.area}${weather.state ? `, ${weather.state}` : ''}. Wind ${weather.wind} m/s.`
            : 'Weather details will appear after location detection.'}
        </Text>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.rowBetween}>
          <View style={styles.rowStart}>
            <View style={[styles.infoIconWrap, styles.fertilizerIconBg]}>
              <Text style={styles.infoIcon}>🌱</Text>
            </View>
            <View>
              <Text style={styles.infoTitle}>Fertilizer Recommendation</Text>
              <Text style={styles.infoCaption}>Nutrient suggestion</Text>
            </View>
          </View>
          <Text style={styles.badgeAmber}>Moderate</Text>
        </View>
        <Text style={styles.infoText}>Apply balanced NPK in split doses this week and prioritize low-moisture patches first.</Text>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.rowBetween}>
          <View style={styles.rowStart}>
            <View style={[styles.infoIconWrap, styles.schemeIconBg]}>
              <Text style={styles.infoIcon}>🏛️</Text>
            </View>
            <View>
              <Text style={styles.infoTitle}>Government Schemes</Text>
              <Text style={styles.infoCaption}>Eligible programs</Text>
            </View>
          </View>
          <Text style={styles.badgeBlue}>2 New</Text>
        </View>
        <Text style={styles.infoText}>{schemesText}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  content: {
    padding: 16,
    paddingBottom: 26,
  },
  heroCard: {
    backgroundColor: '#14532D',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  rowBetweenTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroTextWrap: {
    flex: 1,
    marginRight: 12,
  },
  heroLabel: {
    fontSize: 11,
    color: '#BBF7D0',
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#DCFCE7',
    lineHeight: 20,
  },
  avatarWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
  },
  heroStatsRow: {
    flexDirection: 'row',
    marginTop: 14,
    gap: 8,
  },
  heroStatChip: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroStatIcon: {
    fontSize: 14,
    marginBottom: 2,
  },
  heroStatText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ECFDF5',
  },
  heroStatTextValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#DCFCE7',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 10,
    marginTop: 2,
  },
  insightTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  refreshText: {
    color: '#166534',
    fontSize: 13,
    fontWeight: '700',
  },
  statusCard: {
    backgroundColor: '#ECFDF3',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusText: {
    marginLeft: 8,
    fontSize: 13,
    color: '#166534',
    flex: 1,
  },
  errorCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: 10,
  },
  errorText: {
    color: '#991B1B',
    fontSize: 13,
    lineHeight: 18,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  quickActionCard: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickActionPrimary: {
    backgroundColor: '#FFFFFF',
  },
  quickActionDark: {
    backgroundColor: '#1F2937',
    borderColor: '#1F2937',
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  quickActionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  quickActionTitleLight: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  quickActionSubtitleLight: {
    fontSize: 13,
    color: '#D1D5DB',
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 10,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  rowStart: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  weatherIconBg: {
    backgroundColor: '#E0F2FE',
  },
  fertilizerIconBg: {
    backgroundColor: '#DCFCE7',
  },
  schemeIconBg: {
    backgroundColor: '#EDE9FE',
  },
  infoIcon: {
    fontSize: 20,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  infoCaption: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 1,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
  },
  badgeGreen: {
    fontSize: 11,
    fontWeight: '700',
    color: '#166534',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeAmber: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeBlue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3730A3',
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
});
