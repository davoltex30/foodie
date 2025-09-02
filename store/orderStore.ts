// store/orderStore.ts
import { create } from 'zustand';
import { Order } from '@/types';
import { supabase } from '@/utils/supabase';

interface OrderStore {
  orders: Order[];
  currentOrder: Order | null;
  fetchOrders: () => Promise<void>;
  createOrder: (orderData: Omit<Order, 'id'>) => Promise<number>;
  updateOrderStatus: (orderId: number, status: Order['status']) => Promise<void>;
  clearCurrentOrder: () => void;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  currentOrder: null,

  fetchOrders: async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)');

    if (error) {
      console.error('Error fetching orders:', error);
      return;
    }

    set({ orders: data });
  },

  createOrder: async (orderData) => {
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        total_amount: orderData.total_amount,
        status: orderData.status,
        customer: orderData.customer,
      }])

    if (error) {
      throw new Error(`Failed to create order: ${error.message}`);
    }

    const orderId = data[0].id;

    // Insert order items
    await supabase
      .from('order_items')
      .insert(orderData.items.map(item => ({
        order: orderId,
        ...item
      })));

    return orderId;
  },

  updateOrderStatus: async (orderId, status) => {
    const { error } = await supabase
      .from('orders')
      .update({
        id: orderId,
        status
      });

    if (error) {
      throw new Error(`Failed to update order status: ${error.message}`);
    }

    set(state => ({
      orders: state.orders.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    }));
  },

  clearCurrentOrder: () => set({ currentOrder: null })
}));