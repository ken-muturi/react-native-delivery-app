import { useAuthStore } from '@/hooks/use-userstore';
import axios from 'axios';
import { router } from 'expo-router';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://your-nextjs-app.com';
// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to all requests
apiClient.interceptors.request.use(
  (config) => {
    // Get token from Zustand store
    const token = useAuthStore.getState().token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If 401 (unauthorized) and haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Token expired or invalid - logout user
      const { logout } = useAuthStore.getState();
      await logout();
      
      // Redirect to login
      router.replace('/login');
      
      return Promise.reject(error);
    }
    
    // Handle other errors
    if (error.response?.status === 403) {
      console.error('Forbidden: You do not have permission');
    } else if (error.response?.status >= 500) {
      console.error('Server error:', error.response.status);
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
    } else if (!error.response) {
      console.error('Network error - no response received');
    }
    
    return Promise.reject(error);
  }
);

// API Methods
export const api = {
  // User endpoints
  getProfile: async () => {
    const response = await apiClient.get('/user/profile');
    return response.data;
  },

  updateProfile: async (data: any) => {
    const response = await apiClient.put('/user/profile', data);
    return response.data;
  },

  // Generic methods
  get: async <T = any>(endpoint: string, params?: any): Promise<T> => {
    const response = await apiClient.get(endpoint, { params });
    return response.data;
  },

  post: async <T = any>(endpoint: string, data?: any): Promise<T> => {
    const response = await apiClient.post(endpoint, data);
    return response.data;
  },

  put: async <T = any>(endpoint: string, data?: any): Promise<T> => {
    const response = await apiClient.put(endpoint, data);
    return response.data;
  },

  patch: async <T = any>(endpoint: string, data?: any): Promise<T> => {
    const response = await apiClient.patch(endpoint, data);
    return response.data;
  },

  delete: async <T = any>(endpoint: string): Promise<T> => {
    const response = await apiClient.delete(endpoint);
    return response.data;
  },
};

export default apiClient;