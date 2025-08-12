import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ Replace with your actual backend IP and port
const BASE_URL = 'http://192.168.8.120:8080/api';

const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Attach token from AsyncStorage (if any) to every request
API.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// ✅ Error message extractor
const extractErrorMessage = (error: any): string => {
  const data = error?.response?.data;

  if (typeof data === 'string') return data;
  if (typeof data?.message === 'string') return data.message;

  if (typeof data?.message === 'object') {
    return Object.entries(data.message)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  }

  return error.message || 'Unknown error';
};

// ✅ User registration
export const registerUser = async (
  username: string,
  email: string,
  password: string
): Promise<any> => {
  try {
    const res = await API.post('/users/register', { username, email, password });
    console.log('✅ Registration Success:', res.data);
    return res.data;
  } catch (error: any) {
    const msg = extractErrorMessage(error);
    console.error('❌ Registration Error:', msg);
    throw new Error(msg);
  }
};

// ✅ User login
export const loginUser = async (
  email: string,
  password: string
): Promise<any> => {
  try {
    const res = await API.post('/users/login', { email, password });

    const { token } = res.data;
    if (token) {
      await AsyncStorage.setItem('token', token);
    }

    console.log('✅ Login Success:', res.data);
    return res.data;
  } catch (error: any) {
    const msg = extractErrorMessage(error);
    console.error('❌ Login Error:', msg);
    throw new Error(msg);
  }
};

export default API;
