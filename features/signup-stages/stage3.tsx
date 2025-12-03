import React, {
  memo,
  useState,
  useMemo,
  useEffect,
  Component,
  ErrorInfo,
  useCallback,
} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from "react-native";
import {
  Building,
  CreditCard,
  Key,
  ChevronLeft,
  ChevronDown,
} from "lucide-react-native";
import  debounce  from "lodash.debounce";
import { config } from "@/constants/api";
import useBanks from "@/hooks/useBank";

interface Bank {
  id: string;
  name: string;
  code: string;
}

interface BankItemProps {
  item: Bank;
  onPress: () => void;
}

const BankItem = memo(({ item, onPress }: BankItemProps) => (
  <TouchableOpacity style={styles.bankItem} onPress={onPress}>
    <Text style={styles.bankName}>{item.name}</Text>
  </TouchableOpacity>
));
BankItem.displayName = "BankItem";

interface Stage3Props {
  bankName: string;
  setBankName: (value: string) => void;
  accountNumber: string;
  setAccountNumber: (value: string) => void;
  accountName: string;
  setAccountName: (value: string) => void;
  monthlyDeduction: string;
  setMonthlyDeduction: (value: string) => void;
  transactionPin: string;
  setTransactionPin: (value: string) => void;
  prevStep: () => void;
}

class BankErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("BankErrorBoundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Something went wrong. Please try again.
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const Stage3BankInfoSimple: React.FC<Stage3Props> = ({
  bankName,
  setBankName,
  accountNumber,
  setAccountNumber,
  accountName,
  setAccountName,
  monthlyDeduction,
  setMonthlyDeduction,
  transactionPin,
  setTransactionPin,
  prevStep,
}) => {
  const apiKey = config.paystackKey;
  const {
    banks,
    error: bankError,
    isLoading: banksLoading,
    hasMore,
  } = useBanks(apiKey);
  const [showBankModal, setShowBankModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (showBankModal && hasMore && !banksLoading) {
      console.log("Search modal opened, fetching all banks...");
    }
  }, [showBankModal, hasMore, banksLoading]);

  const handleSearch = useMemo(
    () =>
      debounce((text: string) => {
        setSearchQuery(text);
      }, 300),
    []
  );

  useEffect(() => {
    return () => {
      handleSearch.cancel();
    };
  }, [handleSearch]);

  const filteredBanks = useMemo(() => {
    if (!searchQuery) return banks;
    const query = searchQuery.toLowerCase().trim();
    const result = banks.filter((bank: Bank) => {
      const name = bank.name.toLowerCase();
      return query.split(" ").some((word) => name.includes(word));
    });
    console.log(
      `Filtered banks for "${searchQuery}": ${result.length}`,
      result.map((b) => b.name)
    );
    return result;
  }, [banks, searchQuery]);

  const selectBank = useCallback(
    (bank: Bank) => {
      setBankName(bank.name);
      setShowBankModal(false);
      setSearchQuery("");
    },
    [setBankName]
  );

  return (
    <BankErrorBoundary>
      <View>
        <View style={styles.headerWithBack}>
          <TouchableOpacity onPress={prevStep} style={styles.backButton}>
            <ChevronLeft size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Banking Information</Text>
        </View>
        <Text style={styles.subtitle}>Enter Your Bank Details</Text>

        {bankError && (
          <Text style={styles.errorText}>Bank error: {bankError}</Text>
        )}

        <Text style={styles.inputLabel}>Bank Name *</Text>
        <TouchableOpacity
          style={styles.inputIcon}
          onPress={() => setShowBankModal(true)}
        >
          <Building size={18} color="black" />
          <Text style={[styles.inputFlex, !bankName && styles.placeholderText]}>
            {bankName || "Select bank"}
          </Text>
          <ChevronDown size={18} color="#666" />
        </TouchableOpacity>

        <Text style={styles.inputLabel}>Account Number *</Text>
        <View style={styles.inputIcon}>
          <CreditCard size={18} color="black" />
          <TextInput
            value={accountNumber}
            onChangeText={setAccountNumber}
            placeholder="Enter account number"
            style={styles.inputFlex}
            keyboardType="numeric"
          />
        </View>

        <Text style={styles.inputLabel}>Account Name *</Text>
        <View style={styles.inputIcon}>
          <CreditCard size={18} color="black" />
          <TextInput
            value={accountName}
            onChangeText={setAccountName}
            placeholder="Enter account name"
            style={styles.inputFlex}
          />
        </View>

        <Text style={styles.inputLabel}>Monthly Deduction *</Text>
        <View style={styles.inputIcon}>
          <CreditCard size={18} color="black" />
          <TextInput
            value={monthlyDeduction}
            onChangeText={setMonthlyDeduction}
            placeholder="Monthly Deduction"
            style={styles.inputFlex}
            keyboardType="numeric"
          />
        </View>

        <Text style={styles.inputLabel}>Transaction Pin *</Text>
        <View style={styles.inputIcon}>
          <Key size={18} color="black" />
          <TextInput
            value={transactionPin}
            placeholder="Transaction Pin"
            secureTextEntry={true}
            style={styles.inputFlex}
            keyboardType="numeric"
            maxLength={4}
            onChangeText={setTransactionPin}
          />
        </View>

        <Modal visible={showBankModal} animationType="none" transparent={false}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Bank</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowBankModal(false);
                  setSearchQuery("");
                }}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Search banks..."
              value={searchQuery}
              onChangeText={handleSearch}
            />

            {banksLoading && banks.length === 0 ? (
              <View style={styles.loadingContainer}>
                <Text>Loading banks...</Text>
              </View>
            ) : (
              <FlatList
                data={filteredBanks}
                keyExtractor={(item: Bank) => item.id}
                renderItem={({ item }: { item: Bank }) => (
                  <BankItem item={item} onPress={() => selectBank(item)} />
                )}
                initialNumToRender={10}
                maxToRenderPerBatch={5}
                windowSize={3}
                showsVerticalScrollIndicator={true}
                ListEmptyComponent={
                  <View style={styles.loadingContainer}>
                    <Text>No banks found</Text>
                  </View>
                }
              />
            )}
          </View>
        </Modal>
      </View>
    </BankErrorBoundary>
  );
};

const styles = StyleSheet.create({
  headerWithBack: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 0,
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#982323",
    fontFamily: "Poppins_400Regular",
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
    fontFamily: "Poppins_400Regular",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "Poppins_400Regular",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  inputLabel: {
    fontSize: 12,
    color: "#333",
    marginBottom: 5,
    fontWeight: "500",
    fontFamily: "Poppins_400Regular",
  },
  inputIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#000",
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 12,
    minHeight: 40,
  },
  inputFlex: {
    flex: 1,
    padding: 8,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    justifyContent: "center",
  },
  placeholderText: {
    color: "#999",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    color: "#982323",
    fontSize: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  bankItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  bankName: {
    fontSize: 16,
  },
});

export default Stage3BankInfoSimple;
