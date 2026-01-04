export type OrderStatus =
  | "new"
  | "driver-assigned"
  | "in-transit"
  | "collected"
  | "delivered";

export interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
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

// Initial demo orders with different statuses
export const initialOrders: Order[] = [
  {
    id: "ORD-001",
    restaurantId: "rest_001",
    restaurantName: "Nyama Choma House",
    customerName: "John Kamau",
    customerPhone: "+254 712 345 678",
    deliveryAddress: "Westlands, Sarit Centre, Nairobi",
    items: [
      { name: "Nyama Choma ya Mbuzi", quantity: 1, price: 850 },
      { name: "Ugali na Sukuma Wiki", quantity: 2, price: 350 },
    ],
    total: 1550,
    status: "new",
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(), // 5 mins ago
    updatedAt: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: "ORD-002",
    restaurantId: "rest_002",
    restaurantName: "Mama Oliech",
    customerName: "Grace Wanjiku",
    customerPhone: "+254 722 987 654",
    deliveryAddress: "Kilimani, Yaya Centre, Nairobi",
    items: [
      { name: "Tilapia ya Kukaanga", quantity: 2, price: 650 },
      { name: "Pilau ya Nyama", quantity: 1, price: 550 },
    ],
    total: 1850,
    status: "new",
    createdAt: new Date(Date.now() - 8 * 60000).toISOString(), // 8 mins ago
    updatedAt: new Date(Date.now() - 8 * 60000).toISOString(),
  },
  {
    id: "ORD-002B",
    restaurantId: "rest_003",
    restaurantName: "Biryani House",
    customerName: "Ahmed Hassan",
    customerPhone: "+254 700 333 444",
    deliveryAddress: "Eastleigh, Fifth Avenue, Nairobi",
    items: [
      { name: "Chicken Biryani", quantity: 2, price: 600 },
      { name: "Raita", quantity: 1, price: 120 },
      { name: "Papadum", quantity: 2, price: 50 },
    ],
    total: 1370,
    status: "driver-assigned",
    createdAt: new Date(Date.now() - 12 * 60000).toISOString(), // 12 mins ago
    updatedAt: new Date(Date.now() - 3 * 60000).toISOString(),
  },
  {
    id: "ORD-002C",
    restaurantId: "rest_008",
    restaurantName: "Tusker Grill",
    customerName: "Robert Kipchoge",
    customerPhone: "+254 722 555 666",
    deliveryAddress: "Hurlingham, Kimathi Road, Nairobi",
    items: [
      { name: "Grilled Beef Steak", quantity: 1, price: 1200 },
      { name: "Grilled Chicken Breast", quantity: 1, price: 900 },
      { name: "Grilled Vegetables", quantity: 2, price: 300 },
    ],
    total: 2700,
    status: "driver-assigned",
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(), // 15 mins ago
    updatedAt: new Date(Date.now() - 2 * 60000).toISOString(),
  },
  {
    id: "ORD-003",
    restaurantId: "rest_004",
    restaurantName: "Java House Westlands",
    customerName: "Peter Ochieng",
    customerPhone: "+254 733 456 789",
    deliveryAddress: "Parklands, 3rd Avenue, Nairobi",
    items: [
      { name: "Kuku Kienyeji", quantity: 1, price: 750 },
      { name: "Chapati (2 pcs)", quantity: 4, price: 50 },
      { name: "Chai ya Tangawizi", quantity: 2, price: 80 },
    ],
    total: 1110,
    status: "collected",
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(), // 25 mins ago
    updatedAt: new Date(Date.now() - 10 * 60000).toISOString(),
  },
  {
    id: "ORD-004",
    restaurantId: "rest_005",
    restaurantName: "Swahili Dishes",
    customerName: "Mary Akinyi",
    customerPhone: "+254 711 222 333",
    deliveryAddress: "Lavington, James Gichuru Road, Nairobi",
    items: [
      { name: "Samaki wa Kupaka", quantity: 1, price: 700 },
      { name: "Wali wa Nazi", quantity: 2, price: 200 },
      { name: "Madafu", quantity: 2, price: 150 },
    ],
    total: 1400,
    status: "in-transit",
    createdAt: new Date(Date.now() - 35 * 60000).toISOString(), // 35 mins ago
    updatedAt: new Date(Date.now() - 5 * 60000).toISOString(),
    estimatedDeliveryTime: "10 mins",
  },
  {
    id: "ORD-005",
    restaurantId: "rest_007",
    restaurantName: "Pilau Palace",
    customerName: "David Mwangi",
    customerPhone: "+254 700 111 222",
    deliveryAddress: "Karen, Hardy, Nairobi",
    items: [
      { name: "Pilau ya Nyama", quantity: 2, price: 550 },
      { name: "Kachumbari", quantity: 1, price: 100 },
    ],
    total: 1200,
    status: "in-transit",
    createdAt: new Date(Date.now() - 40 * 60000).toISOString(), // 40 mins ago
    updatedAt: new Date(Date.now() - 8 * 60000).toISOString(),
    estimatedDeliveryTime: "5 mins",
  },
  {
    id: "ORD-006",
    restaurantId: "rest_009",
    restaurantName: "Chapati Express",
    customerName: "Susan Njeri",
    customerPhone: "+254 788 999 000",
    deliveryAddress: "Upperhill, Ralph Bunche Road, Nairobi",
    items: [
      { name: "Chapati (2 pcs)", quantity: 6, price: 50 },
      { name: "Maharagwe", quantity: 2, price: 180 },
      { name: "Chai ya Tangawizi", quantity: 3, price: 80 },
    ],
    total: 900,
    status: "delivered",
    createdAt: new Date(Date.now() - 90 * 60000).toISOString(), // 90 mins ago
    updatedAt: new Date(Date.now() - 60 * 60000).toISOString(),
  },
  {
    id: "ORD-007",
    restaurantId: "rest_006",
    restaurantName: "Ugali Corner",
    customerName: "James Otieno",
    customerPhone: "+254 755 666 777",
    deliveryAddress: "South B, Mombasa Road, Nairobi",
    items: [
      { name: "Mukimo", quantity: 2, price: 300 },
      { name: "Kuku Choma", quantity: 1, price: 800 },
    ],
    total: 1400,
    status: "delivered",
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(), // 2 hours ago
    updatedAt: new Date(Date.now() - 90 * 60000).toISOString(),
  },
];
