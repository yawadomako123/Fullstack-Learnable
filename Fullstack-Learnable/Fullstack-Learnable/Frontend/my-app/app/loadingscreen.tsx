import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Platform,
} from 'react-native';

export default function Loadingscreen() {
  const router = useRouter();

  // Animations
  const flipAnim = useRef(new Animated.Value(0)).current;
  const logoFade = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const titleScale = useRef(new Animated.Value(1)).current;
  const subtitleSlide = useRef(new Animated.Value(40)).current;
  const subtitleFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 3D Flip
    Animated.sequence([
      Animated.timing(flipAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    // Fade & Scale
    Animated.parallel([
      Animated.timing(logoFade, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // Title pulse loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(titleScale, {
          toValue: 1.1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(titleScale, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Subtitle slide in
    Animated.parallel([
      Animated.timing(subtitleSlide, {
        toValue: 0,
        duration: 1000,
        delay: 800,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(subtitleFade, {
        toValue: 1,
        duration: 1000,
        delay: 800,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      router.replace('/login');
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // 3D Flip interpolation
  const rotateY = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['90deg', '0deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Animated.Image
        source={{
          uri: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Coursera_logo.png',
        }}
        style={[
          styles.logo,
          {
            opacity: logoFade,
            transform: [
              { perspective: 1000 },
              { rotateY },
              { scale: logoScale },
            ],
          },
        ]}
      />

      <Animated.Text
        style={[styles.title, { transform: [{ scale: titleScale }] }]}
      >
        Welcome to Learnable
      </Animated.Text>

      <Animated.Text
        style={[
          styles.subtitle,
          {
            transform: [{ translateY: subtitleSlide }],
            opacity: subtitleFade,
          },
        ]}
      >
        Start your learning journey today
      </Animated.Text>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0056D2',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 180,
    height: 50,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 40,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
