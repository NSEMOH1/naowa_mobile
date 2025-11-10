import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { usePaystack } from "react-native-paystack-webview";
import { useAuthStore } from "@/hooks/useAuth";
import api from "@/constants/api";

const PaymentFlow = () => {
  const [selectedType, setSelectedType] = useState<string>("Loan Payment");
  const [amount, setAmount] = useState<string>("");
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useAuthStore();

  const quickAmounts = [5000, 10000, 15000, 20000, 30000];
  const paymentTypes = ["Loan Payment", "Savings Deposit"];

  const { popup } = usePaystack();

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString());
  };

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setShowDropdown(false);
  };

  const handleAmountChange = (value: string) => {
    if (/^\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const payload = {
    category_name: "QUICK",
    amount: amount,
  };

  const handleDeposit = async () => {
    try {
      await api.post("/api/savings/deposit", payload);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePayNow = () => {
    if (!amount || parseInt(amount) < 5000) {
      Alert.alert("Error", "Please enter a valid amount (minimum ₦5,000)");
      return;
    }
    setIsLoading(true);
    console.log("email", user?.email)

    popup.newTransaction({
      email: user?.email || "mail@naowa.com",
      amount: parseInt(amount),
      reference: generateTransactionReference(),
      onSuccess: async (res: any) => {
        try {
          // await handleDeposit();
          setShowSuccessModal(true);
          Alert.alert(
            "Payment Successful! 🎉",
            `Reference: ${res.data.reference}\nAmount: ₦${formatAmount(
              amount
            )}\nStatus: ${res.data.status}`,
            [{ text: "OK", onPress: () => console.log("Payment completed") }]
          );
        } catch (error) {
          console.error("Deposit Error:", error);
          Alert.alert(
            "Deposit Error",
            "There was an error updating your balance."
          );
        } finally {
          setIsLoading(false);
        }
      },
      onCancel: async () => {
        console.log("Payment Cancelled");
        setIsLoading(false);
        Alert.alert("Payment Cancelled", "Your payment was cancelled.");
      },
      onError: (err: any) => {
        console.log("Payment Error:", err);
        setIsLoading(false);
        Alert.alert(
          "Payment Error",
          err.message || "An error occurred during payment. Please try again."
        );
      },
      onLoad: () => {
        console.log("Paystack WebView Loaded");
      },
    });
  };

  const handleSuccessOk = () => {
    setShowSuccessModal(false);
    router.back();
  };

  const formatAmount = (value: string): string => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const generateTransactionReference = (): string => {
    return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const renderDropdownModal = () => (
    <Modal
      visible={showDropdown}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowDropdown(false)}
    >
      <TouchableOpacity
        style={styles.dropdownOverlay}
        activeOpacity={1}
        onPress={() => setShowDropdown(false)}
      >
        <View style={styles.dropdownModal}>
          {paymentTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.dropdownItem,
                selectedType === type && styles.selectedDropdownItem,
              ]}
              onPress={() => handleTypeSelect(type)}
            >
              <Text
                style={[
                  styles.dropdownItemText,
                  selectedType === type && styles.selectedDropdownItemText,
                ]}
              >
                {type}
              </Text>
              {selectedType === type && (
                <Ionicons name="checkmark" size={20} color="#2F4F2F" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderPaymentForm = () => (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.testBanner}>
          <Ionicons name="flask" size={20} color="#FF9800" />
          <Text style={styles.testBannerText}>TEST MODE - Use test cards</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Type</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowDropdown(true)}
          >
            <Text style={styles.dropdownText}>{selectedType}</Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Amount (₦)</Text>
          <TextInput
            style={styles.input}
            placeholder="Min. 5,000"
            value={amount}
            onChangeText={handleAmountChange}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.quickAmountContainer}>
          <Text style={styles.quickAmountLabel}>Quick amounts:</Text>
          <View style={styles.quickAmountButtons}>
            {quickAmounts.map((quickAmount) => (
              <TouchableOpacity
                key={quickAmount}
                style={styles.quickAmountButton}
                onPress={() => handleQuickAmount(quickAmount)}
              >
                <Text style={styles.quickAmountText}>
                  ₦{formatAmount(quickAmount.toString())}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.payButton} onPress={handlePayNow}>
          <Ionicons
            name="card"
            size={20}
            color="white"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.payButtonText}>Pay</Text>
        </TouchableOpacity>

        {/* <View style={styles.testCardInfo}>
          <Text style={styles.testCardTitle}>Test Card Details</Text>
          <View style={styles.testCardItem}>
            <Text style={styles.testCardLabel}>Successful Payment:</Text>
            <Text style={styles.testCardValue}>4084084084084081</Text>
          </View>
          <View style={styles.testCardItem}>
            <Text style={styles.testCardLabel}>Failed Payment:</Text>
            <Text style={styles.testCardValue}>4084084084084083</Text>
          </View>
          <View style={styles.testCardItem}>
            <Text style={styles.testCardLabel}>CVV:</Text>
            <Text style={styles.testCardValue}>Any 3 digits</Text>
          </View>
          <View style={styles.testCardItem}>
            <Text style={styles.testCardLabel}>Expiry:</Text>
            <Text style={styles.testCardValue}>Any future date</Text>
          </View>
        </View> */}

        <View style={styles.paymentInfoCard}>
          <View style={styles.securePaymentHeader}>
            <Ionicons name="shield-checkmark" size={24} color="#4CAF50" />
            <Text style={styles.securePaymentText}>
              Secure Payment by Paystack
            </Text>
          </View>
          <Text style={styles.paymentDescription}>
            Your payment is secured by Paystack. Accepted payment methods
            include:
          </Text>
          <View style={styles.paymentMethods}>
            <Text style={styles.paymentMethodsList}>
              • Visa, Mastercard, Verve cards{"\n"}• Bank transfers{"\n"}• USSD
              codes{"\n"}• Mobile money
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderSuccessModal = () => (
    <Modal visible={showSuccessModal} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark" size={40} color="white" />
          </View>
          <Text style={styles.successTitle}>PAYMENT SUCCESSFUL!</Text>
          <Text style={styles.successMessage}>
            Your {selectedType.toLowerCase()} of ₦{formatAmount(amount)} has
            been processed successfully.
          </Text>
          <Text style={styles.testNote}>
            This was a test transaction. No real money was charged.
          </Text>
          <TouchableOpacity style={styles.okButton} onPress={handleSuccessOk}>
            <Text style={styles.okButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderPaymentForm()}
      {renderSuccessModal()}
      {renderDropdownModal()}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#2F4F2F" />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  testBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#FF9800",
  },
  testBannerText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#E65100",
    fontWeight: "600",
    fontFamily: "Poppins_400Regular",
  },
  inputGroup: {
    marginBottom: 20,
    fontFamily: "Poppins_400Regular",
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    fontWeight: "500",
    fontFamily: "Poppins_400Regular",
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: "Poppins_400Regular",
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    fontFamily: "Poppins_400Regular",
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
    fontFamily: "Poppins_400Regular",
  },
  selectedDropdownItem: {
    backgroundColor: "#f8f9fa",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    fontFamily: "Poppins_400Regular",
  },
  selectedDropdownItemText: {
    color: "#2F4F2F",
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
    fontFamily: "Poppins_400Regular",
  },
  quickAmountContainer: {
    marginBottom: 30,
  },
  quickAmountLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    fontWeight: "500",
    fontFamily: "Poppins_400Regular",
  },
  quickAmountButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickAmountButton: {
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  quickAmountText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
    fontFamily: "Poppins_400Regular",
  },
  payButton: {
    backgroundColor: "#982323",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "center",
    fontFamily: "Poppins_400Regular",
  },
  payButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Poppins_400Regular",
  },
  testCardInfo: {
    backgroundColor: "#E3F2FD",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#2196F3",
    fontFamily: "Poppins_400Regular",
  },
  testCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1565C0",
    marginBottom: 12,
    fontFamily: "Poppins_400Regular",
  },
  testCardItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  testCardLabel: {
    fontSize: 14,
    color: "#1976D2",
    fontWeight: "500",
  },
  testCardValue: {
    fontSize: 14,
    color: "#0D47A1",
    fontWeight: "600",
    fontFamily: "Poppins_400Regular",
  },
  paymentInfoCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  securePaymentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  securePaymentText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
    fontFamily: "Poppins_400Regular",
  },
  paymentDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 16,
    fontFamily: "Poppins_400Regular",
  },
  paymentMethods: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 16,
  },
  paymentMethodsList: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
    fontFamily: "Poppins_400Regular",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 30,
    alignItems: "center",
    minWidth: 280,
    maxWidth: 340,
  },
  successIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    fontFamily: "Poppins_400Regular",
  },
  successMessage: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
    textAlign: "center",
    fontFamily: "Poppins_400Regular",
  },
  testNote: {
    fontSize: 12,
    color: "#FF9800",
    marginBottom: 24,
    textAlign: "center",
    fontStyle: "italic",
    fontFamily: "Poppins_400Regular",
  },
  okButton: {
    backgroundColor: "#2F4F2F",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 40,
    fontFamily: "Poppins_400Regular",
  },
  okButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Poppins_400Regular",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PaymentFlow;
