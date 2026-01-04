export type OrderStatus =
  | "new"
  | "driver-assigned"
  | "pickup"
  | "in-transit"
  | "delivered";

export interface Order {
  id: string;
  clientId: string;
  clientName: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  estimatedDeliveryTime?: string;
}
