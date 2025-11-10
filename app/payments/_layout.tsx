import { Stack } from "expo-router";
import React from "react";
import { PaystackProvider } from "react-native-paystack-webview";

export default function PaymentLayout() {
  return (
    <PaystackProvider
      debug
      publicKey="pk_test_85df7be5df5514e6966c2fce715825daf8e07612"
      currency="NGN"
      defaultChannels={["mobile_money", "card"]}
    >
      <Stack>
        <Stack.Screen
          name="index"
          options={{ headerShown: false, title: "" }}
        />
        <Stack.Screen
          name="withdrawal"
          options={{ headerShown: false, title: "Withrawal Application" }}
        />
      </Stack>
    </PaystackProvider>
  );
}
