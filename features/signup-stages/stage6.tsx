import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { IdCard, ChevronLeft } from "lucide-react-native";
import { securityQuestions } from "@/app/auth/data";

interface Stage6Props {
  securityQuestion: string;
  setSecurityQuestion: (value: string) => void;
  securityAnswer: string;
  setSecurityAnswer: (value: string) => void;
  prevStep: () => void;
}

const Stage6Security: React.FC<Stage6Props> = ({
  securityQuestion,
  setSecurityQuestion,
  securityAnswer,
  setSecurityAnswer,
  prevStep,
}) => {
  return (
    <View>
      <View style={styles.headerWithBack}>
        <TouchableOpacity onPress={prevStep} style={styles.backButton}>
          <ChevronLeft size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Security Question</Text>
      </View>
      <Text style={styles.subtitle}>
        Setup your security question for account recovery
      </Text>

      <Text style={styles.inputLabel}>Security Question *</Text>
      <View style={styles.inputIcon}>
        <IdCard size={18} color="black" />
        <RNPickerSelect
          onValueChange={setSecurityQuestion}
          placeholder={{
            label: "Select Security Question",
            value: "",
          }}
          items={securityQuestions}
          value={securityQuestion}
          style={pickerSelectStyles}
          useNativeAndroidPickerStyle={false}
        />
      </View>

      <Text style={styles.inputLabel}>Security Answer *</Text>
      <View style={styles.inputIcon}>
        <IdCard size={18} color="black" />
        <TextInput
          value={securityAnswer}
          onChangeText={setSecurityAnswer}
          placeholder="Enter security answer"
          style={styles.inputFlex}
        />
      </View>
    </View>
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

export default Stage6Security;
