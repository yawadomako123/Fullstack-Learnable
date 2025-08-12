import React, { useEffect } from 'react';
import { Button, Alert, Platform, StyleSheet, View } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

WebBrowser.maybeCompleteAuthSession();

const GoogleLogin = () => {
  const router = useRouter();

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: 'YOUR_EXPO_CLIENT_ID.apps.googleusercontent.com',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
    iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success' && response.authentication?.idToken) {
      const idToken = response.authentication.idToken;
      console.log('✅ Google ID Token:', idToken);
      sendTokenToSpringBackend(idToken);
    }
  }, [response]);

  const sendTokenToSpringBackend = async (idToken: string) => {
    try {
      const res = await fetch('http://<YOUR_SPRING_BOOT_SERVER>/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();
      console.log('✅ Server response:', data);

      if (data?.user) {
        // Save user if needed (e.g., AsyncStorage)
        router.replace('/(tabs)');
      } else {
        Alert.alert('Login Failed', 'Could not authenticate with server.');
      }
    } catch (error) {
      console.error('❌ Error communicating with backend:', error);
      Alert.alert('Login Error', 'Unable to connect to server.');
    }
  };

  return (
    <View style={styles.buttonWrapper}>
      <Button
        title="Continue with Google"
        disabled={!request}
        color={Colors.light.primary}
        onPress={() => promptAsync()}
      />
    </View>
  );
};

export default GoogleLogin;

const styles = StyleSheet.create({
  buttonWrapper: {
    marginTop: 16,
    borderRadius: 50,
    overflow: 'hidden',
  },
});
