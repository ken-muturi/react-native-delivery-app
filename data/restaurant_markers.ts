export interface RestaurantMarker {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  cuisine: string[];
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
}

export const restaurantMarkers: RestaurantMarker[] = [
  {
    id: 'rest_001',
    name: 'Nyama Choma House',
    latitude: -1.2864,
    longitude: 36.8172,
    cuisine: ['Kenyan', 'BBQ', 'Grilled'],
    rating: 4.6,
    deliveryTime: '25-35 min',
    deliveryFee: 150,
  },
  {
    id: 'rest_002',
    name: 'Mama Oliech',
    latitude: -1.2921,
    longitude: 36.8219,
    cuisine: ['Kenyan', 'Fish', 'Traditional'],
    rating: 4.8,
    deliveryTime: '20-30 min',
    deliveryFee: 200,
  },
  {
    id: 'rest_003',
    name: 'Carnivore Restaurant',
    latitude: -1.3142,
    longitude: 36.7856,
    cuisine: ['Kenyan', 'BBQ', 'Game Meat'],
    rating: 4.7,
    deliveryTime: '30-40 min',
    deliveryFee: 250,
  },
  {
    id: 'rest_004',
    name: 'Java House Westlands',
    latitude: -1.2673,
    longitude: 36.8034,
    cuisine: ['Café', 'Coffee', 'Continental'],
    rating: 4.5,
    deliveryTime: '15-25 min',
    deliveryFee: 100,
  },
  {
    id: 'rest_005',
    name: 'Swahili Dishes',
    latitude: -1.2789,
    longitude: 36.8312,
    cuisine: ['Swahili', 'Coastal', 'Seafood'],
    rating: 4.6,
    deliveryTime: '25-35 min',
    deliveryFee: 180,
  },
  {
    id: 'rest_006',
    name: 'Ugali Corner',
    latitude: -1.2956,
    longitude: 36.8089,
    cuisine: ['Kenyan', 'Traditional', 'Local'],
    rating: 4.4,
    deliveryTime: '20-30 min',
    deliveryFee: 120,
  },
  {
    id: 'rest_007',
    name: 'Pilau Palace',
    latitude: -1.3012,
    longitude: 36.8267,
    cuisine: ['Swahili', 'Rice', 'Spiced'],
    rating: 4.7,
    deliveryTime: '30-40 min',
    deliveryFee: 160,
  },
  {
    id: 'rest_008',
    name: 'Samaki Fresh',
    latitude: -1.2845,
    longitude: 36.8145,
    cuisine: ['Seafood', 'Fish', 'Tilapia'],
    rating: 4.5,
    deliveryTime: '25-35 min',
    deliveryFee: 200,
  },
  {
    id: 'rest_009',
    name: 'Chapati Express',
    latitude: -1.2734,
    longitude: 36.8198,
    cuisine: ['Kenyan', 'Indian', 'Street Food'],
    rating: 4.8,
    deliveryTime: '20-30 min',
    deliveryFee: 80,
  },
  {
    id: 'rest_010',
    name: 'Sukuma Wiki Kitchen',
    latitude: -1.2698,
    longitude: 36.7934,
    cuisine: ['Kenyan', 'Vegetarian', 'Healthy'],
    rating: 4.6,
    deliveryTime: '25-35 min',
    deliveryFee: 130,
  },
];