import { StyleSheet, Text, TextInput, View } from 'react-native';

/**
 * @param {{
 *  label?: string,
 *  value: string,
 *  onChangeText: (value: string) => void,
 *  placeholder?: string,
 *  keyboardType?: import('react-native').KeyboardTypeOptions,
 *  maxLength?: number
 * }} props
 */
export default function Input({ label, value, onChangeText, placeholder, keyboardType = 'default', maxLength }) {
  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#6B7280"
        keyboardType={keyboardType}
        maxLength={maxLength}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  label: {
    color: '#14532D',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#86EFAC',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 17,
    color: '#14532D',
  },
});
