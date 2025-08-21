// hooks/useAppStateListener.ts
import { AppState } from 'react-native';
import { useEffect } from 'react';
import { supabase } from '@/utils/supabase';

export function useAppStateListener() {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);
}