import api from "@/constants/api";
import { useAuthStore } from "@/hooks/useAuth";
import { useMemberStore } from "@/store/user";
import { router } from "expo-router";
import React, { useState} from "react";
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

export default function EditProfile() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    bank_name: "",
    account_number: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();
  const { member } = useMemberStore()

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const validateForm = () => {
    if (!formData.full_name.trim()) {
      setErrorMessage("Full name is required");
      return false;
    }

    if (!formData.email.trim()) {
      setErrorMessage("Email is required");
      return false;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Please enter a valid email address");
      return false;
    }

    if (formData.phone.trim() && !/^\d+$/.test(formData.phone.trim())) {
      setErrorMessage("Phone number should contain only digits");
      return false;
    }

    if (
      formData.account_number.trim() &&
      !/^\d+$/.test(formData.account_number.trim())
    ) {
      setErrorMessage("Account number should contain only digits");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrorMessage("");

    try {
      const updatePayload: Record<string, string> = {
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
      };

      if (formData.phone.trim()) {
        updatePayload.phone = formData.phone.trim();
      }

      if (formData.address.trim()) {
        updatePayload.address = formData.address.trim();
      }
      if (formData.bank_name.trim() || formData.account_number.trim()) {
        console.log("Bank details to update:", {
          bank_name: formData.bank_name,
          account_number: formData.account_number,
        });
      }

      const response = await api.put(`/api/member/${user?.id}`, updatePayload);

      if (response.data.success) {
        Alert.alert("Success", "Profile updated successfully", [
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

      let errorMsg = "Update failed. Please try again.";

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
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.full_name}
              onChangeText={(text) => updateFormData("full_name", text)}
              placeholder={member?.full_name}
              editable={!loading}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email Address *</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => updateFormData("email", text)}
              placeholder={member?.email}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(text) => updateFormData("phone", text)}
              placeholder={member?.phone}
              keyboardType="phone-pad"
              maxLength={15}
              editable={!loading}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.address}
              onChangeText={(text) => updateFormData("address", text)}
              placeholder={member?.address}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              editable={!loading}
            />
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Bank Details (Optional)</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Bank Name</Text>
            <TextInput
              style={styles.input}
              value={formData.bank_name}
              onChangeText={(text) => updateFormData("bank_name", text)}
              placeholder={member?.bank[0]?.bank_name}
              editable={!loading}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Account Number</Text>
            <TextInput
              style={styles.input}
              value={formData.account_number}
              onChangeText={(text) => updateFormData("account_number", text)}
              placeholder={member?.bank[0]?.account_number}
              keyboardType="numeric"
              maxLength={20}
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
            <Text style={styles.buttonText}>Update Profile</Text>
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
