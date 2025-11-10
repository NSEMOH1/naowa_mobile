import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { TrendingUp } from "lucide-react-native";
import { router } from "expo-router";
import { useSavingsBalance } from "@/hooks/useSavings";
import api from "@/constants/api";
import { useAuthStore } from "@/hooks/useAuth";
import { useBalances } from "@/hooks/useBalances";

export default function Savings() {
  // const { balance: savingsBalance, refetch } = useSavingsBalance();
  // const balance = useBalances();
  const [newSavings, setNewSavings] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = useAuthStore();

  const handleDeposit = () => {
    router.push("/payments");
  };
  const handleWithdrawal = () => {
    router.push("/withdrawal");
  };
  const payload = {
    amount: newSavings,
  };

  const handleMonthlyDeduction = async () => {
    setLoading(true);
    try {
      // await api.put("/api/savings/deduction", payload);
      setSuccess(true);
      // await refetch()
      setNewSavings("");
    } catch (e: any) {
      setErrorMessage(e.message);
    } finally {
      setLoading(false);
    }
  };

  const financialRecords = [
    {
      id: 1,
      title: "Monthly Deduction",
      amount: `₦50000`,
      status: "active",
      color: "white",
      bgColor: "#ADB7F0",
    },
    // {
    //   id: 2,
    //   title: "Quick Savings",
    //   amount: "₦7,265",
    //   status: "Coming Soon",
    //   color: "white",
    //   bgColor: "#EBB9A1",
    // },
  ];

  if (success) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.successOverlay}>
          <View style={styles.successContainer}>
            <View style={styles.logo}>
              <Image
                source={require("../../assets/images/naowa.png")}
                style={{ width: 60, height: 80, resizeMode: "contain" }}
              />
            </View>
            <View style={styles.successCard}>
              <Text style={styles.successTitle}>
                Done!, Savings Adjusted Successfully
              </Text>

              <View style={styles.successIconContainer}>
                <View
                  style={[
                    styles.decorativeCircle,
                    {
                      backgroundColor: "#82B921",
                      width: 8,
                      height: 8,
                      top: 20,
                      left: 30,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.decorativeCircle,
                    {
                      backgroundColor: "#FF6B35",
                      width: 6,
                      height: 6,
                      top: 40,
                      right: 40,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.decorativeLine,
                    {
                      backgroundColor: "#FF6B35",
                      top: 60,
                      right: 20,
                      transform: [{ rotate: "45deg" }],
                    },
                  ]}
                />
                <View
                  style={[
                    styles.decorativeLine,
                    {
                      backgroundColor: "#FFD700",
                      bottom: 80,
                      left: 20,
                      transform: [{ rotate: "-30deg" }],
                    },
                  ]}
                />
                <View
                  style={[
                    styles.decorativeLine,
                    {
                      backgroundColor: "#6B73FF",
                      bottom: 40,
                      left: 40,
                      transform: [{ rotate: "60deg" }],
                    },
                  ]}
                />
                <View
                  style={[
                    styles.decorativeCircle,
                    {
                      backgroundColor: "#E6E6FA",
                      width: 12,
                      height: 12,
                      bottom: 60,
                      right: 30,
                      borderWidth: 1,
                      borderColor: "#DDD",
                    },
                  ]}
                />
                <View
                  style={[
                    styles.decorativeCircle,
                    {
                      backgroundColor: "#98FB98",
                      width: 6,
                      height: 6,
                      bottom: 20,
                      left: 60,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.decorativeCircle,
                    {
                      backgroundColor: "#FF1493",
                      width: 8,
                      height: 8,
                      bottom: 30,
                      right: 60,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.decorativeCircle,
                    {
                      backgroundColor: "transparent",
                      width: 16,
                      height: 16,
                      top: 80,
                      left: 60,
                      borderWidth: 2,
                      borderColor: "#DDD",
                    },
                  ]}
                />
                <View
                  style={[
                    styles.decorativeCircle,
                    {
                      backgroundColor: "transparent",
                      width: 20,
                      height: 20,
                      bottom: 100,
                      right: 50,
                      borderWidth: 2,
                      borderColor: "#E6E6FA",
                    },
                  ]}
                />
                <View style={styles.successIcon}>
                  <Text style={styles.checkmark}>✓</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => setSuccess(false)}
              >
                <Text style={styles.loginButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} horizontal={false}>
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
              <Text style={styles.avatarText}>JA</Text>
            </View>
            <Ionicons
              name="notifications"
              size={24}
              color="#333"
              style={{ marginLeft: 10 }}
            />
          </View>
        </View>

        <View style={styles.greeting}>
          <Text style={styles.greetingText}>
            Good afternoon{" "}
            <Text style={styles.nameText}>{user?.full_name}</Text> 👋
          </Text>
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Savings Balance</Text>
          <Text style={styles.balanceAmount}>₦500000</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.payButton} onPress={handleDeposit}>
              <Ionicons name="card" size={16} color="#fff" />
              <Text style={styles.payButtonText}>Deposit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.payOffButton}
              onPress={handleWithdrawal}
            >
              <Ionicons name="download" size={16} color="#fff" />
              <Text style={styles.payOffButtonText}>Withdrawal</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Savings Record</Text>
          <View style={styles.financialGrid}>
            {financialRecords.map((record, index) => (
              <TouchableOpacity
                key={record.id}
                style={[
                  styles.financialCard,
                  { backgroundColor: record.bgColor },
                  index === 0 ? styles.largeCard : styles.smallCard,
                ]}
              >
                <View style={styles.financialHeader}>
                  <Text
                    style={[styles.financialTitle, { color: record.color }]}
                  >
                    {record.title}
                  </Text>
                  <TouchableOpacity style={styles.trend}>
                    <TrendingUp size={16} color={record.color} />
                  </TouchableOpacity>
                </View>

                {record.amount ? (
                  <Text
                    style={[styles.financialAmount, { color: record.color }]}
                  >
                    {record.amount}
                  </Text>
                ) : (
                  <Text
                    style={[styles.financialStatus, { color: record.color }]}
                  >
                    {record.status}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.adjustcontainer}>
          <Text style={styles.title}>Savings Adjustment</Text>

          <Text style={styles.label}>Current Monthly Savings Deductions</Text>
          <TextInput
            style={styles.input}
            value={`₦50000`}
            keyboardType="numeric"
            editable={false}
            placeholder={"500000"}
          />

          <Text style={styles.label}>New Monthly Savings Deductions</Text>
          <TextInput
            style={styles.input}
            value={newSavings}
            onChangeText={setNewSavings}
            keyboardType="numeric"
          />

          <Text style={styles.error}>{errorMessage}</Text>

          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#982323" }]}
              onPress={handleMonthlyDeduction}
              disabled={loading}
            >
              <Text style={{ color: "#fff" }}>
                {loading ? "Submitting" : "Save"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* 
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment History</Text>
          </View>

          <View style={styles.emptyTransactions}>
            <Text style={styles.emptyText}>No recent transactions</Text>
          </View>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  adjustcontainer: {
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    flex: 1,
    borderRadius: 15,
    padding: 20,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
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
  error: {
    color: "red",
    fontWeight: "bold",
    fontFamily: "Poppins_400Regular",
  },
  greeting: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    fontFamily: "Poppins_400Regular",
  },
  trend: {
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 10,
    padding: 4,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 4,
  },
  logo: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 10,
  },
  greetingText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Poppins_400Regular",
  },
  nameText: {
    fontWeight: "bold",
    fontFamily: "Poppins_400Regular",
  },
  carouselContainer: {
    marginHorizontal: 10,
    marginBottom: 10,
  },
  savingsCard: {
    width: 300,
    marginRight: 10,
    padding: 25,
    borderRadius: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  savingsTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
    fontFamily: "Poppins_400Regular",
  },
  savingsAmount: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "Poppins_400Regular",
  },
  viewMoreButton: {
    alignSelf: "flex-end",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 10,
  },
  viewMoreText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
  },
  pageIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ddd",
  },
  activeDot: {
    backgroundColor: "#8BC34A",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    marginTop: 15,
    justifyContent: "center",
    fontFamily: "Poppins_400Regular",
    paddingHorizontal: 15,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  quickTransactions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    backgroundColor: "#fff",
  },
  transactionItem: {
    alignItems: "center",
    flex: 1,
    borderRadius: 15,
    padding: 20,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  transactionText: {
    fontSize: 12,
    textAlign: "center",
    color: "#666",
    lineHeight: 16,
    fontFamily: "Poppins_400Regular",
  },
  financialGrid: {
    flexDirection: "row",
    justifyContent: "center",
  },
  financialCard: {
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  largeCard: {
    width: "90%",
    height: 100,
  },
  smallCard: {
    width: "48%",
    height: 100,
  },
  financialHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  financialTitle: {
    fontSize: 12,
    fontWeight: "500",
    flex: 1,
    marginRight: 5,
    fontFamily: "Poppins_400Regular",
  },
  financialAmount: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Poppins_400Regular",
  },
  financialStatus: {
    fontSize: 12,
    fontWeight: "500",
    fontFamily: "Poppins_400Regular",
  },
  transactionFilters: {
    flexDirection: "row",
    gap: 10,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#fff",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  filterText: {
    fontSize: 12,
    color: "#666",
    fontFamily: "Poppins_400Regular",
  },
  emptyTransactions: {
    backgroundColor: "#fff",
    padding: 40,
    borderRadius: 12,
    alignItems: "center",
  },
  emptyText: {
    color: "#999",
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
  },
  balanceCard: {
    marginRight: 10,
    padding: 25,
    marginLeft: 10,
    borderRadius: 40,
    backgroundColor: "#982323",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 4,
    shadowRadius: 15,
    elevation: 8,
    borderWidth: 8,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  balanceLabel: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 8,
    fontFamily: "Poppins_400Regular",
  },
  balanceAmount: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "Poppins_400Regular",
  },
  buttonContainer: {
    justifyContent: "flex-end",
    flexDirection: "row",
    gap: 12,
  },
  payButton: {
    backgroundColor: "#F7B23B",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    gap: 6,
    fontFamily: "Poppins_400Regular",
  },
  payButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Poppins_400Regular",
  },
  payOffButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  payOffButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Poppins_400Regular",
  },
  card: {
    backgroundColor: "#4CAF50",
    padding: 20,
    borderRadius: 15,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginTop: 10,
    fontFamily: "Poppins_400Regular",
  },
  amount: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 10,
    fontFamily: "Poppins_400Regular",
  },
  adjustBtn: {
    backgroundColor: "#FF9800",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#982323",
    fontFamily: "Poppins_400Regular",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    marginVertical: 8,
    fontFamily: "Poppins_400Regular",
  },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
    fontFamily: "Poppins_400Regular",
  },
  loginButton: {
    backgroundColor: "#213400",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 10,
    fontFamily: "Poppins_400Regular",
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  successCard: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 12,
    padding: 40,
    alignItems: "center",
    width: "100%",
    maxWidth: 350,
    position: "relative",
  },
  successTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 40,
    lineHeight: 24,
    fontFamily: "Poppins_400Regular",
  },
  successIconContainer: {
    position: "relative",
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#82B921",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  checkmark: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Poppins_400Regular",
  },
  decorativeCircle: {
    position: "absolute",
    borderRadius: 50,
  },
  decorativeLine: {
    position: "absolute",
    width: 30,
    height: 3,
    borderRadius: 2,
  },
  successOverlay: {
    flex: 1,
    backgroundColor: "white",
  },
});
