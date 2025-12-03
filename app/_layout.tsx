import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { setupInterceptors } from "@/constants/api";
import { useEffect } from "react";
import { useTokenStorage } from "@/hooks/useTokenStorage";
import {
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const REGISTRATION_KEY = "user_registered";
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });
  const { getAccessToken, setAccessToken } = useTokenStorage();

  useEffect(() => {
    setupInterceptors({ getAccessToken, setAccessToken });
  }, [getAccessToken, setAccessToken]);

  useEffect(() => {
  const checkRegistrationStatus = async () => {
    try {
      const isRegistered = await AsyncStorage.getItem(REGISTRATION_KEY);
      if (isRegistered === "true") {
        router.replace("/auth/login");
      } else {
        console.log("User is not registered, staying on current screen");
      }
    } catch (error) {
      console.error("Error checking registration status:", error);
    }
  };

  checkRegistrationStatus();
}, []); 

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="welcome"
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="auth"
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
