import { Stack } from "expo-router";
import React from "react";

export default function PaymentLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false, title: "" }} />
    </Stack>
  );
}
