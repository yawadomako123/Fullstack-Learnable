// import { useRouter } from 'expo-router';
// import React, { useRef, useState } from 'react';
// import {
//   KeyboardAvoidingView,
//   Platform,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
//   Animated,
//   Pressable,
//   TouchableOpacity,
// } from 'react-native';
// import { MaterialIcons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
// import { useAuth } from '../contexts/AuthContext';
// import { Colors } from '@/constants/Colors';

// export default function Login() {
//   const router = useRouter();
//   const { login } = useAuth();

//   const [email, setEmail] = useState('');
//   const [name, setName] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [emailError, setEmailError] = useState('');
//   const [passwordError, setPasswordError] = useState('');

//   const validateEmail = (email: string) =>
//     /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//   const validatePassword = (password: string) => password.length >= 8;

//   const handleLogin = () => {
//     let valid = true;

//     if (!validateEmail(email)) {
//       setEmailError('Enter a valid email address');
//       valid = false;
//     } else {
//       setEmailError('');
//     }

//     if (!validatePassword(password)) {
//       setPasswordError('Password must be at least 8 characters');
//       valid = false;
//     } else {
//       setPasswordError('');
//     }

//     if (valid) {
//       login(email, name);
//       router.replace({
//         pathname: '/(tabs)',
//         params: { name, email },
//       });
//     }
//   };

//   const goToSignUp = () => {
//     router.push('/signup');
//   };

//   // Animation logic
//   const scale = useRef(new Animated.Value(1)).current;

//   const handlePressIn = () => {
//     Animated.spring(scale, {
//       toValue: 0.96,
//       useNativeDriver: true,
//     }).start();
//   };

//   const handlePressOut = () => {
//     Animated.spring(scale, {
//       toValue: 1,
//       friction: 3,
//       useNativeDriver: true,
//     }).start();
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <KeyboardAvoidingView
//         style={styles.inner}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       >
//         <Text style={styles.title}>Welcome Back</Text>
// <View style={styles.inputGroup}>
//   <TextInput
//     style={styles.input}
//     placeholder="User Name"
//     placeholderTextColor="#999"
//     onChangeText={setName}
//     value={name}
//   />
// </View>

// <View style={styles.inputGroup}>
//   <View style={styles.inputWrapper}>
//     <MaterialIcons name="email" size={20} color="#999" style={styles.icon} />
//     <TextInput
//       style={styles.inputWithIcon}
//       placeholder="Email"
//       placeholderTextColor="#999"
//       onChangeText={setEmail}
//       value={email}
//       keyboardType="email-address"
//       autoCapitalize="none"
//     />
//   </View>
//   {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
// </View>

// <View style={styles.inputGroup}>
//   <View style={styles.inputWrapper}>
//     <MaterialIcons name="lock" size={20} color="#999" style={styles.icon} />
//     <TextInput
//       style={styles.inputWithIcon}
//       placeholder="Password"
//       placeholderTextColor="#999"
//       onChangeText={setPassword}
//       value={password}
//       secureTextEntry={!showPassword}
//     />
//     <TouchableOpacity
//       style={styles.eyeIcon}
//       onPress={() => setShowPassword((prev) => !prev)}
//       accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
//     >
//       <MaterialCommunityIcons
//         name={showPassword ? 'eye-off' : 'eye'}
//         size={22}
//         color="#999"
//       />
//     </TouchableOpacity>
//   </View>
//   {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}
// </View>


//         {/* Animated login button */}
//         <Pressable
//   onPressIn={handlePressIn}
//   onPressOut={handlePressOut}
//   onPress={handleLogin}
// >
//   <Animated.View style={[styles.button, { transform: [{ scale }] }]}>
//     <Text style={styles.buttonText}>Login</Text>
//     <View style={styles.iconCircle}>
//       <AntDesign name="arrowright" size={30} color="#0056D2" />
//     </View>
//   </Animated.View>
// </Pressable>


//         <View style={styles.footer}>
//           <Text style={styles.footerText}>
//             Don’t have an account?{' '}
//             <Text style={styles.link} onPress={goToSignUp}>
//               Sign Up
//             </Text>
//           </Text>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5FAFB',
//   },
//   inner: {
//     flex: 1,
//     justifyContent: 'center',
//     paddingHorizontal: 24,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: '700',
//     color: Colors.light.primary,
//     textAlign: 'center',
//     marginBottom: 32,
//   },
// input: {
//   backgroundColor: '#fff',
//   borderColor: '#fff',
//   borderWidth: 1,
//   borderRadius: 15,
//   paddingHorizontal: 16,
//   paddingVertical: 14,
//   fontSize: 16,
//   marginBottom: 12,

//   // Shadow (iOS)
//   shadowColor: '#0056',
//   shadowOffset: { width: 0, height: 2 },
//   shadowOpacity: 0.1,
//   shadowRadius: 4,

//   // Shadow (Android)
//   elevation: 3,
// },

// inputGroup: {
//   marginBottom: 8,
// },

// inputWrapper: {
//   flexDirection: 'row',
//   alignItems: 'center',
//   backgroundColor: '#fff',
//   borderColor: '#fff',
//   borderWidth: 1,
//   borderRadius: 15,
//   paddingHorizontal: 12,
//   marginBottom: 12,

//   // Shadow (iOS)
//   shadowColor: '#000',
//   shadowOffset: { width: 0, height: 2 },
//   shadowOpacity: 0.1,
//   shadowRadius: 4,

//   // Shadow (Android)
//   elevation: 3,
// },

//   icon: {
//     marginRight: 8,
//   },
//   inputWithIcon: {
//     flex: 1,
//     height: 50,
//     fontSize: 16,
//     color: '#333',
//   },
//   eyeIcon: {
//     position: 'absolute',
//     right: 12,
//   },
//   error: {
//     color: '#EA5455',
//     fontSize: 13,
//     marginBottom: 8,
//     marginLeft: 4,
//   },
//   button: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#0056D2',
//     borderRadius: 50,
//     paddingVertical: 10,
//     paddingHorizontal: 24,
//     marginTop: 16,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//      textAlign: 'center',
//   },
//   iconCircle: {
//     // marginLeft: 10,
//     // right:0,
//     backgroundColor: '#fff',
//     borderRadius: 999,
//     padding: 6,
//     position: 'relative',
//     left:120,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   footer: {
//     marginTop: 32,
//     alignItems: 'center',
//   },
//   footerText: {
//     fontSize: 14,
//     color: '#4E5D78',
//   },
//   link: {
//     fontWeight: 'bold',
//     color: '#0056D2',
//   },
// });
