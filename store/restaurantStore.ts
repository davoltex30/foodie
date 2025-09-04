// stores/useRestaurantStore.ts
import { create } from 'zustand';
import { MenuItem, Category, MenuItemFormData, Restaurant } from '@/types';
import { supabase } from '@/utils/supabase';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';


interface RestaurantState {
  menuItems: MenuItem[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  currentRestaurantId: string | null;
  restaurants: Restaurant[];

  // Actions
  setCurrentRestaurant: (restaurantId: string) => void;
  fetchMenuItems: (restaurantId?: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchRestaurants: () => Promise<void>;
  fetchAllMenuItems: () => Promise<void>;
  fetchRestaurantMenuItems: (restaurantId?: string) => Promise<void>;
  searchMenuItems: (searchTerm: string, restaurantId?: string) => Promise<MenuItem[]>;
  getMenuByCategory: (categoryId: string, restaurantId?: string) => Promise<MenuItem[]>;
  getAvailableItemsWithPrepTime: (maxPrepTime?: number, restaurantId?: string) => Promise<MenuItem[]>;
  createMenuItem: (menuItemData: MenuItemFormData) => Promise<void>;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => Promise<MenuItem | null>;
  toggleMenuItemAvailability: (id: string) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  refreshMenuItems: () => Promise<void>;
  clearError: () => void;
}

export const useRestaurantStore = create<RestaurantState>((set, get) => ({
  // Initial state
  menuItems: [],
  loading: false,
  error: null,
  currentRestaurantId: null,
  categories: [],
  restaurants: [],

  // Set current restaurant
  setCurrentRestaurant: (restaurantId: string) => {
    set({ currentRestaurantId: restaurantId });
  },

  // Fetch menu items without ratings
  fetchMenuItems: async (restaurantId?: string) => {
    const targetRestaurantId = restaurantId || get().currentRestaurantId;
    if (!targetRestaurantId) {
      set({ error: 'No restaurant ID provided' });
      return;
    }

    set({ loading: true, error: null });

    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select(`
          *,
          category:categories(name)
        `)
        .eq('restaurant', targetRestaurantId)
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ menuItems: data || [], loading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch menu items',
        loading: false
      });
    }
  },

  // Fetch categories
  fetchCategories: async () => {
    set({ loading: true, error: null });

    try {
      const { data, error } = await supabase
        .from('categories')
        .select(`*`)
        .order("name")

      if (error) throw error;

      set({ categories: data || [], loading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch categories',
        loading: false
      });
    }
  },


  //Fetch all active restaurants
  fetchRestaurants: async () => {
    try {
      const { data, error } = await supabase.rpc("get_all_restaurants_with_coordinates")

      if (error) throw error;

      set({ restaurants: data || [] });
    } catch (error: any) {
      console.log(error)
    }
  },

  // Fetch menu items with ratings (main function)
  fetchRestaurantMenuItems: async (restaurantId?: string) => {
    const targetRestaurantId = restaurantId || get().currentRestaurantId;
    if (!targetRestaurantId) {
      set({ error: 'No restaurant ID provided' });
      return;
    }

    set({ loading: true, error: null });

    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select(`
          *,
          category:categories(id, name),
          ratings:ratings(
            id, 
            rating, 
            comment,
            created_at,
            customer: customers(
              first_name,
              last_name,
              avatar_url
            )
          )
        `)
        .eq('restaurant', targetRestaurantId)
        .order('category');

      if (error) throw error;

      // Calculate average ratings
      const menuItemsWithRatings = (data || []).map(item => {
        const ratings = item.ratings.map((r: Rating) => r.rating);
        const avgRating = ratings.length > 0
          ? ratings.reduce((sum: any, rating: any) => sum + rating, 0) / ratings.length
          : 0;

        return {
          ...item,
          avgRating: Math.round(avgRating * 10) / 10,
          ratingCount: ratings.length
        };
      });

      set({ menuItems: menuItemsWithRatings, loading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch menu items with ratings',
        loading: false
      });
    } finally {
      set({loading: false})
    }
  },

  // Fetch menu items with ratings (main function)
  fetchAllMenuItems: async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select(`
          *,
          restaurant:restaurants(restaurant_id, name),
          category:categories(id, name),
          ratings:ratings(
            id, 
            rating, 
            comment,
            created_at,
            customer: customers(
              first_name,
              last_name,
              avatar_url
            )
          )
        `)
        .eq('is_available', true)

      if (error) throw error;

