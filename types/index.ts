import { Category, Rating } from '@/store/restaurantStore';

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

export interface RestaurantProfile {
  restaurant_id: string;
  name: string;
  email: string;
  description: string;
  location: string;
  phone_number: string;
  is_active: boolean;
  logo_url: string;
  banner_url: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerProfile {
  customer_id: string;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  location: string;
  phone_number: string;
  is_active: boolean;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}



export interface Dish {
  id: string;
  restaurant: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  // rating: number;
  // reviewCount: number;
  is_available: boolean;
  // ingredients: string[];
  prep_time: number;
}

export interface MenuItem {
  id: string;
  name: string,
  price: number;
  description: string;
  created_at: string;
  updated_at: string;
  image_url: string | null;
  is_available: boolean;
  prep_time: number;
  restaurant: string;
  category?: {
    name: string
  };
  ratings: Array<{
    rating: number,
  }>
  avgRating?: number;
  ratingCount?: number;
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