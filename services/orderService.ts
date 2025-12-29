// import type { CartItem } from '@/hooks/use-cartstore';

export interface OrderData {
  // items: CartItem[];
  restaurantId: string;
  restaurantName: string;
  deliveryMode: 'delivery' | 'pickup';
  deliveryAddress?: string;
  customerName: string;
  customerPhone: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  leaveAtDoor: boolean;
  sendAsGift: boolean;
  deliveryTime: 'standard' | 'schedule';
  selectedTimeSlot?: string;
  tipAmount: number;
  paymentMethod: 'applepay' | 'card';
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  total: number;
}

export const orderService = {
  /**
   * Create a new order
   */
  createOrder: async (orderData: OrderData): Promise<{ orderId: string; success: boolean }> => {
    // TODO: Replace with actual API call when backend is ready
    // return fetch('/api/orders', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(orderData)
    // }).then(res => res.json());

    console.log('Creating order:', orderData);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      orderId: `ORDER_${Date.now()}`,
      success: true,
    };
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