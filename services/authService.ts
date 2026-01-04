/**
 * Auth Service - API calls only (no state management)
 * State management is handled by use-userstore.ts
 */
import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://your-nextjs-app.com';
const EXTERNAL_API_KEY = process.env.EXPO_PUBLIC_EXTERNAL_API_KEY || '';
const API_URL = `${API_BASE_URL}/api/auth`;

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
  error?: string;
}

export interface VerifyTokenResponse {
  valid: boolean;
}

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'X-API-Key': EXTERNAL_API_KEY,
  'bypass-tunnel-reminder': 'true',
});

export const authService = {
  /**
   * Login with email and password
   */
  login: async (email: string, password: string): Promise<LoginResponse> => {
    console.log('[authService] Login attempt to:', `${API_URL}/external`);
    console.log('[authService] API Key present:', !!EXTERNAL_API_KEY);
    
    const response = await axios.post<LoginResponse>(
      `${API_URL}/external`,
      { email, password },
      {
        headers: getHeaders(),
        timeout: 10000,
      }
    );
    
    return response.data;
  },

  /**
   * Verify if a token is still valid
   */
  verifyToken: async (token: string): Promise<boolean> => {
    try {
      const response = await axios.post<VerifyTokenResponse>(
        `${API_URL}/verify`,
        { token },
        {
          headers: getHeaders(),
          timeout: 5000,
        }
      );
      return response.data.valid;
    } catch (error) {
      console.error('[authService] Token verification failed:', error);
      return false;
    }
  },

  /**
   * Logout (optional server call)
   */
  logout: async (token: string): Promise<void> => {
    try {
      await axios.post(
        `${API_URL}/logout`,
        {},
        {
          headers: {
            ...getHeaders(),
            Authorization: `Bearer ${token}`,
          },
          timeout: 5000,
        }
      );
    } catch (error) {
      console.warn('[authService] Logout API call failed:', error);
      // Ignore errors - we'll clear local state anyway
    }
  },

  /**
   * Register a new user
   */
  register: async (email: string, password: string, name: string): Promise<LoginResponse> => {
    const response = await axios.post<LoginResponse>(
      `${API_URL}/register`,
      { email, password, name },
      {
        headers: getHeaders(),
        timeout: 10000,
      }
    );
    return response.data;
  },

  /**
   * Request password reset
   */
  forgotPassword: async (email: string): Promise<{ success: boolean; message: string }> => {
    const response = await axios.post(
      `${API_URL}/forgot-password`,
      { email },
      {
        headers: getHeaders(),
        timeout: 10000,
      }
    );
    return response.data;
  },
};

export default authService;
