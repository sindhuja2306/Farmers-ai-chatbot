import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

/**
 * @param {{
 *  title: string,
 *  onPress: () => void,
 *  loading?: boolean,
 *  variant?: 'primary' | 'secondary',
 *  disabled?: boolean,
 *  style?: import('react-native').StyleProp<import('react-native').ViewStyle>
 * }} props
 */
export default function Button({ title, onPress, loading = false, variant = 'primary', disabled = false, style }) {
  const isPrimary = variant === 'primary';
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        isPrimary ? styles.primaryButton : styles.secondaryButton,
        pressed && !isDisabled ? styles.pressed : null,
        isDisabled ? styles.disabled : null,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#FFFFFF' : '#14532D'} />
      ) : (
        <Text style={[styles.text, isPrimary ? styles.primaryText : styles.secondaryText]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  primaryButton: {
    backgroundColor: '#16A34A',
  },
  secondaryButton: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#14532D',
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
});
