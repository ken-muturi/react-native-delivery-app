import { OrderData, orderService } from "@/services/orderService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Hook to fetch orders (API handles role-based filtering via auth token)
 */
export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => orderService.getAll(),
  });
};

/**
 * Hook to fetch a single order by ID
 */
export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => orderService.getById(id),
    enabled: !!id,
  });
};

/**
 * Hook to fetch active orders
 */
export const useActiveOrders = () => {
  return useQuery({
    queryKey: ["orders", "active"],
    queryFn: () => orderService.getActive(),
  });
};

/**
 * Hook to fetch order history
 */
export const useOrderHistory = () => {
  return useQuery({
    queryKey: ["orders", "history"],
    queryFn: () => orderService.getHistory(),
  });
};

/**
 * Hook to create a new order
 */
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      orderData: Omit<OrderData, "id" | "status" | "createdAt" | "updatedAt">
    ) => orderService.create(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

/**
 * Hook to update order status
 */
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      orderService.updateStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

/**
 * Hook to assign driver to order
 */
export const useAssignDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      driverId,
    }: {
      orderId: string;
      driverId: string;
    }) => orderService.assignDriver(orderId, driverId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

/**
 * Hook to mark order as collected
 */
// export const useMarkCollected = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (orderId: string) => orderService.markCollected(orderId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["orders"] });
//     },
//   });
// };

/**
 * Hook to mark order as delivered
 */
// export const useMarkDelivered = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (orderId: string) => orderService.markDelivered(orderId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["orders"] });
//     },
//   });
// };

/**
 * Hook to cancel an order
 */
// export const useCancelOrder = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (orderId: string) => orderService.cancel(orderId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["orders"] });
//     },
//   });
// };
