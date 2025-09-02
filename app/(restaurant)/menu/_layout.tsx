import { Stack } from 'expo-router';

export default function MenuLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{headerShown: false}}/>
      <Stack.Screen name="edit-menu-item" options={{headerShown: false}}/>
      <Stack.Screen name="create-menu-item" options={{headerShown: false}}/>
    </Stack>
  );
}