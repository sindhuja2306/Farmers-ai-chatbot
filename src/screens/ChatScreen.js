import { useRef, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { analyzePlantImageWithAI, getAiChatReply } from '../services/aiService';

const INITIAL_MESSAGES = [
  { id: '1', sender: 'ai', text: 'Namaste! Ask me about crops, pests, or irrigation.' },
];

export default function ChatScreen() {
  const scrollRef = useRef(/** @type {import('react-native').ScrollView | null} */ (null));
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollToEnd({ animated: true });
      }
    }, 80);
  };

  const handleSend = async () => {
    const trimmed = chatInput.trim();
    if (!trimmed || isLoading) {
      return;
    }

    const userMessage = {
      id: `${Date.now()}-user`,
      sender: 'user',
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setChatInput('');
    setIsLoading(true);
    scrollToBottom();

    let aiText = '';
    try {
      aiText = await getAiChatReply(trimmed);
    } catch (error) {
      aiText = error instanceof Error ? error.message : 'Unable to get AI response right now.';
    }

    const aiReply = {
      id: `${Date.now()}-ai`,
      sender: 'ai',
      text: aiText,
    };

    setMessages((prev) => [...prev, aiReply]);
    setIsLoading(false);
    scrollToBottom();
  };

  const formatAnalysisReply = (analysisResult) => {
    return [
      `Disease: ${analysisResult.diseaseName}`,
      `Severity: ${analysisResult.severity}`,
      `Confidence: ${analysisResult.confidence}`,
      `Treatment: ${analysisResult.treatmentPlan}`,
    ].join('\n');
  };

  const handleUploadImage = async () => {
    if (isAnalyzingImage || isLoading) {
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Required', 'Gallery permission is needed to upload a crop image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.length) {
      return;
    }

    const selectedImageUri = result.assets[0].uri;
    const userImageMessage = {
      id: `${Date.now()}-user-image`,
      sender: 'user',
      text: 'Please check this leaf/plant image for disease.',
      imageUri: selectedImageUri,
    };

    setMessages((prev) => [...prev, userImageMessage]);
    setIsAnalyzingImage(true);
    scrollToBottom();

    let aiText = '';
    try {
      const analysisResult = await analyzePlantImageWithAI(selectedImageUri);
      aiText = formatAnalysisReply(analysisResult);
    } catch (error) {
      aiText = error instanceof Error ? error.message : 'Unable to analyze image right now.';
    }

    const aiReply = {
      id: `${Date.now()}-ai-image`,
      sender: 'ai',
      text: aiText,
    };

    setMessages((prev) => [...prev, aiReply]);
    setIsAnalyzingImage(false);
    scrollToBottom();
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        ref={scrollRef}
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Chat Assistant</Text>
        <Text style={styles.subheading}>KrishiNova AI is ready to help.</Text>

        <View style={styles.chatContainer}>
          {messages.map((message) => (
            <View
              key={message.id}
              style={[styles.bubble, message.sender === 'user' ? styles.userBubble : styles.aiBubble]}
            >
                {message.imageUri ? <Image source={{ uri: message.imageUri }} style={styles.bubbleImage} /> : null}
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
          {isLoading ? (
            <View style={[styles.bubble, styles.aiBubble]}>
              <Text style={[styles.bubbleText, styles.aiText]}>KrishiNova AI is typing...</Text>
            </View>
          ) : null}
          {isAnalyzingImage ? (
            <View style={[styles.bubble, styles.aiBubble]}>
              <Text style={[styles.bubbleText, styles.aiText]}>Analyzing plant image...</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <View style={styles.inputRow}>
        <Pressable style={styles.voiceButton} onPress={handleUploadImage}>
          <Text style={styles.voiceIcon}>🖼️</Text>
        </Pressable>
        <TextInput
          value={chatInput}
          onChangeText={setChatInput}
          placeholder="Type your question..."
          placeholderTextColor="#6B7280"
          style={styles.input}
          multiline
        />
        <Pressable style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendIcon}>➤</Text>
        </Pressable>
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
    fontSize: 28,
    fontWeight: '800',
    color: '#14532D',
  },
  subheading: {
    marginTop: 6,
    marginBottom: 16,
    fontSize: 16,
    color: '#166534',
  },
  chatContainer: {
    paddingTop: 6,
  },
  bubble: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 10,
    maxWidth: '82%',
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
  bubbleImage: {
    width: 180,
    height: 140,
    borderRadius: 10,
    marginBottom: 8,
  },
  aiText: {
    color: '#14532D',
  },
  userText: {
    color: '#FFFFFF',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 18,
    paddingBottom: Platform.OS === 'ios' ? 18 : 12,
    paddingTop: 10,
    backgroundColor: '#F0FDF4',
    borderTopWidth: 1,
    borderTopColor: '#BBF7D0',
  },
  voiceButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#86EFAC',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceIcon: {
    fontSize: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#86EFAC',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#14532D',
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    marginLeft: 2,
    fontWeight: '700',
  },
});
