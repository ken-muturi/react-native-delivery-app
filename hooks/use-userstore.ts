// store/authStore.ts
import zustandStorage from "@/utils/zustandStorage";
import axios from "axios";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://your-nextjs-app.com";
const API_URL = `${API_BASE_URL}/api/auth`;

// Debug: Log the API URL at startup
console.log("[AuthStore] API_BASE_URL:", API_BASE_URL);
console.log("[AuthStore] API_URL:", API_URL);

export interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  verifyToken: () => Promise<boolean>;
  clearError: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        const loginUrl = `${API_URL}/external`;
        console.log("[AuthStore] Attempting login...");
        console.log("[AuthStore] Login URL:", loginUrl);
        console.log("[AuthStore] Email:", email);

        try {
          const response = await axios.post(
            loginUrl,
            {
              email,
              password,
            },
            {
              headers: {
                "Content-Type": "application/json",
                "bypass-tunnel-reminder": "true", // Required for localtunnel (loca.lt)
              },
              timeout: 10000,
            }
          );

          console.log("[AuthStore] Response status:", response.status);
          console.log(
            "[AuthStore] Response data:",
            JSON.stringify(response.data, null, 2)
          );

          if (response.data.success) {
            const { token, user } = response.data;

            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error("Authentication failed");
          }
        } catch (error: any) {
          console.log("[AuthStore] Login error:", error.message);
          console.log("[AuthStore] Error code:", error.code);
          console.log(
            "[AuthStore] Error response:",
            error.response?.status,
            error.response?.data
          );
          console.log(
            "[AuthStore] Full error:",
            JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
          );

          const errorMessage =
            error.response?.data?.error || error.message || "Login failed";
          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
            user: null,
            token: null,
          });
          throw new Error(errorMessage);
        }
      },

      logout: async () => {
        set({ isLoading: true });

        try {
          // Optional: Call logout endpoint
          // const token = get().token;
          // if (token) {
          //   await axios.post(`${API_URL}/logout`, {}, {
          //     headers: { Authorization: `Bearer ${token}` }
          //   });
          // }

          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error("Logout error:", error);
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      checkAuth: async () => {
        const { token, user } = get();

        if (!token || !user) {
          set({ isAuthenticated: false, isLoading: false });
          return;
        }

        set({ isLoading: true });

        try {
          const isValid = await get().verifyToken();

          if (isValid) {
            set({
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      verifyToken: async () => {
        try {
          const token = get().token;
          if (!token) return false;

          const response = await axios.post(
            `${API_URL}/verify`,
            { token },
            { timeout: 5000 }
          );

          return response.data.valid;
        } catch (error) {
          console.error("Token verification failed:", error);
          return false;
        }
      },

      clearError: () => set({ error: null }),

      setUser: (user: User | null) => set({ user }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
