export type UserRole = 'customer' | 'restaurant';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profileImage?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: number;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  cuisineType: string;
  isOpen: boolean;
  operatingHours: {
    open: string;
    close: string;
  };
}

export interface Dish {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  ingredients: string[];
  preparationTime: number;
}

export interface CartItem extends Dish {
  quantity: number;
  restaurantName: string;
}

export interface Order {
  id: string;
  customerId: string;
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  totalAmount: number;
  deliveryFee: number;
  createdAt: Date;
  estimatedDelivery?: Date;
  deliveryAddress: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  targetId: string; // restaurant or dish ID
  targetType: 'restaurant' | 'dish';
  rating: number;
  comment: string;
  createdAt: Date;
}