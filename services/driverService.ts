import { useAuthStore } from "@/hooks/useUser";
import { api } from "./apiClientService";

export interface Driver {
  id: string;
  userId: string;
  vehicleType?: string;
  vehiclePlate?: string;
  vehicleModel?: string;
  vehiclePhoto?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  insuranceNumber?: string;
  insuranceExpiry?: string;
  isVerified?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateVehicleData {
  vehicleType?: string;
  vehiclePlate?: string;
  vehicleModel?: string;
  vehiclePhoto?: string;
}

export interface UpdateDocumentsData {
  licenseNumber?: string;
  licenseExpiry?: string;
  insuranceNumber?: string;
  insuranceExpiry?: string;
}

export const driverService = {
  /**
   * Get current driver's profile
   */
  getProfile: async (): Promise<Driver> => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }
    return api.get<Driver>(`/api/drivers/${userId}`);
  },

  /**
   * Update driver's vehicle details
   */
  updateVehicle: async (data: UpdateVehicleData): Promise<Driver> => {
    const user = useAuthStore.getState().user;
    if (!user?.id) {
      throw new Error("User not authenticated");
    }
    console.log("[driverService] updateVehicle - full user:", user);
    console.log("[driverService] updateVehicle - userId:", user.id);
    console.log("[driverService] updateVehicle - user role:", user.role);
    console.log("[driverService] updateVehicle - data:", data);
    return api.patch<Driver>(`/api/drivers/${user.id}`, data);
  },

  /**
   * Update driver's documents
   */
  updateDocuments: async (data: UpdateDocumentsData): Promise<Driver> => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }
    console.log("[driverService] updateDocuments - userId:", userId);
    console.log("[driverService] updateDocuments - data:", data);
    return api.patch<Driver>(`/api/drivers/${userId}`, data);
  },

  /**
   * Get a driver by ID
   */
  getById: async (id: string): Promise<Driver> => {
    return api.get<Driver>(`/api/drivers/${id}`);
  },

  /**
   * Update driver status (active/inactive)
   */
  updateStatus: async (isActive: boolean): Promise<Driver> => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }
    return api.patch<Driver>(`/api/drivers/${userId}`, { isActive });
  },

  /**
   * Get all drivers (admin only)
   */
  getAll: async (): Promise<Driver[]> => {
    return api.get<Driver[]>("/api/drivers");
  },
};

export default driverService;
