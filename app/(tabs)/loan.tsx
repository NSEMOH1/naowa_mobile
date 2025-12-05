import React, { JSX, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import LoanEnrollmentFlow from "@/features/loan-enrollment";
import { PieChart } from "react-native-gifted-charts";
import { CircularProgressProps, LoanRecord } from "@/types";
import { useAuthStore } from "@/hooks/useAuth";
import { router } from "expo-router";
import { useBalances } from "@/hooks/useBalances";
import { getInitials } from "@/constants/data";
import { useSavingsBalance } from "@/hooks/useSavings";

interface LoanCategory {
  title: string;
  amount: string;
  status: string;
  statusColor: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  iconColor: string;
  backgroundColor: string;
  isClickable: boolean;
}

export default function Loan() {
  const [showLoanModal, setShowLoanModal] = useState(false);
  const balance = useBalances();
  const { balance: savingsBalance} = useSavingsBalance();
  const { user } = useAuthStore();
  const handlePayment = () => {
    router.push("/payments");
  };
  const loanRecords: LoanRecord[] = [
    {
      type: "Regular Loan",
      amount: `₦500000`,
      percentage: 75,
      current: "3,000,525.00",
      total: "100%",
    },
    {
      type: "Emergency Loan",
      amount: "Coming Soon",
      percentage: 0,
      current: "0",
      total: "100%",
    },
    {
      type: "Commodity Loan",
      amount: "Coming Soon",
      percentage: 0,
      current: "0",
      total: "100%",
    },
    {
      type: "Emergency Loan",
      amount: "Coming Soon",
      percentage: 0,
      current: "0",
      total: "100%",
    },
  ];

  const loanCategories: LoanCategory[] = [
    {
      title: "Regular Loan",
      amount: "200k",
      status: "57% utilized",
      statusColor: "#4CAF50",
      icon: "account-balance-wallet",
      iconColor: "#4CAF50",
      backgroundColor: "#E8F5E8",
      isClickable: true,
    },
    {
      title: "Home Appliance Loan",
      amount: "200k",
      status: "Coming soon",
      statusColor: "#9E9E9E",
      icon: "home",
      iconColor: "#9E9E9E",
      backgroundColor: "#F5F5F5",
      isClickable: false,
    },
    {
      title: "Commodity Loan",
      amount: "200k",
      status: "Coming soon",
      statusColor: "#9E9E9E",
      icon: "shopping-cart",
      iconColor: "#FF9800",
      backgroundColor: "#FFF8E1",
      isClickable: false,
    },
    {
      title: "Housing Loan",
      amount: "200k",
      status: "Coming soon",
      statusColor: "#4CAF50",
      icon: "home",
      iconColor: "#4CAF50",
      backgroundColor: "#E8F5E8",
      isClickable: false,
    },
  ];

  const renderLoanRecord = (loan: LoanRecord, index: number): JSX.Element => {
    const pieData = [
      {
        value: loan.percentage,
        color: "#982323",
      },
      {
        value: 100 - loan.percentage,
        color: "#E0E0E0",
      },
    ];

    return (
      <View key={index} style={styles.loanRecordCard}>
        <View style={styles.loanRecordHeader}>
          <Text style={styles.loanRecordType}>{loan.type}</Text>
          <Text style={styles.loanRecordAmount}>{loan.amount}</Text>
        </View>
        <View style={styles.progressInfoContainer}>
          <PieChart
            data={pieData}
            donut
            radius={40}
            innerRadius={30}
            innerCircleColor={"#FFFFFF"}
            centerLabelComponent={() => <Text>{loan.percentage}%</Text>}
          />
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>{loan.percentage}%</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderLoanCategory = (
    category: LoanCategory,
    index: number
  ): JSX.Element => (
    <TouchableOpacity
      key={index}
      style={styles.categoryCard}
      onPress={() =>
        category.isClickable === true ? setShowLoanModal(true) : null
      }
    >
      <Text style={styles.categoryTitle}>{category.title}</Text>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: category.backgroundColor },
        ]}
      >
        <MaterialIcons
          name={category.icon}
          size={24}
          color={category.iconColor}
        />
      </View>
      <Text style={styles.categoryAmount}>{category.amount}</Text>
      <Text style={[styles.categoryStatus, { color: category.statusColor }]}>
        {category.status}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />

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

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>
            Good afternoon <Text style={styles.name}>{user?.full_name}</Text> 👋
          </Text>
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Loan Balance</Text>
          <Text style={styles.balanceAmount}>₦{balance?.loan_balance || 0}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
              <Ionicons name="card" size={16} color="#fff" />
              <Text style={styles.payButtonText}>Pay Now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.payOffButton}
              onPress={handlePayment}
            >
              <Ionicons name="download" size={16} color="#fff" />
              <Text style={styles.payOffButtonText}>Pay Off</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.twobalanceCard}>
          <Text style={styles.balanceLabel}>MONTHLY DEDUCTION</Text>
          <Text style={styles.balanceAmount}>₦{savingsBalance?.monthlyDeduction}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Loan Records</Text>
          <View style={styles.loanRecordsGrid}>
            {loanRecords.map((loan, index) => renderLoanRecord(loan, index))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Loan Category</Text>
          <View style={styles.categoriesGrid}>
            {loanCategories.map((category, index) =>
              renderLoanCategory(category, index)
            )}
          </View>
        </View>
      </ScrollView>
      <LoanEnrollmentFlow
        visible={showLoanModal}
        onClose={() => setShowLoanModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  scrollView: {
    flex: 1,
  },
  greetingContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 20,
  },
  greeting: {
    fontSize: 18,
    color: "#333",
    fontFamily: "Poppins_400Regular",
  },
  name: {
    fontWeight: "bold",
    fontFamily: "Poppins_400Regular",
  },
  balanceCard: {
    marginRight: 10,
    padding: 25,
    marginLeft: 10,
    borderRadius: 40,
    backgroundColor: "black",
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
  twobalanceCard: {
    marginRight: 10,
    padding: 25,
    marginLeft: 10,
    borderRadius: 40,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "purple",
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
    backgroundColor: "#982323",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
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
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    fontFamily: "Poppins_400Regular",
  },
  loanRecordsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  loanRecordCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    width: "48%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loanRecordHeader: {
    marginBottom: 16,
    fontFamily: "Poppins_400Regular",
  },
  loanRecordType: {
    fontSize: 17,
    color: "#333",
    marginBottom: 4,
    fontWeight: "bold",
  },
  loanRecordAmount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "Poppins_400Regular",
  },
  progressInfoContainer: {
    alignItems: "center",
  },
  progressContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  progressBackground: {
    borderColor: "#E0E0E0",
    position: "absolute",
  },
  progressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: "absolute",
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  progressInfo: {
    alignItems: "center",
    marginTop: 8,
  },
  progressText: {
    fontSize: 12,
    color: "#666",
    fontFamily: "Poppins_400Regular",
  },
  progressSubtext: {
    fontSize: 10,
    color: "#999",
    fontFamily: "Poppins_400Regular",
  },
  progressTotal: {
    fontSize: 10,
    color: "#999",
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  categoryCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    width: "48%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
    fontFamily: "Poppins_400Regular",
  },
  categoryAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
    fontFamily: "Poppins_400Regular",
  },
  categoryStatus: {
    fontSize: 12,
    textAlign: "center",
    fontFamily: "Poppins_400Regular",
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  navText: {
    fontSize: 12,
    color: "#999",
    fontFamily: "Poppins_400Regular",
  },
});
