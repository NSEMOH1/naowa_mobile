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
  User,
  VenusAndMars,
  Heart,
  Phone,
  Mail,
  Home,
  ChevronLeft,
} from "lucide-react-native";
import { Gender, Relationship } from "@/app/auth/data";

interface Stage4Props {
  kinFirstName: string;
  setKinFirstName: (value: string) => void;
  kinLastName: string;
  setKinLastName: (value: string) => void;
  kinGender: string;
  setKinGender: (value: string) => void;
  relationship: string;
  setRelationship: (value: string) => void;
  kinPhone: string;
  setKinPhone: (value: string) => void;
  kinEmail: string;
  setKinEmail: (value: string) => void;
  kinAddress: string;
  setKinAddress: (value: string) => void;
  prevStep: () => void;
}

const Stage4NextOfKin: React.FC<Stage4Props> = ({
  kinFirstName,
  setKinFirstName,
  kinLastName,
  setKinLastName,
  kinGender,
  setKinGender,
  relationship,
  setRelationship,
  kinPhone,
  setKinPhone,
  kinEmail,
  setKinEmail,
  kinAddress,
  setKinAddress,
  prevStep,
}) => {
  return (
    <View>
      <View style={styles.headerWithBack}>
        <TouchableOpacity onPress={prevStep} style={styles.backButton}>
          <ChevronLeft size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Next Of Kin</Text>
      </View>
      <Text style={styles.subtitle}>Enter Next of Kin Information</Text>

      <Text style={styles.inputLabel}>First Name *</Text>
      <View style={styles.inputIcon}>
        <User size={18} color="black" />
        <TextInput
          value={kinFirstName}
          onChangeText={setKinFirstName}
          placeholder="Enter first name"
          style={styles.inputFlex}
        />
      </View>

      <Text style={styles.inputLabel}>Last Name *</Text>
      <View style={styles.inputIcon}>
        <User size={18} color="black" />
        <TextInput
          value={kinLastName}
          onChangeText={setKinLastName}
          placeholder="Enter last name"
          style={styles.inputFlex}
        />
      </View>

      <Text style={styles.inputLabel}>Gender *</Text>
      <View style={styles.inputIcon}>
        <VenusAndMars size={18} color="black" />
        <RNPickerSelect
          onValueChange={setKinGender}
          placeholder={{ label: "Select gender", value: "" }}
          items={Gender}
          value={kinGender}
          style={pickerSelectStyles}
          useNativeAndroidPickerStyle={false}
        />
      </View>

      <Text style={styles.inputLabel}>Relationship *</Text>
      <View style={styles.inputIcon}>
        <Heart size={18} color="black" />
        <RNPickerSelect
          onValueChange={setRelationship}
          placeholder={{ label: "Select relationship", value: "" }}
          items={Relationship}
          value={relationship}
          style={pickerSelectStyles}
          useNativeAndroidPickerStyle={false}
        />
      </View>

      <Text style={styles.inputLabel}>Phone Number *</Text>
      <View style={styles.inputIcon}>
        <Phone size={18} color="black" />
        <TextInput
          value={kinPhone}
          onChangeText={setKinPhone}
          placeholder="Enter phone number"
          style={styles.inputFlex}
          keyboardType="phone-pad"
        />
      </View>

      <Text style={styles.inputLabel}>Email Address *</Text>
      <View style={styles.inputIcon}>
        <Mail size={18} color="black" />
        <TextInput
          value={kinEmail}
          onChangeText={setKinEmail}
          placeholder="Enter email address"
          style={styles.inputFlex}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <Text style={styles.inputLabel}>Address *</Text>
      <View style={styles.inputIcon}>
        <Home size={18} color="black" />
        <TextInput
          value={kinAddress}
          onChangeText={setKinAddress}
          placeholder="Enter home address"
          style={styles.inputFlex}
          multiline={true}
          numberOfLines={2}
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

export default Stage4NextOfKin;
