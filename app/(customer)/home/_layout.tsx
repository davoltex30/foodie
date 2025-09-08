import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{headerShown: false}}/>
      <Stack.Screen name="menu-item-details" options={{headerShown: false}}/>
      <Stack.Screen name="restaurant-details" options={{headerShown: false}}/>
    </Stack>
  );
}