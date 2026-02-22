
export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: FoodCategory;
  image: string;
  spiciness?: 'Mild' | 'Medium' | 'Hot';
  popular?: boolean;
}

export type FoodCategory = 'Braai' | 'Bunny Chow' | 'Main' | 'Sides' | 'Dessert' | 'Beverages';

export interface CartItem extends FoodItem {
  quantity: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
