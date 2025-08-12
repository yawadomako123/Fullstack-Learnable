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

// export default function SignUp() {
//   const router = useRouter();
//   const { login } = useAuth();

//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [nameError, setNameError] = useState('');
//   const [emailError, setEmailError] = useState('');
//   const [passwordError, setPasswordError] = useState('');

//    const [rememberMe, setRememberMe] = useState(false);


//   const validateName = (name: string) => name.trim().length > 0;
//   const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//   const validatePassword = (password: string) => password.length >= 8;

//   const handleSignUp = () => {
//     let valid = true;

//     if (!validateName(name)) {
//       setNameError('Please enter your full name');
//       valid = false;
//     } else {
//       setNameError('');
//     }

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

//   const handleLoginRedirect = () => {
//     router.push('/login');
//   };

//   // Button animation
//   const scale = useRef(new Animated.Value(1)).current;

//   const handlePressIn = () => {
//     Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();
//   };

//   const handlePressOut = () => {
//     Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <KeyboardAvoidingView
//         style={styles.inner}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       >
//         <Text style={styles.title}>Create Account</Text>

//         <View style={styles.inputGroup}>
//           <TextInput
//             style={styles.input}
//             placeholder="User Name"
//             placeholderTextColor="#999"
//             onChangeText={setName}
//             value={name}
//           />
//           {nameError ? <Text style={styles.error}>{nameError}</Text> : null}
//         </View>

//         <View style={styles.inputGroup}>
//           <View style={styles.inputWrapper}>
//             <MaterialIcons name="email" size={20} color="#999" style={styles.icon} />
//             <TextInput
//               style={styles.inputWithIcon}
//               placeholder="Email"
//               placeholderTextColor="#999"
//               onChangeText={setEmail}
//               value={email}
//               keyboardType="email-address"
//               autoCapitalize="none"
//             />
//           </View>
//           {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
//         </View>

//         <View style={styles.inputGroup}>
//           <View style={styles.inputWrapper}>
//             <MaterialIcons name="lock" size={20} color="#999" style={styles.icon} />
//             <TextInput
//               style={styles.inputWithIcon}
//               placeholder="Password"
//               placeholderTextColor="#999"
//               onChangeText={setPassword}
//               value={password}
//               secureTextEntry={!showPassword}
//             />
//             <TouchableOpacity
//               style={styles.eyeIcon}
//               onPress={() => setShowPassword((prev) => !prev)}
//               accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
//             >
//               <MaterialCommunityIcons
//                 name={showPassword ? 'eye-off' : 'eye'}
//                 size={22}
//                 color="#999"
//               />
//             </TouchableOpacity>
//           </View>
//           {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}
//         </View>

//         <View style={styles.rememberContainer}>
//   <TouchableOpacity
//     style={styles.checkbox}
//     onPress={() => setRememberMe(!rememberMe)}
//   >
//     {rememberMe && <View style={styles.checked} />}
//   </TouchableOpacity>
//   <Text style={styles.rememberText}>Remember me</Text>
// </View>


//         <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={handleSignUp}>
//           <Animated.View style={[styles.button, { transform: [{ scale }] }]}>
//             <View style={styles.buttonContent}>
//               <Text style={styles.buttonText}>Sign Up</Text>
//               <View style={styles.iconCircle}>
//                 <AntDesign name="arrowright" size={24} color="#0056D2" />
//               </View>
//             </View>
//           </Animated.View>
//         </Pressable>

//         <View style={styles.footer}>
//           <Text style={styles.footerText}>
//             Already have an account?{' '}
//             <Text style={styles.link} onPress={handleLoginRedirect}>
//               Login
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
//     color: '#0056D2',
//     textAlign: 'center',
//     marginBottom: 32,
//   },
//   inputGroup: {
//     marginBottom: 8,
//   },
//   input: {
//     backgroundColor: '#fff',
//     borderColor: '#fff',
//     borderWidth: 1,
//     borderRadius: 15,
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     fontSize: 16,
//     marginBottom: 12,

//     // Shadow
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },

//   rememberContainer: {
//   flexDirection: 'row',
//   alignItems: 'center',
//   marginTop: 12,
//   marginBottom: 8,
// },

// checkbox: {
//   width: 20,
//   height: 20,
//   borderWidth: 1.5,
//   borderColor: Colors.light.primary,
//   borderRadius: 4,
//   justifyContent: 'center',
//   alignItems: 'center',
//   marginRight: 10,
// },

// checked: {
//   width: 12,
//   height: 12,
//   backgroundColor: Colors.light.primary,
//   borderRadius: 2,
// },

// rememberText: {
//   fontSize: 14,
//   color: '#333',
// },


//   inputWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 15,
//     borderWidth: 1,
//     borderColor: '#fff',
//     paddingHorizontal: 12,
//     marginBottom: 12,

//     shadowColor: '#0056',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
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
//     backgroundColor: '#0056D2',
//     borderRadius: 50,
//     paddingVertical: 14,
//     paddingHorizontal: 24,
//     marginTop: 16,
//   },
//   buttonContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//     flex: 1,
//     textAlign: 'center',
//   },
//   iconCircle: {
//     backgroundColor: '#fff',
//     borderRadius: 999,
//     padding: 6,
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