      // Calculate average ratings
      const menuItemsWithRatings = (data || []).map(item => {
        const ratings = item.ratings.map((r: Rating) => r.rating);
        const avgRating = ratings.length > 0
          ? ratings.reduce((sum: any, rating: any) => sum + rating, 0) / ratings.length
          : 0;

        return {
          ...item,
          avgRating: Math.round(avgRating * 10) / 10,
          ratingCount: ratings.length
        };
      });
      set({ menuItems: menuItemsWithRatings});
    } catch (error: any) {
      console.log("error fetching all menuItems", error)
    }
  },

  // Search menu items
  searchMenuItems: async (searchTerm: string, restaurantId?: string) => {
    const targetRestaurantId = restaurantId || get().currentRestaurantId;
    if (!targetRestaurantId) {
      throw new Error('No restaurant ID provided');
    }

    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select(`
          *,
          category:categories(name),
          ratings:ratings(rating)
        `)
        .eq('restaurant', targetRestaurantId)
        .ilike('description', `%${searchTerm}%`)
        .eq('is_available', true);

      if (error) throw error;

      // Calculate average ratings
      return (data || []).map(item => {
        const ratings = item.ratings.map((r: Rating) => r.rating);
        const avgRating = ratings.length > 0
          ? ratings.reduce((sum: any, rating: any) => sum + rating, 0) / ratings.length
          : 0;

        return {
          ...item,
          avgRating: Math.round(avgRating * 10) / 10,
          ratingCount: ratings.length
        };
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to search menu items');
    }
  },

  // Get menu items by category
  getMenuByCategory: async (categoryId: string, restaurantId?: string) => {
    const targetRestaurantId = restaurantId || get().currentRestaurantId;
    if (!targetRestaurantId) {
      throw new Error('No restaurant ID provided');
    }

    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select(`
          *,
          category:categories(name),
          ratings:ratings(rating)
        `)
        .eq('restaurant', targetRestaurantId)
        .eq('category', categoryId)
        .eq('is_available', true);

      if (error) throw error;

      // Calculate average ratings
      return (data || []).map(item => {
        const ratings = item.ratings.map((r: Rating) => r.rating);
        const avgRating = ratings.length > 0
          ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
          : 0;

        return {
          ...item,
          avgRating: Math.round(avgRating * 10) / 10,
          ratingCount: ratings.length
        };
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch menu by category');
    }
  },

  // Get available items with prep time filter
  getAvailableItemsWithPrepTime: async (maxPrepTime?: number, restaurantId?: string) => {
    const targetRestaurantId = restaurantId || get().currentRestaurantId;
    if (!targetRestaurantId) {
      throw new Error('No restaurant ID provided');
    }

    try {
      let query = supabase
        .from('menu_items')
        .select(`
          *,
          category:categories(name),
          ratings:ratings(rating)
        `)
        .eq('restaurant', targetRestaurantId)
        .eq('is_available', true)
        .order('prep_time', { ascending: true });

      if (maxPrepTime) {
        query = query.lte('prep_time', maxPrepTime);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Calculate average ratings
      return (data || []).map(item => {
        const ratings = item.ratings.map((r: Rating) => r.rating);
        const avgRating = ratings.length > 0
          ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
          : 0;

        return {
          ...item,
          avgRating: Math.round(avgRating * 10) / 10,
          ratingCount: ratings.length
        };
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch menu items');
    }
  },

  // Create new menu item
  createMenuItem: async (menuItemData: MenuItemFormData) => {
    try {
      // Perform the insert operation
      const { error } = await supabase
        .from('menu_items')
        .insert([{
          ...menuItemData
        }])

      if (error) throw error;

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Menu item created successfully!'
      });
      await get().fetchRestaurantMenuItems(menuItemData.restaurant)
      router.back()
    } catch (error: any) {
      set({ error: error.message || 'Failed to create menu item' });
    }
  },

  // Update menu item
  updateMenuItem: async (id: string, updates: Partial<MenuItem>) => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      set(state => ({
        menuItems: state.menuItems.map(item =>
          item.id === id ? { ...item, ...data } : item
        )
      }));

      return data;
    } catch (error: any) {
      set({ error: error.message || 'Failed to update menu item' });
      return null;
    }
  },

  // Toggle menu item availability
  toggleMenuItemAvailability: async (id: string) => {
    const item = get().menuItems.find(item => item.id === id);
    if (!item) return;

    try {
      await get().updateMenuItem(id, {
        is_available: !item.is_available
      });
    } catch (error: any) {
      set({ error: error.message || 'Failed to toggle availability' });
    }
  },

  // Delete menu item
  deleteMenuItem: async (id: string) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Remove from local state
      set(state => ({
        menuItems: state.menuItems.filter(item => item.id !== id)
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete menu item' });
    }
  },

  // Refresh menu items
  refreshMenuItems: async () => {
    await get().fetchRestaurantMenuItems();
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));