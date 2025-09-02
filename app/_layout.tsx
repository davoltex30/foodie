import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useAuthStore } from '@/store/authStore';
import Toast from 'react-native-toast-message';
import { useAppStateListener } from '@/hooks/useAppStateListener';
import { useEffect } from 'react';

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

  //TODO add the react-native-keyboard-controller to the signup, login, after build
  //TODO  change the rn-phone-input in sign to react-native-phone-number-input after build

  return (
    <>
      {/*<KeyboardProvider>*/}
      <Stack screenOptions={{ headerShown: false }}>
        {/* Public routes - accessible without authentication */}
        <Stack.Screen name="role-selection" />
        <Stack.Screen name="login" />
        <Stack.Screen name="sign-up" />

        {/* Protected routes - only accessible when authenticated */}
        <Stack.Protected guard={isAuthenticated}>
          {/* Customer routes - only accessible to customers */}
          <Stack.Protected guard={session?.user.user_metadata.role === 'customer'}>
            <Stack.Screen name="(customer)" />
          </Stack.Protected>

          {/* Restaurant routes - only accessible to restaurants */}
          <Stack.Protected guard={session?.user.user_metadata.role === 'restaurant'}>
            <Stack.Screen name="(restaurant)" />
          </Stack.Protected>
        </Stack.Protected>

        {/* Fallback */}
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
      <Toast />
      {/*</KeyboardProvider>*/}
    </>
  );
}