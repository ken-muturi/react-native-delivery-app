import { useAuthStore } from "@/hooks/useUser";
import { api } from "./apiClientService";

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role?: string;
  clientId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  password?: string;
}

export interface UpdateVehicleData {
  vehicleType?: string;
  vehiclePlate?: string;
  vehicleModel?: string;
  vehiclePhoto?: string;
}

export const userService = {
  /**
   * Get current user's profile
   */
  getProfile: async (): Promise<User> => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }
    return api.get<User>(`/api/users/${userId}`);
  },

  /**
   * Update current user's profile
   */
  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }
    console.log("[userService] updateProfile - userId:", userId);
    console.log("[userService] updateProfile - data:", data);
    return api.patch<User>(`/api/users/${userId}`, data);
  },

  /**
   * Update current user's vehicle details
   */
  updateVehicle: async (data: UpdateVehicleData): Promise<User> => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }
    console.log("[userService] updateVehicle - userId:", userId);
    console.log("[userService] updateVehicle - data:", data);
    return api.patch<User>(`/api/users/${userId}`, data);
  },

  /**
   * Get a user by ID (admin only)
   */
  getById: async (id: string): Promise<User> => {
    return api.get<User>(`/api/users/${id}`);
  },

  /**
   * Update a user by ID (admin only)
   */
  update: async (id: string, data: Partial<User>): Promise<User> => {
    return api.patch<User>(`/api/users/${id}`, data);
  },

  /**
   * Delete a user by ID (admin only)
   */
  delete: async (id: string): Promise<void> => {
    return api.delete(`/api/users/${id}`);
  },

  /**
   * Get all users (admin only)
   */
  getAll: async (): Promise<User[]> => {
    return api.get<User[]>("/api/users");
  },
};

export default userService;
