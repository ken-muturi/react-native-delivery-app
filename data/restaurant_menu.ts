export interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  image: ReturnType<typeof require>;
  isPopular?: boolean;
}

export interface MenuCategory {
  category: string;
  subtitle?: string;
  dishes: Dish[];
}

export const nyamaChomaMenu: MenuCategory[] = [
  {
    category: 'Mchele na Ugali',
    subtitle: 'Staples',
    dishes: [
      {
        id: 1,
        name: 'Ugali na Sukuma Wiki',
        description: 'Traditional maize meal served with sautéed collard greens and tomato onion sauce',
        price: 350,
        image: require('@/assets/images/delivery-man.png'),
        isPopular: true,
      },
      {
        id: 2,
        name: 'Pilau ya Nyama',
        description: 'Aromatic spiced rice with tender beef, potatoes, and Swahili spices',
        price: 550,
        image: require('@/assets/images/delivery-man.png'),
      },
    ],
  },
  {
    category: 'Nyama Choma',
    subtitle: 'Grilled Meats',
    dishes: [
      {
        id: 3,
        name: 'Nyama Choma ya Mbuzi',
        description: 'Flame-grilled goat meat served with kachumbari and ugali',
        price: 850,
        image: require('@/assets/images/delivery-man.png'),
        isPopular: true,
      },
      {
        id: 4,
        name: 'Nyama Choma ya Ng\'ombe',
        description: 'Juicy grilled beef ribs with traditional spices',
        price: 750,
        image: require('@/assets/images/delivery-man.png'),
      },
      {
        id: 5,
        name: 'Mishkaki',
        description: 'Tender beef skewers marinated in Swahili spices, grilled to perfection',
        price: 450,
        image: require('@/assets/images/delivery-man.png'),
      },
    ],
  },
  {
    category: 'Samaki',
    subtitle: 'Fish',
    dishes: [
      {
        id: 6,
        name: 'Tilapia ya Kukaanga',
        description: 'Whole fried tilapia from Lake Victoria, crispy and delicious',
        price: 650,
        image: require('@/assets/images/delivery-man.png'),
        isPopular: true,
      },
      {
        id: 7,
        name: 'Samaki wa Kupaka',
        description: 'Fish in rich coconut sauce with Swahili spices',
        price: 700,
        image: require('@/assets/images/delivery-man.png'),
      },
      {
        id: 8,
        name: 'Omena na Ugali',
        description: 'Silver cyprinid fish sautéed with tomatoes and onions',
        price: 300,
        image: require('@/assets/images/delivery-man.png'),
      },
    ],
  },
  {
    category: 'Kuku',
    subtitle: 'Chicken',
    dishes: [
      {
        id: 9,
        name: 'Kuku Kienyeji',
        description: 'Free-range chicken stew cooked in traditional style',
        price: 750,
        image: require('@/assets/images/delivery-man.png'),
        isPopular: true,
      },
      {
        id: 10,
        name: 'Kuku Choma',
        description: 'Grilled whole chicken with herbs and spices',
        price: 800,
        image: require('@/assets/images/delivery-man.png'),
      },
      {
        id: 11,
        name: 'Kuku wa Kupaka',
        description: 'Coastal-style chicken in creamy coconut sauce',
        price: 650,
        image: require('@/assets/images/delivery-man.png'),
      },
    ],
  },
  {
    category: 'Chapati na Mandazi',
    subtitle: 'Breads',
    dishes: [
      {
        id: 12,
        name: 'Chapati (2 pcs)',
        description: 'Soft layered flatbread, perfect with stews',
        price: 50,
        image: require('@/assets/images/delivery-man.png'),
        isPopular: true,
      },
      {
        id: 13,
        name: 'Mandazi (4 pcs)',
        description: 'Sweet fried dough, Kenyan-style doughnuts',
        price: 80,
        image: require('@/assets/images/delivery-man.png'),
      },
      {
        id: 14,
        name: 'Mahamri (4 pcs)',
        description: 'Coconut-flavored triangular doughnuts from the coast',
        price: 100,
        image: require('@/assets/images/delivery-man.png'),
      },
    ],
  },
  {
    category: 'Mboga',
    subtitle: 'Vegetables',
    dishes: [
      {
        id: 15,
        name: 'Githeri',
        description: 'Traditional maize and beans stew with vegetables',
        price: 250,
        image: require('@/assets/images/delivery-man.png'),
      },
      {
        id: 16,
        name: 'Mukimo',
        description: 'Mashed potatoes with peas, corn, and greens - Kikuyu style',
        price: 300,
        image: require('@/assets/images/delivery-man.png'),
        isPopular: true,
      },
      {
        id: 17,
        name: 'Matoke',
        description: 'Mashed green bananas cooked in rich stew',
        price: 280,
        image: require('@/assets/images/delivery-man.png'),
      },
    ],
  },
  {
    category: 'Vinywaji',
    subtitle: 'Beverages',
    dishes: [
      {
        id: 18,
        name: 'Chai ya Tangawizi',
        description: 'Kenyan ginger tea with milk - refreshing and warming',
        price: 80,
        image: require('@/assets/images/delivery-man.png'),
        isPopular: true,
      },
      {
        id: 19,
        name: 'Mala',
        description: 'Traditional fermented milk, creamy and tangy',
        price: 100,
        image: require('@/assets/images/delivery-man.png'),
      },
      {
        id: 20,
        name: 'Passion Juice',
        description: 'Fresh passion fruit juice, sweet and refreshing',
        price: 120,
        image: require('@/assets/images/delivery-man.png'),
      },
      {
        id: 21,
        name: 'Madafu',
        description: 'Fresh coconut water, straight from the shell',
        price: 150,
        image: require('@/assets/images/delivery-man.png'),
      },
    ],
  },
];

export const getDishById = (id: number): Dish | undefined => {
  const allDishes = nyamaChomaMenu.flatMap((category) => category.dishes);
  return allDishes.find((dish) => dish.id === id);
};