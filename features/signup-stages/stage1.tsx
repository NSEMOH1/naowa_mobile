import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import RNPickerSelect from "react-native-picker-select";
import { User, Home, Calendar, VenusAndMars, Key } from "lucide-react-native";
import { Gender } from "@/app/auth/data";

interface Stage1Props {
  username: string;
  setUsername: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  fullName: string;
  setFullName: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
  dob: string;
  setDob: (value: string) => void;
  gender: string;
  setGender: (value: string) => void;
  isDatePickerVisible: boolean;
  setDatePickerVisible: (visible: boolean) => void;
  showDatePicker: () => void;
  hideDatePicker: () => void;
  handleConfirm: (date: Date) => void;
}

const Stage1PersonalInfo: React.FC<Stage1Props> = ({
  username,
  setUsername,
  password,
  setPassword,
  fullName,
  setFullName,
  address,
  setAddress,
  dob,
  setDob,
  gender,
  setGender,
  isDatePickerVisible,
  setDatePickerVisible,
  showDatePicker,
  hideDatePicker,
  handleConfirm,
}) => {
  return (
    <View>
      <Text style={styles.title}>Personal Information</Text>
      <Text style={styles.subtitle}>Enter Your Basic Details</Text>

      <Text style={styles.inputLabel}>Username *</Text>
      <View style={styles.inputIcon}>
        <User size={18} color="black" />
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your username"
          style={styles.inputFlex}
        />
      </View>

      <Text style={styles.inputLabel}>Password *</Text>
      <View style={styles.inputIcon}>
        <Key size={18} color="black" />
        <TextInput
          value={password}
          secureTextEntry={true}
          onChangeText={setPassword}
          placeholder="Enter your password"
          style={styles.inputFlex}
        />
      </View>

      <Text style={styles.inputLabel}>Full Name *</Text>
      <View style={styles.inputIcon}>
        <User size={18} color="black" />
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter your full name"
          style={styles.inputFlex}
        />
      </View>

      <Text style={styles.inputLabel}>Address *</Text>
      <View style={styles.inputIcon}>
        <Home size={18} color="black" />
        <TextInput
          value={address}
          onChangeText={setAddress}
          placeholder="Enter your address"
          style={styles.inputFlex}
          multiline={true}
          numberOfLines={2}
        />
      </View>

      <Text style={styles.inputLabel}>Date of Birth *</Text>
      <TouchableOpacity style={styles.inputIcon} onPress={showDatePicker}>
        <Calendar size={18} color="black" />
        <Text style={[styles.inputFlex, styles.dobText]}>
          {dob || "Select date of birth"}
        </Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        maximumDate={new Date()}
      />

      <Text style={styles.inputLabel}>Gender *</Text>
      <View style={styles.inputIcon}>
        <VenusAndMars size={18} color="black" />
        <RNPickerSelect
          onValueChange={setGender}
          placeholder={{ label: "Select gender", value: "" }}
          items={Gender}
          value={gender}
          style={pickerSelectStyles}
          useNativeAndroidPickerStyle={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  dobText: {
    paddingVertical: 10,
    color: "#999",
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

export default Stage1PersonalInfo;
