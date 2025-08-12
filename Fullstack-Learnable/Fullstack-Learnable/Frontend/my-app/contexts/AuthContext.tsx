import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '@/utils/api';
import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';

// === TYPES ===

export type User = {
  id: number;
  username: string;
  email: string;
  image?: string;
  bio?: string;
};

type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfileImage: (uri: string) => Promise<void>;
  isLoading: boolean;
};

// === CONTEXT SETUP ===

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from AsyncStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem('user');
        if (stored) {
          const parsedUser: User = JSON.parse(stored);
          setUser(parsedUser);
        }
      } catch (err) {
        console.error('❌ Error loading user from storage:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  // === LOGIN ===
  const login = async (email: string, password: string) => {
    try {
      const response = await API.post('/api/users/login', { email, password });
      const loggedInUser: User = response.data.user;

      setUser(loggedInUser);
      await AsyncStorage.setItem('user', JSON.stringify(loggedInUser));
    } catch (err) {
      console.error('❌ Login error:', err);
      Alert.alert('Login Failed', 'Unable to login. Please check your credentials.');
    }
  };

  // === LOGOUT ===
  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

  // === PROFILE IMAGE UPDATE ===
  const updateProfileImage = async (uri: string) => {
    if (!user) return; // Guard clause if user is null

    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const payload = {
        userId: String(user.id),
        image: `data:image/jpeg;base64,${base64}`,
      };

      const res = await API.patch('/api/users/profile-image', payload);
      console.log('✅ Profile image updated:', res.data);

      const updatedUser: User = {
        ...user,
        image: res.data.imageUrl,
      };
      setUser(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error: any) {
      console.log('❌ Upload failed!');
      console.log('❌ Status:', error.response?.status);
      console.log('❌ Full error:', JSON.stringify(error.response?.data, null, 2));
      Alert.alert('Upload Error', 'Could not update your profile image.');
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, logout, updateProfileImage, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// === HOOK ===
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
