import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';

export default function ProfileScreen({ userPhone, userName, onBack, onLogout }) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>My Profile</Text>
      <Text style={styles.subheading}>Manage your account and farm details</Text>

      <View style={styles.card}>
        <Text style={styles.name}>{userName || 'Farmer'}</Text>
        <Text style={styles.info}>📞 +91 {userPhone}</Text>
        <Text style={styles.info}>📍 Nashik, Maharashtra</Text>
        <Text style={styles.info}>🌾 Main Crops: Tomato, Onion, Wheat</Text>
        <Text style={styles.info}>📐 Land Size: 4.5 Acres</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        <Text style={styles.info}>• Language: English / Hindi / Marathi</Text>
        <Text style={styles.info}>• Notifications: Enabled</Text>
        <Text style={styles.info}>• AI Advisory Plan: Basic</Text>
      </View>

      <View style={styles.buttonSpacing}>
        <Button title="Back to Home" onPress={onBack} />
      </View>
      <View style={styles.buttonSpacing}>
        <Button title="Logout" onPress={onLogout} variant="secondary" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F0FDF4',
  },
  content: {
    padding: 18,
    paddingBottom: 34,
  },
  heading: {
    fontSize: 30,
    fontWeight: '800',
    color: '#14532D',
  },
  subheading: {
    marginTop: 6,
    marginBottom: 16,
    fontSize: 16,
    color: '#166534',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#166534',
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: '#14532D',
    marginBottom: 8,
  },
  info: {
    fontSize: 16,
    color: '#14532D',
    lineHeight: 24,
  },
  buttonSpacing: {
    marginTop: 10,
  },
});
