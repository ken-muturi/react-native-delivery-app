import {
    orderStatusService
} from "@/services/orderStatusService";
import { useQuery } from "@tanstack/react-query";
/**
 * Hook to get all available statuses from API
 */
export const useOrderStatus = () => {
  return useQuery({
    queryKey: ["order-statuses"],
    queryFn: () => orderStatusService.getAll(),
  });
};

/**
 * Hook to fetch order status history
 */

/**
 * Hook to update order status with full payload
 */
// export const useUpdateStatus = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({
//       orderId,
//       payload,
//     }: {
//       orderId: string;
//       payload: UpdateStatusPayload;
//     }) => orderStatusService.updateStatus(orderId, payload),
//     onSuccess: (_, { orderId }) => {
//       queryClient.invalidateQueries({ queryKey: ["orders"] });
//       queryClient.invalidateQueries({ queryKey: ["order", orderId] });
//       queryClient.invalidateQueries({
//         queryKey: ["order-status-history", orderId],
//       });
//     },
//   });
// };

/**
 * Hook to mark order as picked up
 */
// export const useMarkPickedUp = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({
//       orderId,
//       location,
//     }: {
//       orderId: string;
//       location?: { latitude: number; longitude: number };
//     }) => orderStatusService.markPickedUp(orderId, location),
//     onSuccess: (_, { orderId }) => {
//       queryClient.invalidateQueries({ queryKey: ["orders"] });
//       queryClient.invalidateQueries({ queryKey: ["order", orderId] });
//     },
//   });
// };

// /**
//  * Hook to mark order as in transit
//  */
// export const useMarkInTransit = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({
//       orderId,
//       location,
//     }: {
//       orderId: string;
//       location?: { latitude: number; longitude: number };
//     }) => orderStatusService.markInTransit(orderId, location),
//     onSuccess: (_, { orderId }) => {
//       queryClient.invalidateQueries({ queryKey: ["orders"] });
//       queryClient.invalidateQueries({ queryKey: ["order", orderId] });
//     },
//   });
// };

/**
 * Hook to mark order as arrived
 */
// export const useMarkArrived = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({
//       orderId,
//       location,
//     }: {
//       orderId: string;
//       location?: { latitude: number; longitude: number };
//     }) => orderStatusService.markArrived(orderId, location),
//     onSuccess: (_, { orderId }) => {
//       queryClient.invalidateQueries({ queryKey: ["orders"] });
//       queryClient.invalidateQueries({ queryKey: ["order", orderId] });
//     },
//   });
// };

/**
 * Hook to mark order as delivered
 */
// export const useMarkOrderDelivered = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({
//       orderId,
//       note,
//       location,
//     }: {
//       orderId: string;
//       note?: string;
//       location?: { latitude: number; longitude: number };
//     }) => orderStatusService.markDelivered(orderId, note, location),
//     onSuccess: (_, { orderId }) => {
//       queryClient.invalidateQueries({ queryKey: ["orders"] });
//       queryClient.invalidateQueries({ queryKey: ["order", orderId] });
//     },
//   });
// };