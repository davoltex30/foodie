import { create } from 'zustand'
import { Session } from '@supabase/auth-js/src/lib/types'
import { CustomerProfile, CustomJwtPayload, RestaurantProfile } from '@/types';
import { supabase } from '@/utils/supabase';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
  isAuthenticated: boolean;
  session: Session | null;
  restaurantProfile: RestaurantProfile | null;
  customerProfile: CustomerProfile | null;
  initializeSession: () => Promise<void>;
  signOut: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  fetchRestaurantProfile: (user_id: string) => Promise<void>;
  fetchCustomerProfile: (user_id: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  session: null,
  restaurantProfile: null,
  customerProfile: null,
  initializeSession: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({
        session,
        isAuthenticated: session !== null,
      });

      const { fetchRestaurantProfile, fetchCustomerProfile} = get()

      if (session) {
        try {
          const jwt = jwtDecode<CustomJwtPayload>(session.access_token);
          if (jwt.user_role === 'restaurant') {
            await fetchRestaurantProfile(session.user.id)
            router.replace('/(restaurant)');
          }else if(jwt.user_role === 'customer') {
            await fetchCustomerProfile(session.user.id)
            router.replace('/(customer)');
          }else{
            //Todo add fetch courier profile here
          }
        } catch (error) {
          console.error('Error decoding JWT:', error);
        }
      }

    } catch (error) {
      set({ session: null, isAuthenticated: false, restaurantProfile: null });
    }
  },
  fetchRestaurantProfile: async (user_id: string) => {
    try {
      const { data: restaurantData, error: restaurantError } =
        await supabase
          .from('restaurants')
          .select('*')
          .eq('restaurant_id', user_id)
          .single();

      if (restaurantError) {
        console.error('Error fetching restaurant profile:', restaurantError);
        return;
      }
      set({ restaurantProfile: restaurantData });
    } catch (error) {
      console.error('Unexpected error fetching restaurant profile:', error);
      Toast.show({
        position: 'bottom',
        type: 'error',
        text1: 'Failed to fetch restaurant profile',
        text2: 'An unexpected error occurred'
      });
    }
  },
  fetchCustomerProfile: async (user_id: string) => {
    try {
      const { data: customerProfile, error: customerProfileError } =
        await supabase
          .from('customers')
          .select('*')
          .eq('customer_id', user_id)
          .single();

      if (customerProfileError) {
        console.error('Error fetching customer profile:', customerProfileError);
        Toast.show({
          position: 'bottom',
          type: 'error',
          text1: 'Failed to fetch customer profile',
          text2: customerProfileError.message
        });
        return;
      }
      set({ customerProfile: customerProfile });
    } catch (error) {
      console.error('Unexpected error fetching customer profile:', error);
      Toast.show({
        position: 'bottom',
        type: 'error',
        text1: 'Failed to fetch customer profile',
        text2: 'An unexpected error occurred'
      });
    }
  },
  login: async () => {

  },
  signOut: async () => {
    try {
      await supabase.auth.signOut({scope: "local"});
      set({ session: null, isAuthenticated: false, restaurantProfile: null });
      router.replace('/role-selection');
    } catch (error) {
      Toast.show({
        position: 'bottom',
        type: 'error',
        text1: 'Error signing out',
        text2: error.message
      });
    }
  },
}));