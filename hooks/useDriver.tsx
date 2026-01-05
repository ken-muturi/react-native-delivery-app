import { driverService, UpdateDocumentsData, UpdateVehicleData } from "@/services/driverService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Hook to fetch current driver's profile
 */
export const useDriverProfile = () => {
  return useQuery({
    queryKey: ["driver", "profile"],
    queryFn: () => driverService.getProfile(),
  });
};

/**
 * Hook to fetch a driver by ID
 */
export const useDriver = (id: string) => {
  return useQuery({
    queryKey: ["driver", id],
    queryFn: () => driverService.getById(id),
    enabled: !!id,
  });
};

/**
 * Hook to update driver's vehicle details
 */
export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateVehicleData) => driverService.updateVehicle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driver", "profile"] });
    },
  });
};

/**
 * Hook to update driver's documents
 */
export const useUpdateDocuments = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateDocumentsData) => driverService.updateDocuments(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driver", "profile"] });
    },
  });
};

/**
 * Hook to update driver's status (active/inactive)
 */
export const useUpdateDriverStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isActive: boolean) => driverService.updateStatus(isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driver", "profile"] });
    },
  });
};

/**
 * Hook to fetch all drivers (admin only)
 */
export const useDrivers = () => {
  return useQuery({
    queryKey: ["drivers"],
    queryFn: () => driverService.getAll(),
  });
};
