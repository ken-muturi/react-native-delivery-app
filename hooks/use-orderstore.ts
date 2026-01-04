import { initialOrders, Order, OrderStatus } from '@/data/orders';
import zustandStorage from '@/utils/zustandStorage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export { initialOrders } from "@/data/orders";
export type { Order, OrderStatus } from '@/data/orders';

interface OrderStore {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrdersByStatus: (status: OrderStatus) => Order[];
  getOrderById: (orderId: string) => Order | undefined;
  clearDeliveredOrders: () => void;
  resetToInitialOrders: () => void;
}

const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: initialOrders,

      addOrder: (orderData) => {
        const newOrder: Order = {
          ...orderData,
          id: `ORD-${Date.now()}`,
          status: 'new',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          orders: [newOrder, ...state.orders],
        }));
        return newOrder;
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? { ...order, status, updatedAt: new Date().toISOString() }
              : order
          ),
        }));
      },

      getOrdersByStatus: (status) => {
        return get().orders.filter((order) => order.status === status);
      },

      getOrderById: (orderId) => {
        return get().orders.find((order) => order.id === orderId);
      },

      clearDeliveredOrders: () => {
        set((state) => ({
          orders: state.orders.filter((order) => order.status !== 'delivered'),
        }));
      },

      resetToInitialOrders: () => {
        set({ orders: initialOrders });
      },
    }),
    {
      name: 'orders',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

export default useOrderStore;
