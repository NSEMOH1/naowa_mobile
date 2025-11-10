import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";

const AccountStatement = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedType, setSelectedType] = useState("loans");
  const [showDropdown, setShowDropdown] = useState(false);

  const statementTypes = [
    { label: "Loans", value: "loans" },
    { label: "Savings", value: "savings" },
  ];

  const handleSubmit = () => {
    if (!fromDate || !toDate) {
      Alert.alert("Error", "Please select both from and to dates");
      return;
    }

    console.log("Account Statement Request:", {
      fromDate,
      toDate,
      selectedType,
    });
    Alert.alert(
      "Success",
      "Account statement will be generated and sent to your email"
    );
    // API call here
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Account Statement</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>From Date</Text>
        <TextInput
          style={styles.input}
          value={fromDate}
          onChangeText={setFromDate}
          placeholder="DD/MM/YYYY"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>To Date</Text>
        <TextInput
          style={styles.input}
          value={toDate}
          onChangeText={setToDate}
          placeholder="DD/MM/YYYY"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Statement Type</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowDropdown(true)}
        >
          <Text style={styles.dropdownText}>
            {statementTypes.find((type) => type.value === selectedType)?.label}
          </Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Generate Statement</Text>
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal
        visible={showDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDropdown(false)}
        >
          <View style={styles.dropdownModal}>
            {statementTypes.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedType(type.value);
                  setShowDropdown(false);
                }}
              >
                <Text style={styles.dropdownItemText}>{type.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default AccountStatement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    color: "#333",
    fontFamily: "Poppins_400Regular",
  },
  formGroup: {
    marginBottom: 15,
  },
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
    backgroundColor: "#fff",
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Poppins_400Regular",
  },
  dropdownArrow: {
    fontSize: 12,
    color: "#666",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownModal: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    minWidth: 200,
    maxWidth: 300,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Poppins_400Regular",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#982323",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Poppins_400Regular",
  },
});
