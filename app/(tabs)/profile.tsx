import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  Switch,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { getInitials } from "@/constants/data";
import { useAuthStore } from "@/hooks/useAuth";
import { useMemberStore } from "@/store/user";

export default function Profile() {
  const router = useRouter();
  const [hideBalance, setHideBalance] = useState(false);
  const { user } = useAuthStore();
  const { member } = useMemberStore();

  const links = [
    { id: 1, title: "Edit Profile", route: "/profile/edit" },
    { id: 2, title: "Edit Next of Kin", route: "/profile/next-of-kin" },
    { id: 3, title: "Termination", route: "/profile/termination" },
    { id: 4, title: "Request Refund", route: "/profile/refund" },
    { id: 5, title: "Change Password", route: "/profile/change-password" },
    { id: 6, title: "Account Statement", route: "/profile/account-statement" },
    { id: 7, title: "Contact Us", route: "/profile/contact-us" },
  ];

  const handlePress = (link: any) => {
    router.push(link.route);
  };

  const handleLogout = () => {
    router.replace("/auth/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="menu" size={24} color="#333" />
          <Ionicons
            name="search"
            size={24}
            color="#333"
            style={{ marginLeft: 20 }}
          />
        </View>
        <View style={styles.headerRight}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {getInitials(user?.full_name || "")}
            </Text>
          </View>
          <Ionicons
            name="notifications"
            size={24}
            color="#333"
            style={{ marginLeft: 10 }}
          />
        </View>
      </View>
      <ScrollView>
        <View style={styles.profileSection}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>
              {getInitials(user?.full_name || "")}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.fullName}>{user?.full_name}</Text>
            <Text style={styles.username}>@{member?.username}</Text>
          </View>
        </View>

        <View style={styles.menu}>
          {links.map((link) => (
            <TouchableOpacity
              key={link.id}
              style={styles.menuItem}
              onPress={() => handlePress(link)}
            >
              <Text style={styles.menuText}>{link.title}</Text>
            </TouchableOpacity>
          ))}

          <View style={styles.switchItem}>
            <Text style={styles.menuText}>Hide Balance</Text>
            <Switch
              value={hideBalance}
              onValueChange={setHideBalance}
              trackColor={{ false: "#ddd", true: "#4CAF50" }}
              thumbColor={hideBalance ? "#fff" : "#f4f3f4"}
            />
          </View>

          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Text style={styles.menuText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Poppins_400Regular",
  },
  headerRight: { flexDirection: "row", alignItems: "center" },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  avatarLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarLargeText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Poppins_400Regular",
  },
  profileInfo: {
    marginLeft: 15,
  },
  fullName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "Poppins_400Regular",
  },
  username: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
    fontFamily: "Poppins_400Regular",
  },
  menu: { padding: 20 },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  menuText: { fontSize: 18, color: "#333", fontFamily: "Poppins_400Regular" },
  switchItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});
