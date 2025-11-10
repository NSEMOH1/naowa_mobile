import { Tabs } from "expo-router";
import React from "react";
import { Platform, Image } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#213400",
        tabBarInactiveTintColor: "#8E8E93",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderTopWidth: 1,
            borderTopColor: "rgba(0, 0, 0, 0.1)",
            paddingTop: 8,
            paddingBottom: 25,
            height: 85,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: -2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          },
          android: {
            backgroundColor: "#FFFFFF",
            borderTopWidth: 1,
            borderTopColor: "rgba(0, 0, 0, 0.1)",
            paddingTop: 8,
            paddingBottom: 8,
            height: 70,
            elevation: 8,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
          default: {
            backgroundColor: "#FFFFFF",
            borderTopWidth: 1,
            borderTopColor: "rgba(0, 0, 0, 0.1)",
            paddingTop: 8,
            paddingBottom: 8,
            height: 70,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }),
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require("../../assets/images/tabhome.png")} 
              style={{ width: 24, height: 24, tintColor: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="loan"
        options={{
          title: "Loans",
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require("../../assets/images/tabloan.png")} 
              style={{ width: 24, height: 24, tintColor: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="savings"
        options={{
          title: "Savings",
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require("../../assets/images/tabpiggy.png")} 
              style={{ width: 24, height: 24, tintColor: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require("../../assets/images/tabprofile.png")} 
              style={{ width: 20, height: 24, tintColor: color }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
