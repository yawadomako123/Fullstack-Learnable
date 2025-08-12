import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, Easing, StyleSheet, Text, View } from 'react-native';

export default function LoadingScreen() {
  const router = useRouter();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const spinnerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Parallel animation for logo (fade + scale)
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // Slide in title/subtitle
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 900,
      delay: 700,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();

    // Spinner rotation (infinite loop)
    Animated.loop(
      Animated.timing(spinnerAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Navigate after 5 seconds
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Spinner rotation interpolation
  const spin = spinnerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        source={{
          uri: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Coursera_logo.png',
        }}
        style={[
          styles.logo,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      />
      <Animated.View style={{ transform: [{ translateY: slideAnim }], opacity: fadeAnim }}>
        <Text style={styles.title}>Welcome to Learnova</Text>
        <Text style={styles.subtitle}>Start your learning journey today</Text>
      </Animated.View>
      <Animated.View style={{ marginTop: 40, transform: [{ rotate: spin }] }}>
        <ActivityIndicator size="large" color="#fff" />
      </Animated.View>
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