import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (data: { email: string; password: string; name?: string }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data);
    return response.data;
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

// Subscription API
export const subscriptionAPI = {
  createCheckout: async (plan: 'monthly' | 'yearly') => {
    const response = await api.post('/subscriptions/create-checkout', { plan });
    return response.data;
  },
  getStatus: async () => {
    const response = await api.get('/subscriptions/status');
    return response.data;
  },
  cancel: async () => {
    const response = await api.post('/subscriptions/cancel');
    return response.data;
  },
};
