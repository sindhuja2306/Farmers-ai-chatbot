import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';

export default function ProfileScreen({
  userPhone,
  userName,
  onSaveProfile,
  onLogout,
}) {
  const [name, setName] = useState(userName || '');
  const [phone, setPhone] = useState(userPhone || '');

  const handleSave = () => {
    onSaveProfile({
      name,
      phone,
    });
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Farmer Profile</Text>
      <Text style={styles.subheading}>Keep your basic details updated</Text>

      <View style={styles.card}>
        <View style={styles.avatarWrap}>
          <Text style={styles.avatarText}>👨‍🌾</Text>
        </View>

        <Text style={styles.cardTitle}>Personal Details</Text>

        <View style={styles.inputSpacing}>
          <Input label="Name" value={name} onChangeText={setName} placeholder="Enter name" />
        </View>

        <View style={styles.inputSpacing}>
          <Input
            label="Phone number"
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            maxLength={10}
          />
        </View>
      </View>

      <View style={styles.buttonSpacing}>
        <Button title="Save profile" onPress={handleSave} />
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
    backgroundColor: '#F6F8FA',
  },
  content: {
    padding: 16,
    paddingBottom: 28,
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
  },
  subheading: {
    marginTop: 4,
    marginBottom: 14,
    fontSize: 14,
    color: '#6B7280',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 12,
  },
  avatarWrap: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  avatarText: {
    fontSize: 42,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  inputSpacing: {
    marginBottom: 12,
  },
  buttonSpacing: {
    marginTop: 10,
  },
});
