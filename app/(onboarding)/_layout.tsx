import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="name" />
      <Stack.Screen name="motivation" />
      <Stack.Screen name="weakness" />
      <Stack.Screen name="assessment" />
      <Stack.Screen name="time" />
      <Stack.Screen name="oath" />
      <Stack.Screen name="index" />
    </Stack>
  );
}
