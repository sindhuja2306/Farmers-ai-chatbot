import { Pressable, StyleSheet, Text } from 'react-native';

/**
 * @param {{
 *  title: string,
 *  onPress: () => void,
 *  variant?: 'primary' | 'secondary',
 *  disabled?: boolean
 * }} props
 */
export default function Button({ title, onPress, variant = 'primary', disabled = false }) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        isPrimary ? styles.primaryButton : styles.secondaryButton,
        pressed && !disabled ? styles.pressed : null,
        disabled ? styles.disabled : null,
      ]}
    >
      <Text style={[styles.text, isPrimary ? styles.primaryText : styles.secondaryText]}>{title}</Text>
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
