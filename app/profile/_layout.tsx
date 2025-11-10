import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen name="edit" options={{ headerShown: false }} />
      <Stack.Screen name="next-of-kin" options={{ headerShown: false }} />
      <Stack.Screen name="refund" options={{ headerShown: false }} />
      <Stack.Screen name="termination" options={{ headerShown: false }} />
      <Stack.Screen name="account-statement" options={{ headerShown: false }} />
      <Stack.Screen name="change-password" options={{ headerShown: false }} />
      <Stack.Screen name="contact-us" options={{ headerShown: false }} />
    </Stack>
  );
}
