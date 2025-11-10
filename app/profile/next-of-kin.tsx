import { Smile } from "lucide-react-native";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Relationship } from "../auth/data";
import RNPickerSelect from "react-native-picker-select";
import { router } from "expo-router";
import api from "@/constants/api";
import { useAuthStore } from "@/hooks/useAuth";

export default function NextOfKin() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [relationship, setRelationship] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = useAuthStore();

  const payload = {
    kinFirstName: firstName,
    kinLastName: lastName,
    kinPhone: phone,
    relationship,
  };

  const handleSubmit = async () => {
    try {
      const res = await api.put(`/api/member/${user?.id}`, payload);
      router.push("/(tabs)");
    } catch (e) {
      console.error(e);
      setErrorMessage("Login failed. Please check your credentials.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Edit Next of Kin</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          editable={false}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          editable={false}
        />
      </View>

      <View style={styles.formGroup}>
        <Smile size={18} color="black" />
        <RNPickerSelect
          onValueChange={(value) => setRelationship(value)}
          placeholder={{ label: "Select relationship", value: "" }}
          items={Relationship}
          value={relationship}
          style={pickerSelectStyles}
          useNativeAndroidPickerStyle={false}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          editable={false}
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
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    fontFamily: "Poppins_400Regular",
  },
  formGroup: { marginBottom: 15 },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: "#333",
    fontFamily: "Poppins_400Regular",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f5f5f5",
    color: "#555",
    fontFamily: "Poppins_400Regular",
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
    fontFamily: "Poppins_400Regular",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    flex: 1,
    paddingVertical: 8,
    color: "#000",
  },
  inputAndroid: {
    flex: 1,
    paddingVertical: 8,
    color: "#000",
  },
});
