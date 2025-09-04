import { JwtPayload } from 'jwt-decode';

export type UserRole = 'customer' | 'restaurant';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready_for_pickup' | 'picked_up' | 'delivered' | 'on_the_way' | 'arrived' | 'refunded' | 'cancelled';

export const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  'pending': ['confirmed', 'cancelled'],
  'confirmed': ['preparing', 'cancelled'],
  'preparing': ['ready_for_pickup', 'cancelled'],
  'ready_for_pickup': ['picked_up', 'cancelled'],
  'picked_up': ['on_the_way', 'cancelled'],
  'on_the_way': ['arrived'],
  'arrived': ['delivered'],
  'delivered': ['refunded'], // only for disputes
  'cancelled': [], // final state
  'refunded': []   // final state
};

export interface CustomJwtPayload extends JwtPayload {
  user_role?: string;  // Make it optional to handle missing values safely
}

export interface Restaurant {
  restaurant_id: string;
  name: string;
  email: string;
  description?: string;
  phone_number?: string,
  is_active: boolean,
  logo_url?: string,
  banner_url?: string,
  latitude?: number,
  longitude?: number,
  created_at: string,
  updated_at: string,

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

export interface ImageData {
  uri: string;
  fileExtension: string | null;
  base64: string | null;
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

export interface Category {
  id: string,
  name: string;
  created_at: string;
}

export interface Rating {
  id: string,
  menu_item: string;
  customer: string;
  rating: string;
  comment: string;
  created_at: string;
  updated_at: string;
}
export interface MenuItemFormData {
  name: string;
  description?: string;
  price: number;
  est_prep_time: number;
  image_url: string;
  restaurant: string;
  category: string;
  is_available: boolean;
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
  est_prep_time: number;
  restaurant: {
    restaurant_id: string;
    name: string;
  };
  category?: {
    id: string,
    name: string
  };
  ratings: Array<{
    id: string,
    rating: number,
    comment?: string,
    customer: {
      first_name: string,
      last_name: string,
      avatar_url?: string,
    },
    created_at: string,
  }>
  avgRating?: number;
  ratingCount?: number;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  customer: string;
  restaurant: string;
  courier?: string;
  order_items: Array<{
    id: string,
    menu_item: {
      id: string,
      name: string,
      image_url: string,
    },
    quantity: number,
    price: number,
    created_at: string,
  }>;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready_for_pickup' | 'picked_up' | 'delivered' | 'on_the_way' |  'arrived' | 'refunded' | 'cancelled';
  total_amount: number;
  deliveryFee: number;
  est_delivery_time: number;
  delivery_longitude: number;
  delivery_latitude: number;
  created_at: string;
  updated_at: string;
  accepted_at?: string;
  prepared_at?: string;
  picked_up_at?: string;
  delivered_at?: string;
}


export interface OrderItem{
  id: string,
  order: string,
  menu_item: {
    id: string,
    name: string,
    image_url: string,
  },
  quantity: number,
  price: number,
  created_at: string,
}