
export interface Variation {
  name: string;
  price: number;
}

export interface VariationGroup {
  id: string;
  name: string;
  variations: Variation[];
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: FoodCategory;
  image: string;
  spiciness?: 'Mild' | 'Medium' | 'Hot';
  popular?: boolean;
  originalPrice?: number;
  price_actual?: number;
  availableFrom?: string;
  availableUntil?: string;
  isDineInOnly?: boolean;
  variations?: VariationGroup[];
}

export type FoodCategory = 'Braai' | 'Bunny Chow' | 'Main' | 'Sides' | 'Dessert' | 'Beverages';

export type UserRole = 'customer' | 'store' | 'driver' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface Order {
  id: string;
  customerId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'preparing' | 'on-the-way' | 'delivered' | 'cancelled';
  createdAt: string;
  driverId?: string;
}

export interface CartItem extends FoodItem {
  quantity: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
