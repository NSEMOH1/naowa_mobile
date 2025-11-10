import api from "@/constants/api";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Refund() {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  const payload = {
    amount,
    reason,
  };

  const handleSubmit = async () => {
    try {
      await api.post("/api/requests", payload);
      Alert.alert("Success", "Your request has been submitted");
      router.push("/(tabs)/profile");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Your request failed, please try again later");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Request Refund</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="Enter amount"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Reason</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          value={reason}
          onChangeText={setReason}
          placeholder="Enter reason"
          multiline
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Request</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 20, fontFamily: 'Poppins_400Regular', },
  formGroup: { marginBottom: 15 },
  label: { fontSize: 14, marginBottom: 5, color: "#333", fontFamily: 'Poppins_400Regular', },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#982323",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600", fontFamily: 'Poppins_400Regular', },
});
