import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import {
  Phone,
  Mail,
  Briefcase,
  Building,
  MapPinHouse,
  Heart,
  User,
  ChevronLeft,
} from "lucide-react-native";
import { MaritalStatus } from "@/app/auth/data";
import { states } from "../../constants/data";

interface Stage2Props {
  phone: string;
  setPhone: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  occupation: string;
  setOccupation: (value: string) => void;
  placeOfWork: string;
  setPlaceOfWork: (value: string) => void;
  stateOrigin: string;
  setStateOrigin: (value: string) => void;
  maritalStatus: string;
  setMaritalStatus: (value: string) => void;
  spouseName: string;
  setSpouseName: (value: string) => void;
  prevStep: () => void;
}

const Stage2MoreDetails: React.FC<Stage2Props> = ({
  phone,
  setPhone,
  email,
  setEmail,
  occupation,
  setOccupation,
  placeOfWork,
  setPlaceOfWork,
  stateOrigin,
  setStateOrigin,
  maritalStatus,
  setMaritalStatus,
  spouseName,
  setSpouseName,
  prevStep,
}) => {
  return (
    <View>
      <View style={styles.headerWithBack}>
        <TouchableOpacity onPress={prevStep} style={styles.backButton}>
          <ChevronLeft size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>More Details</Text>
      </View>
      <Text style={styles.subtitle}>Additional Personal Information</Text>

      <Text style={styles.inputLabel}>Phone Number *</Text>
      <View style={styles.inputIcon}>
        <Phone size={18} color="black" />
        <TextInput
          value={phone}
          placeholder="Enter phone number"
          style={styles.inputFlex}
          keyboardType="phone-pad"
          onChangeText={setPhone}
        />
      </View>

      <Text style={styles.inputLabel}>Email Address *</Text>
      <View style={styles.inputIcon}>
        <Mail size={18} color="black" />
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter email address"
          style={styles.inputFlex}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <Text style={styles.inputLabel}>Occupation *</Text>
      <View style={styles.inputIcon}>
        <Briefcase size={18} color="black" />
        <TextInput
          value={occupation}
          onChangeText={setOccupation}
          placeholder="Enter your occupation"
          style={styles.inputFlex}
        />
      </View>

      <Text style={styles.inputLabel}>Place of Work *</Text>
      <View style={styles.inputIcon}>
        <Building size={18} color="black" />
        <TextInput
          value={placeOfWork}
          onChangeText={setPlaceOfWork}
          placeholder="Enter your place of work"
          style={styles.inputFlex}
        />
      </View>

      <Text style={styles.inputLabel}>State of Origin *</Text>
      <View style={styles.inputIcon}>
        <MapPinHouse size={18} color="black" />
        <RNPickerSelect
          onValueChange={setStateOrigin}
          placeholder={{ label: "Select state of origin", value: "" }}
          items={Object.keys(states).map((state) => ({
            label: state,
            value: state,
          }))}
          value={stateOrigin}
          style={pickerSelectStyles}
          useNativeAndroidPickerStyle={false}
        />
      </View>

      <Text style={styles.inputLabel}>Marital Status *</Text>
      <View style={styles.inputIcon}>
        <Heart size={18} color="black" />
        <RNPickerSelect
          onValueChange={setMaritalStatus}
          placeholder={{ label: "Select marital status", value: "" }}
          items={MaritalStatus}
          value={maritalStatus}
          style={pickerSelectStyles}
          useNativeAndroidPickerStyle={false}
        />
      </View>

      {maritalStatus === "Married" && (
        <>
          <Text style={styles.inputLabel}>Name of Spouse *</Text>
          <View style={styles.inputIcon}>
            <User size={18} color="black" />
            <TextInput
              value={spouseName}
              onChangeText={setSpouseName}
              placeholder="Enter spouse's name"
              style={styles.inputFlex}
            />
          </View>
        </>
      )}
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

export default Stage2MoreDetails;
