import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Animated,
  Easing,
  TextStyle,
  StyleProp,
} from 'react-native';
import { Audio } from 'expo-av';
import Markdown from 'react-native-markdown-display';

interface AnimatedTypingTextProps {
  text: string;
  speed?: number;
  style?: StyleProp<TextStyle>;
  onTypingEnd?: () => void;
  enableSound?: boolean;
  enableCursor?: boolean;
}

const AnimatedTypingText: React.FC<AnimatedTypingTextProps> = ({
  text,
  speed = 30,
  style,
  onTypingEnd,
  enableSound = true,
  enableCursor = true,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const cursorOpacity = useRef(new Animated.Value(1)).current;
  const soundRef = useRef<Audio.Sound | null>(null);

  const loadTypingSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/typing'),
        { shouldPlay: false, volume: 0.3 }
      );
      soundRef.current = sound;
    } catch (error) {
      console.warn('Failed to load typing sound:', error);
    }
  };

  useEffect(() => {
    if (enableSound) loadTypingSound();

    let index = 0;
    const interval = setInterval(async () => {
      setDisplayedText((prev) => prev + text[index]);
      index++;

      if (enableSound && soundRef.current) {
        try {
          await soundRef.current.replayAsync();
        } catch {
          // Ignore replay errors silently
        }
      }

      if (index >= text.length) {
        clearInterval(interval);
        setIsTyping(false);
        if (onTypingEnd) onTypingEnd();
      }
    }, speed);

    return () => {
      clearInterval(interval);
      soundRef.current?.unloadAsync();
    };
  }, [text]);

  useEffect(() => {
    if (!enableCursor) return;

    Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(cursorOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
      <Markdown style={{ body: style as TextStyle }}>{displayedText}</Markdown>
      {enableCursor && isTyping && (
        <Animated.Text
          style={[
            style as TextStyle,
            {
              opacity: cursorOpacity,
              fontWeight: 'normal',
            },
          ]}
        >
          |
        </Animated.Text>
      )}
    </View>
  );
};

export default AnimatedTypingText;
