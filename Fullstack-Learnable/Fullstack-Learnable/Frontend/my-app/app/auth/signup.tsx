import React, { useState,useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { registerUser } from '../../utils/api';
import { Pressable } from 'react-native-gesture-handler';
import { Animated } from 'react-native';

const SignupScreen = () => {
    const scale = useRef(new Animated.Value(1)).current;
  
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [focusedInput, setFocusedInput] = useState<string | null>(null);


  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/.test(password.trim());

  const handleSignup = async () => {
    let valid = true;

    if (!username.trim()) {
      Alert.alert('Validation Error', 'Username is required');
      valid = false;
    }

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

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      valid = false;
    } else {
      setConfirmPasswordError('');
    }

    if (!valid) return;

    try {
      const response = await registerUser(username, email, password);
      if (response && response.user && response.user.email) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Signup Failed', 'Unexpected server response');
      }
    } catch (error: any) {
      Alert.alert('Signup Error', error.message || 'Something went wrong');
    }
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
          <Text style={styles.header}>Create Account</Text>

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
          <View style={[styles.inputWrapper, focusedInput === 'email' && styles.inputWrapperFocused]}>
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
            />
          </View>
          {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

          {/* Password */}
          <View style={[styles.inputWrapper, focusedInput === 'password' && styles.inputWrapperFocused]}>
            <MaterialIcons name="lock" size={20} color="#999" />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={Colors.light.muted}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              textContentType="password"
               onFocus={() => setFocusedInput('password')}
               onBlur={() => setFocusedInput(null)}
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

          {/* Confirm Password */}
          <View style={[styles.inputWrapper, focusedInput === 'confirmPassword' && styles.inputWrapperFocused]}>
            <MaterialIcons name="lock-outline" size={20} color="#999" />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor={Colors.light.muted}
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              autoCapitalize="none"
              textContentType="password"
               onFocus={() => setFocusedInput('confirmPassword')}
               onBlur={() => setFocusedInput(null)}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <MaterialCommunityIcons
                name={showConfirmPassword ? 'eye-off' : 'eye'}
                size={22}
                color="#999"
              />
            </TouchableOpacity>
          </View>
          {confirmPasswordError ? (
            <Text style={styles.error}>{confirmPasswordError}</Text>
          ) : null}

          {/* Submit */}
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
                     onPress={handleSignup}
                   >
                     <Animated.View style={[styles.button, { transform: [{ scale }] }]}>
                       <Text style={styles.buttonText}>Sign Up</Text>
                       <View style={styles.iconCircle}>
                         <AntDesign name="arrowright" size={35} color="#0056D2" />
                       </View>
                     </Animated.View>
                   </Pressable>

          <Text style={styles.orText}>Or sign up with</Text>

          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.iconButton}>
              <AntDesign name="google" size={24} color="#DB4437" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <AntDesign name="apple1" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => router.push('/auth/login')}>
            <Text style={styles.loginLink}>Already have an account? Log in</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    padding: 20,
    flexGrow: 1,
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
      overflow: 'hidden',  // <-- Add this line

  },
  inputWrapperFocused: {
  borderColor: Colors.light.primary,  // your primary highlight color
  borderWidth: 1.5,
  borderRadius: 12,
  shadowRadius: 3,


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
