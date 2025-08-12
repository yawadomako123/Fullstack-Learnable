import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Pressable,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AntDesign,
  MaterialIcons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { loginUser } from '../../utils/api';

const LoginScreen = () => {
  const router = useRouter();
  const scale = useRef(new Animated.Value(1)).current;

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Track which input is focused (or null)
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/.test(password.trim());

  const handleLogin = async () => {
    console.log('🔁 handleLogin called');

    let valid = true;

    if (!validateEmail(email)) {
      setEmailError('Enter a valid email address');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!validatePassword(password)) {
      setPasswordError('Password must include upper, lower, number & symbol');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (!valid) return;

    try {
      const response = await loginUser(email, password);
      console.log('✅ Login Success:', response);

      if (response?.user) {
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
        console.log('✅ Navigating to /tabs...');
        router.replace('/(tabs)');
      } else {
        Alert.alert('Login Failed', response?.message || 'Invalid credentials');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert('Login Error', error.message || 'Something went wrong');
    }
  };

  const handleSocialLogin = (provider: 'google' | 'apple') => {
    if (provider === 'apple' && Platform.OS !== 'ios') {
      Alert.alert('Unsupported', 'Apple login is only available on iOS.');
      return;
    }
    console.log(`${provider} login pressed`);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.header}>Let’s Sign You In</Text>

          {/* Username */}
          <View
            style={[
              styles.inputWrapper,
              focusedInput === 'username' && styles.inputWrapperFocused,
            ]}
          >
            <MaterialIcons name="person" size={20} color="#999" />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor={Colors.light.muted}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              onFocus={() => setFocusedInput('username')}
              onBlur={() => setFocusedInput(null)}
              underlineColorAndroid="transparent"
              selectionColor={Colors.light.primary}
            />
          </View>

          {/* Email */}
          <View
            style={[
              styles.inputWrapper,
              focusedInput === 'email' && styles.inputWrapperFocused,
            ]}
          >
            <MaterialIcons name="email" size={20} color="#999" />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={Colors.light.muted}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
              underlineColorAndroid="transparent"
              selectionColor={Colors.light.primary}
            />
          </View>
          {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

          {/* Password */}
          <View
            style={[
              styles.inputWrapper,
              focusedInput === 'password' && styles.inputWrapperFocused,
            ]}
          >
            <MaterialIcons name="lock" size={20} color="#999" />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={Colors.light.muted}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocusedInput('password')}
              onBlur={() => setFocusedInput(null)}
              underlineColorAndroid="transparent"
              selectionColor={Colors.light.primary}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <MaterialCommunityIcons
                name={showPassword ? 'eye-off' : 'eye'}
                size={22}
                color="#999"
              />
            </TouchableOpacity>
          </View>
          {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}

          {/* Remember Me */}
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={styles.rememberMeRow}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View
                style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
              >
                {rememberMe && <AntDesign name="check" size={14} color="#fff" />}
              </View>
              <Text style={styles.rememberMe}>Remember Me</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/auth/forgotPassword')}>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <Pressable
            onPressIn={() =>
              Animated.spring(scale, {
                toValue: 0.96,
                useNativeDriver: true,
              }).start()
            }
            onPressOut={() =>
              Animated.spring(scale, {
                toValue: 1,
                useNativeDriver: true,
              }).start()
            }
            onPress={handleLogin}
          >
            <Animated.View style={[styles.button, { transform: [{ scale }] }]}>
              <Text style={styles.buttonText}>Sign In</Text>
              <View style={styles.iconCircle}>
                <AntDesign name="arrowright" size={35} color="#0056D2" />
              </View>
            </Animated.View>
          </Pressable>

          <Text style={styles.orText}>Or log in with</Text>

          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => handleSocialLogin('google')}
            >
              <AntDesign name="google" size={24} color="#DB4437" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => handleSocialLogin('apple')}
            >
              <AntDesign name="apple1" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => router.push('/auth/signup')}>
            <Text style={styles.loginLink}>Don&apos;t have an account? Sign up</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    padding: 20,
    flexGrow: 1,
    minHeight: '100%', // ensures full screen height
    justifyContent: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 30,
    textAlign: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    marginBottom: 12,
     shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
     borderColor:Colors.light.surface,
    borderWidth: 2,
    overflow: 'hidden', // clip shadows to borderRadius
  },
  inputWrapperFocused: {
    borderColor: Colors.light.primary,
    borderWidth: 2,

    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6, // Android shadow

    backgroundColor: Colors.light.surface,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: Colors.light.text,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
  },
  error: {
    color: '#EA5455',
    fontSize: 13,
    marginBottom: 6,
    marginLeft: 4,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  rememberMeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.light.primary,
  },
  rememberMe: {
    color: Colors.light.text,
    fontSize: 14,
    marginLeft: 6,
  },
  forgotPassword: {
    color: Colors.light.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0056D2',
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  iconCircle: {
    backgroundColor: '#fff',
    borderRadius: 999,
    padding: 6,
    marginLeft: 16,
    position:'relative',
    left:110,
  },
  orText: {
    textAlign: 'center',
    color: Colors.light.muted,
    marginVertical: 20,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  iconButton: {
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 12,
    elevation: 2,
  },
  loginLink: {
    textAlign: 'center',
    color: Colors.light.primary,
    marginTop: 30,
    fontWeight: '600',
  },
});
