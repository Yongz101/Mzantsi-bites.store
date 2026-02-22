
import { FoodItem } from './types';

export const MENU_ITEMS: FoodItem[] = [
  {
    id: '1',
    name: 'Quarter Mutton Bunny Chow',
    description: 'A Durban classic. Hollowed out loaf of bread filled with spicy mutton curry, served with carrot sambals.',
    price: 125,
    category: 'Bunny Chow',
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=800&auto=format&fit=crop',
    spiciness: 'Hot',
    popular: true
  },
  {
    id: '2',
    name: 'Shisa Nyama Platter',
    description: 'A selection of flame-grilled Boerewors, Lamb Chops, and Chuck steak. Served with Chakalaka and Pap.',
    price: 245,
    category: 'Braai',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop',
    popular: true
  },
  {
    id: '3',
    name: 'Beef Oxtail Stew',
    description: 'Slow-cooked succulent beef oxtail in a rich gravy with carrots and butter beans.',
    price: 185,
    category: 'Main',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800&auto=format&fit=crop',
    spiciness: 'Mild'
  },
  {
    id: '4',
    name: 'Chakalaka & Pap',
    description: 'Traditional spicy vegetable relish served with fluffy maize porridge (Stiff Pap).',
    price: 65,
    category: 'Sides',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=800&auto=format&fit=crop',
    spiciness: 'Medium'
  },
  {
    id: '5',
    name: 'Malva Pudding',
    description: 'Sweet, spongy apricot jam pudding served warm with creamy vanilla custard.',
    price: 55,
    category: 'Dessert',
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '6',
    name: 'Bobotie',
    description: 'Spiced minced meat baked with an egg-based topping. A Cape Malay masterpiece.',
    price: 145,
    category: 'Main',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=800&auto=format&fit=crop',
    popular: true
  }
];

export const CATEGORIES: string[] = ['All', 'Braai', 'Bunny Chow', 'Main', 'Sides', 'Dessert'];
