import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import api from "@/constants/api";
import { useAuthStore } from "@/hooks/useAuth";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();

  const handleSignup = () => {
    router.push("/auth/signup");
  };

  const handleForgotPassword = () => {
    router.push("/auth/forgot-password");
  };

  const payload = {
    username: username,
    password: password,
  };

  const handleSignin = async () => {
    setLoading(true);
    try {
      // const res = await api.post("/api/auth/member/login", payload);
      // setUser(res.data.user);
      router.push("/(tabs)");
    } catch (e) {
      console.error(e);
      setErrorMessage("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.greenCard}>
          <Image
            source={require("../../assets/images/naowa.png")}
            style={styles.logo}
          />
          <View style={{ flex: 1, paddingLeft: 10 }}>
            <Text style={styles.greenTitle}>
              NAOWA MULTIPURPOSE COOPERATIVE SOCIETY
            </Text>
            <Text style={styles.greenSubtitle}>
              Fast and Easy Cooperative, NAOWA multipurpose Cooperative Society
              supports over 1000 members in achieving their financial goals —
              helping them save consistently, access affordable loans, and grow
              with ease.
            </Text>
          </View>
        </View>

        <View style={styles.formCard}>
          {errorMessage ? (
            <Text
              style={{ color: "red", textAlign: "center", marginBottom: 10 }}
            >
              {errorMessage}
            </Text>
          ) : null}
          <View style={styles.headerRow}>
            <Text style={styles.welcomeText}>
              Welcome to <Text style={{ fontWeight: "bold" }}>NAOWA</Text>
            </Text>
            <TouchableOpacity onPress={handleSignup}>
              <Text style={styles.signupText}>
                No Account ? <Text style={{ color: "#982323" }}>Sign up</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.signInTitle}>Sign in</Text>

          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.googleBtn}>
              <Image
                source={require("../../assets/images/google.png")}
                style={styles.socialIcon}
              />
              <Text style={styles.googleText}>Sign in with Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Image
                source={require("../../assets/images/facebook.png")}
                style={styles.iconSmall}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Image
                source={require("../../assets/images/apple.png")}
                style={styles.iconSmall}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Enter your Username</Text>
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          />

          <Text style={styles.label}>Enter your Password</Text>
          <TextInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />
          <TouchableOpacity
            style={{ alignSelf: "flex-end", marginBottom: 20 }}
            onPress={handleForgotPassword}
          >
            <Text style={{ color: "#007BFF", fontSize: 12 }}>
              Forgot Password
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSignin} disabled={loading}>
            <LinearGradient
              colors={["#982323", "#982323"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.signInBtn}
            >
              <Text style={styles.signInText}>{loading ? "Signing in" : "Sign in"}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  greenCard: {
    backgroundColor: "#982323",
    flexDirection: "row",
    padding: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginTop: 100,
    margin: 15,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  greenTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
        fontFamily: 'Poppins_400Regular', 
  },
  greenSubtitle: {
    fontSize: 11,
    color: "#fff",
    lineHeight: 16,
        fontFamily: 'Poppins_400Regular', 
  },
  formCard: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: 30,
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  welcomeText: {
    fontSize: 14,
    color: "#333",
        fontFamily: 'Poppins_400Regular', 
  },
  signupText: {
    fontSize: 12,
    color: "#555",
        fontFamily: 'Poppins_400Regular', 
  },
  signInTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
        fontFamily: 'Poppins_400Regular', 
  },
  socialRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  googleBtn: {
    flexDirection: "row",
    backgroundColor: "#E9F1FF",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    flex: 1,
    alignItems: "center",
  },
  googleText: {
    fontSize: 12,
    marginLeft: 8,
    color: "#4285F4",
        fontFamily: 'Poppins_400Regular', 
  },
  socialIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  iconBtn: {
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    padding: 8,
    marginLeft: 8,
  },
  iconSmall: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  label: {
    fontSize: 12,
    color: "#555",
    marginBottom: 5,
    marginTop: 10,
        fontFamily: 'Poppins_400Regular', 
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    marginBottom: 10,
  },
  signInBtn: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  signInText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
        fontFamily: 'Poppins_400Regular', 
  },
});
