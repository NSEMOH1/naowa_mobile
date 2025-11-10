import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "@/constants/api";

interface Transaction {
  id: string;
  type: "credit" | "debit";
  title: string;
  category: string;
  amount: string;
  date: string;
  time: string;
  status: "completed" | "pending" | "failed";
}

const TransactionIcon = ({ type }: { type: "credit" | "debit" }) => {
  return (
    <View
      style={[
        styles.iconContainer,
        type === "credit" ? styles.creditIcon : styles.debitIcon,
      ]}
    >
      <Ionicons
        name={type === "credit" ? "arrow-down" : "arrow-up"}
        size={20}
        color={type === "credit" ? "#10B981" : "#EF4444"}
      />
    </View>
  );
};

const TransactionItem = ({ transaction }: { transaction: Transaction }) => (
  <TouchableOpacity style={styles.transactionItem}>
    <TransactionIcon type={transaction.type} />

    <View style={styles.transactionDetails}>
      <Text style={styles.transactionTitle}>{transaction.title}</Text>
      <Text style={styles.transactionCategory}>{transaction.category}</Text>
    </View>

    <View style={styles.transactionRight}>
      <Text
        style={[
          styles.transactionAmount,
          transaction.type === "credit"
            ? styles.creditAmount
            : styles.debitAmount,
        ]}
      >
        {transaction.type === "credit" ? "+" : "-"}
        {transaction.amount}
      </Text>
      <View style={styles.transactionMeta}>
        <Text style={styles.transactionDate}>{transaction.date}</Text>
        <Text style={styles.transactionTime}> • {transaction.time}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

export const TransactionsModule = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get("/api/transactions");
        const fetchedTransactions = response.data.data.map(
          (transaction: {
            id: any;
            type: any;
            description: any;
            reference: any;
            amount: { toString: () => any };
            createdAt: string | number | Date;
            status: any;
          }) => ({
            id: transaction.id,
            type: transaction.type,
            title: transaction.description,
            category: transaction.reference || "General",
            amount: transaction.amount.toString(),
            date: new Date(transaction.createdAt).toLocaleDateString(),
            time: new Date(transaction.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            status: transaction.status,
          })
        );
        setTransactions(fetchedTransactions);
      } catch (err: any) {
        setError("Failed to fetch transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All</Text>
          <Ionicons name="chevron-forward" size={16} color="#6366F1" />
        </TouchableOpacity>
      </View>

      {transactions.length === 0 ? (
        <View style={styles.emptyTransactions}>
          <Ionicons name="receipt-outline" size={48} color="#9CA3AF" />
          <Text style={styles.emptyText}>No recent transactions</Text>
          <Text style={styles.emptySubtext}>
            Your transaction history will appear here
          </Text>
        </View>
      ) : (
        <View style={styles.transactionsList}>
          {transactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6366F1",
  },
  transactionsList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  creditIcon: {
    backgroundColor: "#D1FAE5",
  },
  debitIcon: {
    backgroundColor: "#FEE2E2",
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 13,
    color: "#6B7280",
  },
  transactionRight: {
    alignItems: "flex-end",
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  creditAmount: {
    color: "#10B981",
  },
  debitAmount: {
    color: "#EF4444",
  },
  transactionMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  transactionDate: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  transactionTime: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  emptyTransactions: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    paddingHorizontal: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 8,
    textAlign: "center",
  },
});

export default TransactionsModule;
