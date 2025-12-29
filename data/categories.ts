export interface Category {
  id: string;
  name: string;
  placesCount: number;
  image: any;
  backgroundColor: string;
}

export const categories: Category[] = [
  {
    id: 'cat_nyama_choma',
    name: 'Nyama Choma',
    placesCount: 24,
    image: require('@/assets/images/delivery-man.png'),
    backgroundColor: '#E8DCD9',
  },
  {
    id: 'cat_samaki',
    name: 'Samaki',
    placesCount: 18,
    image: require('@/assets/images/delivery-man.png'),
    backgroundColor: '#D4E8F2',
  },
  {
    id: 'cat_swahili',
    name: 'Swahili',
    placesCount: 15,
    image: require('@/assets/images/delivery-man.png'),
    backgroundColor: '#F5EFCF',
  },
  {
    id: 'cat_kuku',
    name: 'Kuku',
    placesCount: 22,
    image: require('@/assets/images/delivery-man.png'),
    backgroundColor: '#F4D7C7',
  },
  {
    id: 'cat_ugali',
    name: 'Ugali & Sukuma',
    placesCount: 35,
    image: require('@/assets/images/delivery-man.png'),
    backgroundColor: '#E5F4E3',
  },
  {
    id: 'cat_chapati',
    name: 'Chapati & Mandazi',
    placesCount: 28,
    image: require('@/assets/images/delivery-man.png'),
    backgroundColor: '#F5E6D3',
  },
  {
    id: 'cat_pilau',
    name: 'Pilau & Biryani',
    placesCount: 12,
    image: require('@/assets/images/delivery-man.png'),
    backgroundColor: '#FCE4D6',
  },
  {
    id: 'cat_breakfast',
    name: 'Breakfast',
    placesCount: 20,
    image: require('@/assets/images/delivery-man.png'),
    backgroundColor: '#E5E5E5',
  },
];