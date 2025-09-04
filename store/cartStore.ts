import { create } from 'zustand';
import { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getItemsByRestaurant: () => Record<string, CartItem[]>;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  totalAmount: 0,
  itemCount: 0,

  addItem: (item: CartItem) => {
    const { items } = get();
    const existingItem = items.find(i => i.id === item.id);
    
    let newItems;
    if (existingItem) {
      newItems = items.map(i => 
        i.id === item.id 
          ? { ...i, quantity: i.quantity + item.quantity }
          : i
      );
    } else {
      newItems = [...items, item];
    }
    
    const totalAmount = newItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const itemCount = newItems.reduce((sum, i) => sum + i.quantity, 0);
    
    set({ items: newItems, totalAmount, itemCount });
  },

  removeItem: (itemId: string) => {
    const { items } = get();
    const newItems = items.filter(i => i.id !== itemId);
    const totalAmount = newItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const itemCount = newItems.reduce((sum, i) => sum + i.quantity, 0);
    
    set({ items: newItems, totalAmount, itemCount });
  },

  updateQuantity: (itemId: string, quantity: number) => {
    const { items } = get();
    const newItems = items.map(i => 
      i.id === itemId ? { ...i, quantity } : i
    ).filter(i => i.quantity > 0);
    
    const totalAmount = newItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const itemCount = newItems.reduce((sum, i) => sum + i.quantity, 0);
    
    set({ items: newItems, totalAmount, itemCount });
  },

  clearCart: () => {
    set({ items: [], totalAmount: 0, itemCount: 0 });
  },

  getItemsByRestaurant: () => {
    const { items } = get();
    return items.reduce((acc, item) => {
      const restaurantId = item.restaurant;
      if (!acc[restaurantId]) {
        acc[restaurantId] = [];
      }
      acc[restaurantId].push(item);
      return acc;
    }, {} as Record<string, CartItem[]>);
  },
}));