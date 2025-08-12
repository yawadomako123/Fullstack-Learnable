import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import Markdown from 'react-native-markdown-display';
import { Audio } from 'expo-av';
import { useTheme } from '../contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type Message = {
  text: string;
  type: 'user' | 'ai';
  typing?: boolean;
};

const AiScreen = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<any>(null);
  const { isDarkMode } = useTheme();
  const { q } = useLocalSearchParams();

  const bgColor = isDarkMode ? '#000' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#000';
  const inputBg = isDarkMode ? '#111' : '#f2f2f2';

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  useEffect(scrollToBottom, [messages]);

  const playTypingSound = useCallback(async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/typing.wav')
      );
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.warn('Sound error:', error);
    }
  }, []);

  useEffect(() => {
    if (isTyping) playTypingSound();
  }, [isTyping]);

  const sendMessage = async (textToSend: string) => {
    const userMessage: Message = { text: textToSend, type: 'user' };
    const aiThinking: Message = { text: 'Thinking...', type: 'ai', typing: true };

    setMessages((prev) => [...prev, userMessage, aiThinking]);
    setInput('');
    setIsTyping(true);
    Keyboard.dismiss();

    try {
      const response = await axios.post('http://192.168.8.120:5000/chat', {
        message: textToSend,
      });

      const aiReply = response.data?.message?.content || '⚠️ No response received.';
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { text: aiReply, type: 'ai' },
      ]);
    } catch (err) {
      console.error('API error:', err);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { text: '⚠️ Error: Could not reach AI.', type: 'ai' },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    sendMessage(trimmed);
  };

  useEffect(() => {
    if (q && typeof q === 'string') {
      setInput(q);
      sendMessage(q);
    }
  }, [q]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: textColor }]}>Welcome to Learnable AI</Text>
      </View>

      <KeyboardAwareScrollView
        innerRef={(ref) => {
          scrollViewRef.current = ref;
        }}
        contentContainerStyle={styles.messagesContainer}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={Platform.OS === 'ios' ? 80 : 100}
      >
        {messages.map((msg, idx) => (
          <View
            key={idx}
            style={[
              styles.messageBubble,
              {
                alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor:
                  msg.type === 'user' ? '#007aff' : isDarkMode ? '#222' : '#eee',
              },
            ]}
          >
            {msg.typing ? (
              <Text style={{ color: textColor, fontSize: 15 }}>Thinking...</Text>
            ) : msg.type === 'ai' ? (
              <Markdown
                style={{
                  body: {
                    color: textColor,
                    fontSize: 15,
                    lineHeight: 22,
                  },
                  link: { color: '#007aff' },
                  code_inline: {
                    backgroundColor: isDarkMode ? '#222' : '#ddd',
                    padding: 4,
                    borderRadius: 4,
                  },
                }}
              >
                {msg.text}
              </Markdown>
            ) : (
              <Text style={{ color: '#fff', fontSize: 15 }}>{msg.text}</Text>
            )}
          </View>
        ))}
      </KeyboardAwareScrollView>

      <View style={[styles.inputContainer, { backgroundColor: inputBg }]}>
        <TextInput
          style={[styles.input, { color: textColor }]}
          value={input}
          onChangeText={setInput}
          placeholder="Ask something..."
          placeholderTextColor={isDarkMode ? '#aaa' : '#666'}
          onSubmitEditing={handleSend}
          editable={!isTyping}
          multiline
        />
        <TouchableOpacity
          onPress={handleSend}
          style={styles.sendButton}
          disabled={isTyping}
        >
          <Ionicons name="send" size={22} color="#007aff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AiScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 120,
  },
  messageBubble: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    maxWidth: '80%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    maxHeight: 120,
  },
  sendButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
});
