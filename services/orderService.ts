import { api } from "./apiClientService";

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface OrderData {
  id?: string;
  clientId: string;
  clientName: string;
  deliveryMode: "delivery" | "pickup";
  deliveryAddress?: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  leaveAtDoor: boolean;
  sendAsGift: boolean;
  deliveryTime: "standard" | "schedule";
  selectedTimeSlot?: string;
  tipAmount: number;
  paymentMethod: "applepay" | "card";
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  total: number;
  status?: string;
  driverId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const orderService = {
  /**
   * Get orders for the current user (API handles role-based filtering via auth token)
   */
  getAll: async (): Promise<OrderData[]> => {
    return api.get<OrderData[]>("/api/orders");
  },

  /**
   * Get a single order by ID
   */
  getById: async (id: string): Promise<OrderData> => {
    return api.get<OrderData>(`/api/orders/${id}`);
  },

  /**
   * Create a new order
   */
  create: async (
    orderData: Omit<OrderData, "id" | "status" | "createdAt" | "updatedAt">
  ): Promise<OrderData> => {
    return api.post<OrderData>("/api/orders", orderData);
  },

  /**
   * Update an existing order
   */
  update: async (
    id: string,
    orderData: Partial<OrderData>
  ): Promise<OrderData> => {
    return api.put<OrderData>(`/api/orders/${id}`, orderData);
  },

  /**
   * Update order status
   */
  updateStatus: async (id: string, status: string): Promise<OrderData> => {
    return api.patch<OrderData>(`/api/orders/${id}`, { status });
  },

  /**
   * Cancel an order
   */
  cancel: async (id: string): Promise<OrderData> => {
    return api.patch<OrderData>(`/api/orders/${id}`, { status: "cancelled" });
  },

  /**
   * Get orders by status
   */
  getByStatus: async (status: string): Promise<OrderData[]> => {
    return api.get<OrderData[]>("/api/orders", { status });
  },

  /**
   * Get active orders (not delivered or cancelled)
   */
  getActive: async (): Promise<OrderData[]> => {
    return api.get<OrderData[]>("/api/orders/active");
  },

  /**
   * Get order history (delivered orders)
   */
  getHistory: async (): Promise<OrderData[]> => {
    return api.get<OrderData[]>("/api/orders/history");
  },

  /**
   * Assign driver to order
   */
  assignDriver: async (
    orderId: string,
    driverId: string
  ): Promise<OrderData> => {
    return api.patch<OrderData>(`/api/orders/${orderId}/assign`, { driverId });
  },

  /**
   * Mark order as collected
   */
  markCollected: async (orderId: string): Promise<OrderData> => {
    return api.patch<OrderData>(`/api/orders/${orderId}/collected`, {});
  },

  /**
   * Mark order as delivered
   */
  markDelivered: async (orderId: string): Promise<OrderData> => {
    return api.patch<OrderData>(`/api/orders/${orderId}/delivered`, {});
  },
  /**
   * Calculate fees based on cart total and distance (in KES)
   */
  calculateFees: (
    cartTotal: number,
    distanceKm: number = 2.5
  ): { serviceFee: number; deliveryFee: number } => {
    // Fee calculation in KES
    const serviceFee = 50; // Fixed service fee in KES
    const deliveryFee = distanceKm <= 3 ? 150 : 150 + (distanceKm - 3) * 30;

    return {
      serviceFee: Number(serviceFee.toFixed(0)),
      deliveryFee: Number(deliveryFee.toFixed(0)),
    };
  },
};
