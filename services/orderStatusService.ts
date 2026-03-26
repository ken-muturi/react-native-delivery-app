import { api } from "./apiClientService";

/**
 * Order status types following the delivery lifecycle
 */
export type OrderStatus ={
    id: string;
    title: string;
    abbrev: string;
    color: string;
}

export const orderStatusService = {
  /**
   * Get all possible statuses from API
   */
  getAll: async (): Promise<OrderStatus[]> => {
    console.log("[orderStatusService] getAll", api);
    return api.get<OrderStatus[]>("/api/order-status");
  },
};

export default orderStatusService;
