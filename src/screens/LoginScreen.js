import { KeyboardAvoidingView, Platform, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useMemo, useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';

/**
 * @param {{ onLogin: (phone: string, name: string) => void }} props
 */
export default function LoginScreen({ onLogin }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');

  const sanitizedPhone = useMemo(() => phone.replace(/\D/g, ''), [phone]);
  const isPhoneValid = sanitizedPhone.length === 10;
  const isOtpValid = otp.length === 6;

  const handleSendOtp = () => {
    if (!isPhoneValid) {
      return;
    }
    // Simulate OTP sent
    setStep('otp');
  };

  const handleVerifyOtp = () => {
    if (!isOtpValid) {
      return;
    }
    // Simulate OTP verified
    const userName = mode === 'signup' ? name : 'Farmer';
    onLogin(sanitizedPhone, userName);
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setStep('phone');
    setOtp('');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.full}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.brandCircle}>
            <Text style={styles.brandEmoji}>🌱</Text>
          </View>
          <Text style={styles.title}>KrishiNova AI</Text>
          <Text style={styles.subtitle}>AI-powered farming support in your language</Text>

          <View style={styles.card}>
            {/* Mode Toggle */}
            <View style={styles.modeToggle}>
              <Pressable
                style={[styles.modeButton, mode === 'login' && styles.modeButtonActive]}
                onPress={() => mode !== 'login' && toggleMode()}
              >
                <Text style={[styles.modeText, mode === 'login' && styles.modeTextActive]}>Login</Text>
              </Pressable>
              <Pressable
                style={[styles.modeButton, mode === 'signup' && styles.modeButtonActive]}
                onPress={() => mode !== 'signup' && toggleMode()}
              >
                <Text style={[styles.modeText, mode === 'signup' && styles.modeTextActive]}>Signup</Text>
              </Pressable>
            </View>

            {step === 'phone' ? (
              <>
                {mode === 'signup' && (
                  <View style={styles.inputSpacing}>
                    <Input
                      label="Full Name"
                      value={name}
                      onChangeText={setName}
                      placeholder="Enter your name"
                    />
                  </View>
                )}

                <View style={styles.inputSpacing}>
                  <Input
                    label="Mobile Number"
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="+91 XXXXXXXXXX"
                    keyboardType="phone-pad"
                    maxLength={10}
                  />
                </View>

                <View style={styles.buttonSpacing}>
                  <Button
                    title={isPhoneValid ? 'Send OTP' : 'Enter valid mobile'}
                    onPress={handleSendOtp}
                    disabled={!isPhoneValid || (mode === 'signup' && !name.trim())}
                  />
                </View>
              </>
            ) : (
              <>
                <Text style={styles.otpInfo}>
                  📱 OTP sent to +91 {sanitizedPhone}
                </Text>

                <View style={styles.inputSpacing}>
                  <Input
                    label="Enter OTP"
                    value={otp}
                    onChangeText={setOtp}
                    placeholder="6-digit OTP"
                    keyboardType="number-pad"
                    maxLength={6}
                  />
                </View>

                <View style={styles.buttonSpacing}>
                  <Button
                    title={isOtpValid ? 'Verify & Continue' : 'Enter 6-digit OTP'}
                    onPress={handleVerifyOtp}
                    disabled={!isOtpValid}
                  />
                </View>

                <Pressable onPress={() => setStep('phone')} style={styles.backButton}>
                  <Text style={styles.backText}>← Change Number</Text>
                </Pressable>
              </>
            )}

            <Text style={styles.note}>📱 Demo Mode: Use any 10-digit number</Text>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  full: {
    flex: 1,
    backgroundColor: '#F0FDF4',
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  brandCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  brandEmoji: {
    fontSize: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#14532D',
  },
  subtitle: {
    fontSize: 16,
    color: '#166534',
    marginTop: 6,
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  modeButtonActive: {
    backgroundColor: '#16A34A',
  },
  modeText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#166534',
  },
  modeTextActive: {
    color: '#FFFFFF',
  },
  inputSpacing: {
    marginBottom: 12,
  },
  buttonSpacing: {
    marginTop: 14,
  },
  otpInfo: {
    fontSize: 15,
    color: '#166534',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
  backButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  backText: {
    fontSize: 14,
    color: '#16A34A',
    fontWeight: '600',
  },
  note: {
    marginTop: 12,
    fontSize: 13,
    color: '#15803D',
    textAlign: 'center',
    fontWeight: '600',
  },
});
