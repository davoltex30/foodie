import { create } from 'zustand';
import { Restaurant, Dish } from '@/types';

interface RestaurantState {
  restaurants: Restaurant[];
  dishes: Dish[];
  nearbyRestaurants: Restaurant[];
  isLoading: boolean;
  fetchRestaurants: () => Promise<void>;
  fetchDishes: () => Promise<void>;
  fetchNearbyRestaurants: (latitude: number, longitude: number) => Promise<void>;
}

const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Bella Italia',
    description: 'Authentic Italian cuisine with fresh ingredients',
    image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    reviewCount: 127,
    deliveryTime: '25-35 min',
    deliveryFee: 2.99,
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      address: '123 Italian St, San Francisco, CA'
    },
    cuisineType: 'Italian',
    isOpen: true,
    operatingHours: { open: '11:00', close: '23:00' }
  },
  {
    id: '2',
    name: 'Sushi Zen',
    description: 'Premium sushi and Japanese dishes',
    image: 'https://images.pexels.com/photos/357573/pexels-photo-357573.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    reviewCount: 89,
    deliveryTime: '30-40 min',
    deliveryFee: 3.99,
    location: {
      latitude: 37.7849,
      longitude: -122.4094,
      address: '456 Sushi Ave, San Francisco, CA'
    },
    cuisineType: 'Japanese',
    isOpen: true,
    operatingHours: { open: '12:00', close: '22:00' }
  },
  {
    id: '3',
    name: 'Burger Palace',
    description: 'Gourmet burgers and sides',
    image: 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.2,
    reviewCount: 203,
    deliveryTime: '20-30 min',
    deliveryFee: 1.99,
    location: {
      latitude: 37.7649,
      longitude: -122.4294,
      address: '789 Burger Blvd, San Francisco, CA'
    },
    cuisineType: 'American',
    isOpen: false,
    operatingHours: { open: '10:00', close: '21:00' }
  }
];

const mockDishes: Dish[] = [
  {
    id: '1',
    restaurantId: '1',
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil',
    price: 16.99,
    image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Pizza',
    rating: 4.6,
    reviewCount: 45,
    isAvailable: true,
    ingredients: ['Tomato sauce', 'Mozzarella', 'Fresh basil'],
    preparationTime: 15
  },
  {
    id: '2',
    restaurantId: '2',
    name: 'Salmon Sashimi',
    description: 'Fresh Atlantic salmon, expertly sliced',
    price: 24.99,
    image: 'https://images.pexels.com/photos/248444/pexels-photo-248444.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Sashimi',
    rating: 4.9,
    reviewCount: 32,
    isAvailable: true,
    ingredients: ['Fresh salmon', 'Wasabi', 'Pickled ginger'],
    preparationTime: 10
  },
  {
    id: '3',
    restaurantId: '3',
    name: 'Classic Burger',
    description: 'Beef patty with lettuce, tomato, and special sauce',
    price: 12.99,
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Burgers',
    rating: 4.3,
    reviewCount: 78,
    isAvailable: true,
    ingredients: ['Beef patty', 'Lettuce', 'Tomato', 'Special sauce'],
    preparationTime: 12
  }
];

export const useRestaurantStore = create<RestaurantState>((set) => ({
  restaurants: [],
  dishes: [],
  nearbyRestaurants: [],
  isLoading: false,

  fetchRestaurants: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 800));
    set({ restaurants: mockRestaurants, isLoading: false });
  },

  fetchDishes: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 600));
    set({ dishes: mockDishes, isLoading: false });
  },

  fetchNearbyRestaurants: async (latitude: number, longitude: number) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    set({ nearbyRestaurants: mockRestaurants, isLoading: false });
  },
}));