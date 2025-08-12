import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Stack, useRouter, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { Colors } from '@/constants/Colors';

SplashScreen.preventAutoHideAsync();

function LayoutContent() {
  const router = useRouter();
  const pathname = usePathname();

  const hideAiButton =
    pathname.startsWith('/onboarding') ||
    pathname.startsWith('/auth/login') ||
    pathname.startsWith('/auth/signup') ||
    pathname.startsWith('/Ai') ||
    pathname.startsWith('/loadingscreen') ||
    pathname.startsWith('/courses/quizscreen');

  useEffect(() => {
    const hideSplash = async () => {
      try {
        await SplashScreen.hideAsync();
      } catch (err) {
        console.warn('Error hiding splash screen:', err);
      }
    };

    hideSplash();
  }, [pathname]);

  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: {
            backgroundColor: 'transparent',
          },
        }}
      />

      {/* AI Lottie Button */}
      {!hideAiButton && (
        <View style={styles.floatingWrapper} pointerEvents="box-none">
          <TouchableOpacity
            onPress={() => router.push('/Ai')}
            activeOpacity={0.9}
            style={styles.touchableLottie}
          >
            <LottieView
              source={require('../assets/animations/AiBot.json')}
              autoPlay
              loop
              style={styles.lottie}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <AuthProvider>
        <ThemeProvider>
          <LayoutContent />
        </ThemeProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  floatingWrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 190,
    right: 0,
    zIndex: 999,
    elevation: 8,
  },
  touchableLottie: {
    // No background, no border
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 160,
    height: 110,
  },
});
