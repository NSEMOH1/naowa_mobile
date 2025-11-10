import api from "@/constants/api";
import { useAuthStore } from "@/hooks/useAuth";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditProfile() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = useAuthStore();

  const payload = {
    full_name: fullName,
    phone,
    email,
  };

  const handleSubmit = async () => {
    try {
      const res = await api.put(`/api/member/${user?.id}`, payload);
      router.push("/(tabs)");
    } catch (e) {
      console.error(e);
      setErrorMessage("Update failed. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <View style={styles.formGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          editable={true}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          editable={true}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          onChangeText={setPhone}
          style={styles.input}
          value={phone}
          editable={true}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 20, fontFamily: 'Poppins_400Regular' },
  error: { color: "red", marginBottom: 10 },
  formGroup: { marginBottom: 15 },
  label: { fontSize: 14, marginBottom: 5, color: "#333", fontFamily: 'Poppins_400Regular', },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f5f5f5",
    color: "#555",
  },
  button: {
    backgroundColor: "#982323",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontFamily: 'Poppins_400Regular',
  },
});
