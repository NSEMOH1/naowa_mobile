import React, { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  ImageBackground,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "@/constants/api";
import { useMemberStore } from "@/store/user";
import { useAuthStore } from "@/hooks/useAuth";
import { useBalances } from "@/hooks/useBalances";

const WithdrawalApplication = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [amount, setAmount] = useState("");
  const balance = useBalances()
  const [pin, setPin] = useState("");
  const [isLoading, setLoading] = useState(false);
  const { user } = useAuthStore();
  const { member, loading, fetchMember} = useMemberStore();
  useEffect(() => {
    if (user?.id) {
      fetchMember(user.id);
    }
  }, [user?.id, fetchMember]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const payload = {
    amount: amount,
    category_name: "QUICK",
    pin: pin,
  };

  const handleWithdrawal = async () => {
    setLoading(true);
    try {
      await api.post("/api/withdrawal", payload);
      Alert.alert("Success", "Withdrawal application submitted successfully", [
        {
          text: "OK",
          onPress: () => {
            router.push("/savings");
          },
        },
      ]);
    } catch (e) {
      console.error(e);
       Alert.alert("Failed", "Withdrawal application failed");
    } finally {
      setLoading(false);
    }
  };

  const handleProceed = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      Alert.alert("Success", "Withdrawal application submitted successfully", [
        {
          text: "OK",
          onPress: () => {
            router.push("/savings");
          },
        },
      ]);
    }
  };

  const renderStep1 = () => (
    <ScrollView style={styles.scrollView}>
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={member?.full_name}
            editable={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={member?.address}
            editable={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={member?.email}
            editable={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date of Birth</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            placeholder="10/02/1993"
            value={member?.date_of_birth}
            editable={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            keyboardType="phone-pad"
            editable={false}
            value={member?.phone}
          />
        </View>

        <TouchableOpacity style={styles.proceedButton} onPress={handleProceed}>
          <Text style={styles.proceedButtonText}>Proceed</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderStep2 = () => (
    <ScrollView style={styles.scrollView}>
      <View style={styles.formContainer}>
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>
            Verify your account details. If you notice an anomaly, contact Admin
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Total Savings</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={`₦${balance?.savings_balance || 0}`}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Salary Account Name</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={member?.bank[0].account_name}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Salary Account Number</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            keyboardType="numeric"
            value={member?.bank[0].account_number}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Bank Name</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={member?.bank[0].bank_name}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Reasons for Withdrawal</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            numberOfLines={3} 
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Pin</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={pin}
            onChangeText={setPin}
          />
        </View>
        <TouchableOpacity
          style={styles.proceedButton}
          onPress={handleWithdrawal}
          disabled={isLoading}
        >
          <Text style={styles.proceedButtonText}>
            {isLoading ? "Submitting" : "Submit Application"}
          </Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/naowa.png")}
        resizeMode="cover"
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <View style={styles.logoCircle}>
                <Image source={require("../../assets/images/naowa.png")} />
              </View>
            </View>
          </View>

          <View style={styles.contentContainer}>
            {currentStep === 1 ? (
              <>
                <Text style={styles.subtitle}>Time to Pull Out?</Text>
                {renderStep1()}
              </>
            ) : (
              renderStep2()
            )}
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default WithdrawalApplication;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  headerRight: {
    width: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  logo: {
    marginBottom: 10,
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoText: {
    fontSize: 24,
  },
  personnelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    letterSpacing: 2,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    marginHorizontal: 20,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    paddingBottom: 30,
  },
  warningContainer: {
    backgroundColor: "#FFF3CD",
    borderColor: "#FFEAA7",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  warningText: {
    fontSize: 14,
    color: "#856404",
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  disabledInput: {
    backgroundColor: "#f5f5f5",
    borderColor: "#e0e0e0",
    color: "#999",
  },
  disabledText: {
    color: "#999",
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
  placeholderText: {
    color: "#999",
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  dropdownModal: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 8,
    minWidth: 250,
    maxWidth: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  selectedDropdownItem: {
    backgroundColor: "#f8f9fa",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
  },
  selectedDropdownItemText: {
    color: "#2F4F2F",
    fontWeight: "600",
  },
  proceedButton: {
    backgroundColor: "#2F4F2F",
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%", // Made full width
    marginTop: 20,
  },
  proceedButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
});
