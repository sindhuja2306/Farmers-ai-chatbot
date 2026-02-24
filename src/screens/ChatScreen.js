import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Button from '../components/Button';

const INITIAL_MESSAGES = [
  { id: '1', sender: 'ai', text: 'Namaste! Ask me about crops, pests, or irrigation.' },
];

export default function ChatScreen() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [chatInput, setChatInput] = useState('');

  const handleSend = () => {
    const trimmed = chatInput.trim();
    if (!trimmed) {
      return;
    }

    const userMessage = {
      id: `${Date.now()}-user`,
      sender: 'user',
      text: trimmed,
    };
    const aiReply = {
      id: `${Date.now()}-ai`,
      sender: 'ai',
      text: 'For better yield, irrigate early morning and monitor leaf color weekly.',
    };

    setMessages((prev) => [...prev, userMessage, aiReply]);
    setChatInput('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.heading}>Chat Assistant</Text>
        <Text style={styles.subheading}>KrishiNova AI is ready to help.</Text>

        <View style={styles.chatCard}>
          {messages.map((message) => (
            <View
              key={message.id}
              style={[styles.bubble, message.sender === 'user' ? styles.userBubble : styles.aiBubble]}
            >
              <Text
                style={[
                  styles.bubbleText,
                  message.sender === 'user' ? styles.userText : styles.aiText,
                ]}
              >
                {message.text}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.inputRow}>
        <TextInput
          value={chatInput}
          onChangeText={setChatInput}
          placeholder="Type your question..."
          placeholderTextColor="#6B7280"
          style={styles.input}
        />
        <View style={styles.sendButton}>
          <Button title="Send" onPress={handleSend} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F0FDF4',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 18,
    paddingBottom: 24,
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
  chatCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    padding: 16,
  },
  bubble: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 10,
    maxWidth: '90%',
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#DCFCE7',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#16A34A',
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 22,
  },
  aiText: {
    color: '#14532D',
  },
  userText: {
    color: '#FFFFFF',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 18,
    paddingBottom: Platform.OS === 'ios' ? 18 : 12,
    paddingTop: 10,
    backgroundColor: '#F0FDF4',
    borderTopWidth: 1,
    borderTopColor: '#BBF7D0',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#86EFAC',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#14532D',
  },
  sendButton: {
    width: 110,
  },
});
