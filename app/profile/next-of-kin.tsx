import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import RNPickerSelect from "react-native-picker-select";
import api from "@/constants/api";
import { useAuthStore } from "@/hooks/useAuth";

const RELATIONSHIP_OPTIONS = [
  { label: "Spouse", value: "SPOUSE" },
  { label: "Partner", value: "PARTNER" },
  { label: "Father", value: "FATHER" },
  { label: "Mother", value: "MOTHER" },
  { label: "Son", value: "SON" },
  { label: "Daughter", value: "DAUGHTER" },
  { label: "Guardian", value: "GUARDIAN" },
  { label: "Sibling", value: "SIBLING" },
  { label: "Other", value: "OTHER" },
];

const GENDER_OPTIONS = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
];

export default function NextOfKin() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    relationship: "SPOUSE",
    gender: "MALE",
    phone: "",
    email: "",
    address: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const validateForm = () => {
    setErrorMessage("");

    if (!formData.first_name.trim()) {
      setErrorMessage("First name is required");
      return false;
    }

    if (!formData.last_name.trim()) {
      setErrorMessage("Last name is required");
      return false;
    }

    if (!formData.phone.trim()) {
      setErrorMessage("Phone number is required");
      return false;
    }

    if (!/^\d+$/.test(formData.phone.trim())) {
      setErrorMessage("Phone number should contain only digits");
      return false;
    }

    if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email.trim())) {
      setErrorMessage("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const updatePayload = {
        next_of_kin: {
          first_name: formData.first_name.trim(),
          last_name: formData.last_name.trim(),
          relationship: formData.relationship,
          gender: formData.gender,
          phone: formData.phone.trim(),
          email: formData.email.trim() || null,
          address: formData.address.trim() || null,
        },
      };

      const response = await api.put(`/api/member/${user?.id}`, updatePayload);

      if (response.data.success) {
        Alert.alert("Success", "Next of kin updated successfully", [
          {
            text: "OK",
            onPress: () => router.push("/(tabs)"),
          },
        ]);
      } else {
        setErrorMessage("Update failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Update error:", error);

      let errorMsg = "Failed to update next of kin. Please try again.";

      if (error.response) {
        if (error.response.status === 400) {
          errorMsg = error.response.data?.message || "Invalid data provided";
        } else if (error.response.status === 401) {
          errorMsg = "Session expired. Please login again.";
          router.push("/auth/login");
        } else if (error.response.status === 404) {
          errorMsg = "User not found";
        } else if (error.response.data?.error) {
          errorMsg = error.response.data.error;
        }
      } else if (error.request) {
        errorMsg = "Network error. Please check your connection.";
      }

      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >

        {errorMessage ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Personal Details</Text>

          <View style={styles.formRow}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>First Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.first_name}
                onChangeText={(text) => updateFormData("first_name", text)}
                placeholder="Enter first name"
                editable={!loading}
              />
            </View>

            <View style={[styles.formGroup, { flex: 1, marginLeft: 10 }]}>
              <Text style={styles.label}>Last Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.last_name}
                onChangeText={(text) => updateFormData("last_name", text)}
                placeholder="Enter last name"
                editable={!loading}
              />
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Relationship *</Text>
              <View style={styles.pickerContainer}>
                <RNPickerSelect
                  onValueChange={(value) =>
                    updateFormData("relationship", value)
                  }
                  items={RELATIONSHIP_OPTIONS}
                  value={formData.relationship}
                  style={pickerSelectStyles}
                  useNativeAndroidPickerStyle={false}
                  placeholder={{}}
                  disabled={loading}
                />
              </View>
            </View>

            <View style={[styles.formGroup, { flex: 1, marginLeft: 10 }]}>
              <Text style={styles.label}>Gender *</Text>
              <View style={styles.pickerContainer}>
                <RNPickerSelect
                  onValueChange={(value) => updateFormData("gender", value)}
                  items={GENDER_OPTIONS}
                  value={formData.gender}
                  style={pickerSelectStyles}
                  useNativeAndroidPickerStyle={false}
                  placeholder={{}}
                  disabled={loading}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Contact Information</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(text) => updateFormData("phone", text)}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              maxLength={15}
              editable={!loading}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => updateFormData("email", text)}
              placeholder="Enter email address"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.address}
              onChangeText={(text) => updateFormData("address", text)}
              placeholder="Enter full address"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              editable={!loading}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Update Next of Kin</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContainer: {
    padding: 10,
    paddingBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
    fontFamily: "Poppins_400Regular",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
    color: "#1a1a1a",
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
  },
  formSection: {
    marginBottom: 30,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    color: "#333",
    fontFamily: "Poppins_600SemiBold",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 10,
  },
  formRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: "#555",
    fontWeight: "500",
    fontFamily: "Poppins_500Medium",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#333",
    fontFamily: "Poppins_400Regular",
  },
  textArea: {
    minHeight: 80,
    paddingTop: 14,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  errorContainer: {
    backgroundColor: "#FFF5F5",
    borderWidth: 1,
    borderColor: "#FF3B30",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Poppins_400Regular",
  },
  button: {
    backgroundColor: "#982323",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  buttonDisabled: {
    backgroundColor: "#CC9999",
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Poppins_600SemiBold",
  },
  cancelButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5EA",
    backgroundColor: "transparent",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Poppins_500Medium",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: "#333",
    fontFamily: "Poppins_400Regular",
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: "#333",
    fontFamily: "Poppins_400Regular",
  },
  placeholder: {
    color: "#999",
  },
});
