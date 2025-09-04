import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useAuthStore } from '@/store/authStore';
import Toast from 'react-native-toast-message';
import { useAppStateListener } from '@/hooks/useAppStateListener';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { CustomJwtPayload } from '@/types';

export default function RootLayout() {
  useFrameworkReady();

  const initializeSession = useAuthStore(state => state.initializeSession);
  useEffect(() => {
    initializeSession();
  }, []);

  // session token refresh
  useAppStateListener();

  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const session = useAuthStore(state => state.session);

  // State to hold the decoded role
  const [userRole, setUserRole] = useState(null);

  // Decode token and extract role when session becomes available
  useEffect(() => {
    if (session?.access_token) {
      try {
        const jwt = jwtDecode<CustomJwtPayload>(session.access_token);
        setUserRole(jwt.user_role || session.user.user_metadata.role);
      } catch (error) {
        console.error('Error decoding JWT:', error);
      }
    }
  }, [session]);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Public routes */}
        <Stack.Screen name="role-selection" />
        <Stack.Screen name="login" />
        <Stack.Screen name="sign-up" />

        {/* Protected routes */}
        <Stack.Protected guard={isAuthenticated}>
          {/* Customer routes */}
          <Stack.Protected guard={userRole === 'customer'}>
            <Stack.Screen name="(customer)" />
          </Stack.Protected>

          {/* Restaurant routes */}
          <Stack.Protected guard={userRole === 'restaurant'}>
            <Stack.Screen name="(restaurant)" />
          </Stack.Protected>
        </Stack.Protected>

        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
      <Toast />
    </>
  );
}