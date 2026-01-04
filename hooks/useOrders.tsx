import { orderService } from '@/services/orderService';
import { useQuery } from '@tanstack/react-query';

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return orderService.getAll();
    },
  });
};

/**
 * Hook to fetch a single order by ID
 */
export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getById(id),
    enabled: !!id,
  });
};

/**
 * Hook to fetch order markers for map
 */
export const useOrderMarkers = () => {
  return useQuery({
    queryKey: ['order-markers'],
    queryFn: orderService.getMarkers,
  });
};