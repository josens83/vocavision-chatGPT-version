import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('authToken');
      // Navigate to login - you'll need to implement this
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (data: { email: string; password: string; name?: string }) => {
    const response = await api.post('/auth/register', data);
    if (response.data.token) {
      await AsyncStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  },
  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data);
    if (response.data.token) {
      await AsyncStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  },
  logout: async () => {
    await AsyncStorage.removeItem('authToken');
  },
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

// Words API
export const wordsAPI = {
  getWords: async (params?: {
    page?: number;
    limit?: number;
    difficulty?: string;
    search?: string;
  }) => {
    const response = await api.get('/words', { params });
    return response.data;
  },
  getWordById: async (id: string) => {
    const response = await api.get(`/words/${id}`);
    return response.data;
  },
  getRandomWords: async (count?: number, difficulty?: string) => {
    const response = await api.get('/words/random', {
      params: { count, difficulty },
    });
    return response.data;
  },
};

// Progress API
export const progressAPI = {
  getUserProgress: async () => {
    const response = await api.get('/progress');
    return response.data;
  },
  getDueReviews: async () => {
    const response = await api.get('/progress/due');
    return response.data;
  },
  submitReview: async (data: {
    wordId: string;
    rating: number;
    responseTime?: number;
    learningMethod?: string;
    sessionId?: string;
  }) => {
    const response = await api.post('/progress/review', data);
    return response.data;
  },
  startSession: async () => {
    const response = await api.post('/progress/session/start');
    return response.data;
  },
  endSession: async (data: {
    sessionId: string;
    wordsStudied: number;
    wordsCorrect: number;
  }) => {
    const response = await api.post('/progress/session/end', data);
    return response.data;
  },
};

export default api;
