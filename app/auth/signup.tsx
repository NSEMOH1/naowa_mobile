import React, { useReducer, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import api from "@/constants/api";
import Stage1PersonalInfo from "@/features/signup-stages/stage1";
import Stage2MoreDetails from "@/features/signup-stages/stage2";
import Stage3BankInfoSimple from "@/features/signup-stages/stage3";
import Stage4NextOfKin from "@/features/signup-stages/stage4";
import Stage5Documents from "@/features/signup-stages/stage5";
import Stage6Security from "@/features/signup-stages/stage6";
import { ArrowRight } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { REGISTRATION_KEY } from "../_layout";

interface Document {
  uri: string;
  name: string;
  type?: string;
}

interface FormState {
  step: number;
  showSuccess: boolean;
  isLoading: boolean;
  username: string;
  fullName: string;
  password: string;
  address: string;
  dob: string;
  gender: string;
  occupation: string;
  placeOfWork: string;
  stateOrigin: string;
  phone: string;
  email: string;
  maritalStatus: string;
  spouseName: string;
  kinFirstName: string;
  kinLastName: string;
  kinPhone: string;
  kinGender: string;
  kinEmail: string;
  kinAddress: string;
  relationship: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  monthlyDeduction: string;
  transactionPin: string;
  securityQuestion: string;
  securityAnswer: string;
  profilePicture: Document | null;
  ninDocument: Document | null;
  isDatePickerVisible: boolean;
}

type FormAction =
  | { type: "UPDATE_FIELD"; field: keyof FormState; value: any }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "SHOW_SUCCESS" }
  | { type: "RESET_FORM" }
  | { type: "SET_LOADING"; isLoading: boolean }
  | { type: "SHOW_DATE_PICKER" }
  | { type: "HIDE_DATE_PICKER" };

const initialState: FormState = {
  step: 1,
  showSuccess: false,
  isLoading: false,
  username: "",
  fullName: "",
  password: "",
  address: "",
  dob: "",
  gender: "",
  occupation: "",
  placeOfWork: "",
  stateOrigin: "",
  phone: "",
  email: "",
  maritalStatus: "",
  spouseName: "",
  kinFirstName: "",
  kinLastName: "",
  kinPhone: "",
  kinGender: "",
  kinEmail: "",
  kinAddress: "",
  relationship: "",
  accountName: "",
  accountNumber: "",
  bankName: "",
  monthlyDeduction: "",
  transactionPin: "",
  securityQuestion: "",
  securityAnswer: "",
  profilePicture: null,
  ninDocument: null,
  isDatePickerVisible: false,
};

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value };
    case "NEXT_STEP":
      return { ...state, step: Math.min(state.step + 1, 6) };
    case "PREV_STEP":
      return { ...state, step: Math.max(state.step - 1, 1) };
    case "SHOW_SUCCESS":
      return { ...state, showSuccess: true };
    case "RESET_FORM":
      return { ...initialState, step: 1 };
    case "SET_LOADING":
      return { ...state, isLoading: action.isLoading };
    case "SHOW_DATE_PICKER":
      return { ...state, isDatePickerVisible: true };
    case "HIDE_DATE_PICKER":
      return { ...state, isDatePickerVisible: false };
    default:
      return state;
  }
};

const RegistrationForm = () => {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const validateCurrentStep = useCallback(() => {
    const {
      step,
      username,
      fullName,
      password,
      address,
      dob,
      gender,
      occupation,
      placeOfWork,
      stateOrigin,
      phone,
      email,
      maritalStatus,
      spouseName,
      accountNumber,
      bankName,
      transactionPin,
      monthlyDeduction,
      accountName,
      kinFirstName,
      kinLastName,
      kinGender,
      relationship,
      kinPhone,
      kinEmail,
      kinAddress,
      profilePicture,
      ninDocument,
      securityQuestion,
      securityAnswer,
    } = state;

    if (step === 1) {
      if (!username || !fullName || !address || !dob || !gender || !password) {
        Alert.alert("Error", "Please fill in all required fields");
        return false;
      }
    } else if (step === 2) {
      if (
        !occupation ||
        !placeOfWork ||
        !stateOrigin ||
        !maritalStatus ||
        !phone ||
        !email
      ) {
        Alert.alert("Error", "Please fill in all required fields");
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Alert.alert("Error", "Please enter a valid email address");
        return false;
      }
      if (phone.length < 10) {
        Alert.alert("Error", "Please enter a valid phone number");
        return false;
      }
      if (maritalStatus === "Married" && !spouseName) {
        Alert.alert("Error", "Please enter your spouse's name");
        return false;
      }
    } else if (step === 3) {
      if (
        !accountNumber ||
        !bankName ||
        !transactionPin ||
        !monthlyDeduction ||
        !accountName
      ) {
        Alert.alert("Error", "Please fill in all banking information");
        return false;
      }
      if (transactionPin.length !== 4) {
        Alert.alert("Error", "Transaction PIN must be 4 digits");
        return false;
      }
    } else if (step === 4) {
      if (
        !kinFirstName ||
        !kinLastName ||
        !kinGender ||
        !relationship ||
        !kinPhone ||
        !kinEmail ||
        !kinAddress
      ) {
        Alert.alert("Error", "Please fill in all next of kin information");
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(kinEmail)) {
        Alert.alert(
          "Error",
          "Please enter a valid email address for next of kin"
        );
        return false;
      }
    } else if (step === 5) {
      if (!profilePicture || !ninDocument) {
        Alert.alert("Error", "Please upload profile picture and NIN document");
        return false;
      }
    } else if (step === 6) {
      if (!securityQuestion || !securityAnswer) {
        Alert.alert(
          "Error",
          "Please select a security question and provide an answer"
        );
        return false;
      }
    }
    return true;
  }, [state]);

  const createFormData = useCallback(() => {
    const formData = new FormData();
    const payload = {
      username: state.username,
      full_name: state.fullName,
      password: state.password,
      address: state.address,
      date_of_birth: state.dob,
      gender: state.gender,
      occupation: state.occupation,
      place_of_work: state.placeOfWork,
      state_of_origin: state.stateOrigin,
      phone: state.phone,
      email: state.email,
      monthly_deduction: state.monthlyDeduction,
      marital_status: state.maritalStatus,
      spouse_name: state.spouseName || "",
      kin_first_name: state.kinFirstName,
      kin_last_name: state.kinLastName,
      kin_gender: state.kinGender,
      kin_phone: state.kinPhone,
      kin_address: state.kinAddress,
      kin_email: state.kinEmail,
      relationship: state.relationship,
      account_name: state.accountName,
      account_number: state.accountNumber,
      bank_name: state.bankName,
      pin: state.transactionPin,
      security_question: state.securityQuestion,
      security_answer: state.securityAnswer,
    };

    formData.append("data", JSON.stringify(payload));

    if (state.profilePicture) {
      formData.append("profile_picture", {
        uri: state.profilePicture.uri,
        type: state.profilePicture.type || "image/jpeg",
        name: state.profilePicture.name || "profile.jpg",
      } as any);
    }

    if (state.ninDocument) {
      formData.append("nin_document", {
        uri: state.ninDocument.uri,
        type: state.ninDocument.type || "application/pdf",
        name: state.ninDocument.name || "nin_document.pdf",
      } as any);
    }

    return formData;
  }, [state]);

  const handleRegister = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", isLoading: true });
      if (!validateCurrentStep()) {
        return;
      }

      const formData = createFormData();
      const response = await api.post("/api/auth/member/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      });

      if (response.status === 200 || response.status === 201) {
        await AsyncStorage.setItem(REGISTRATION_KEY, "true");
        dispatch({ type: "SHOW_SUCCESS" });
      } else {
        throw new Error(response.data?.message || "Registration failed");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      let errorMessage = "Registration failed. Please try again.";
      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Registration Error", errorMessage);
    } finally {
      dispatch({ type: "SET_LOADING", isLoading: false });
    }
  }, [createFormData, validateCurrentStep]);

  const nextStep = useCallback(() => {
    if (state.step === 6) {
      handleRegister();
    } else {
      dispatch({ type: "NEXT_STEP" });
    }
  }, [handleRegister, state.step]);

  const prevStep = useCallback(() => {
    dispatch({ type: "PREV_STEP" });
  }, []);

  const showDatePicker = useCallback(() => {
    dispatch({ type: "SHOW_DATE_PICKER" });
  }, []);

  const hideDatePicker = useCallback(() => {
    dispatch({ type: "HIDE_DATE_PICKER" });
  }, []);

  const handleConfirm = useCallback((date: Date) => {
    dispatch({
      type: "UPDATE_FIELD",
      field: "dob",
      value: date.toISOString().split("T")[0],
    });
    hideDatePicker();
  }, []);

  const handleLogin = useCallback(() => {
    router.push("/auth/login");
    dispatch({ type: "RESET_FORM" });
  }, []);

  const renderCurrentStage = useCallback(() => {
    switch (state.step) {
      case 1:
        return (
          <Stage1PersonalInfo
            username={state.username}
            setUsername={(value) =>
              dispatch({ type: "UPDATE_FIELD", field: "username", value })
            }
            password={state.password}
            setPassword={(value) =>
              dispatch({ type: "UPDATE_FIELD", field: "password", value })
            }
            fullName={state.fullName}
            setFullName={(value) =>
              dispatch({ type: "UPDATE_FIELD", field: "fullName", value })
            }
            address={state.address}
            setAddress={(value) =>
              dispatch({ type: "UPDATE_FIELD", field: "address", value })
            }
            dob={state.dob}
            setDob={(value) =>
              dispatch({ type: "UPDATE_FIELD", field: "dob", value })
            }
            gender={state.gender}
            setGender={(value) =>
              dispatch({ type: "UPDATE_FIELD", field: "gender", value })
            }
            isDatePickerVisible={state.isDatePickerVisible}
            setDatePickerVisible={(value) =>
              dispatch({
                type: value ? "SHOW_DATE_PICKER" : "HIDE_DATE_PICKER",
              })
            }
            showDatePicker={showDatePicker}
            hideDatePicker={hideDatePicker}
            handleConfirm={handleConfirm}
          />
        );
      case 2:
        return (
          <Stage2MoreDetails
            phone={state.phone}
            setPhone={(value) =>
              dispatch({ type: "UPDATE_FIELD", field: "phone", value })
            }
            email={state.email}
            setEmail={(value) =>
              dispatch({ type: "UPDATE_FIELD", field: "email", value })
            }
            occupation={state.occupation}
            setOccupation={(value) =>
              dispatch({ type: "UPDATE_FIELD", field: "occupation", value })
            }
            placeOfWork={state.placeOfWork}
            setPlaceOfWork={(value) =>
              dispatch({ type: "UPDATE_FIELD", field: "placeOfWork", value })
            }
            stateOrigin={state.stateOrigin}
            setStateOrigin={(value) =>
              dispatch({ type: "UPDATE_FIELD", field: "stateOrigin", value })
            }
            maritalStatus={state.maritalStatus}
            setMaritalStatus={(value) =>
              dispatch({ type: "UPDATE_FIELD", field: "maritalStatus", value })
            }
            spouseName={state.spouseName}
            setSpouseName={(value) =>
              dispatch({ type: "UPDATE_FIELD", field: "spouseName", value })
            }
            prevStep={prevStep}
          />
        );
      case 3:
        return (
          <Stage3BankInfoSimple
            bankName={state.bankName}
            setBankName={(value) =>
              dispatch({ type: "UPDATE_FIELD", field: "bankName", value })
            }
            accountNumber={state.accountNumber}
            setAccountNumber={(value) =>
              dispatch({ type: "UPDATE_FIELD", field: "accountNumber", value })
            }
            accountName={state.accountName}
            setAccountName={(value) =>
              dispatch({ type: "UPDATE_FIELD", field: "accountName", value })
            }
            monthlyDeduction={state.monthlyDeduction}
            setMonthlyDeduction={(value) =>
              dispatch({
                type: "UPDATE_FIELD",
                field: "monthlyDeduction",
                value,
              })
            }
            transactionPin={state.transactionPin}
            setTransactionPin={(value) =>
              dispatch({ type: "UPDATE_FIELD", field: "transactionPin", value })
            }
            prevStep={prevStep}
          />
        );
      case 4:
        return (
          <Stage4NextOfKin
            kinFirstName={state.kinFirstName}
            setKinFirstName={(value) =>
              dispatch({ type: "UPDATE_FIELD", field: "kinFirstName", value })
            }
            kinLastName={state.kinLastName}
            setKinLastName={(value) =>
              dispatch({ type: "UPDATE_FIELD", field: "kinLastName", value })
            }
            kinGender={state.kinGender}
            setKinGender={(value) =>
              dispatch({ type: "UPDATE_FIELD", field: "kinGender", value })
            }
            relationship={state.relationship}
            setRelationship={(value) =>
              dispatch({ type: "UPDATE_FIELD", field: "relationship", value })
            }
            kinPhone={state.kinPhone}
            setKinPhone={(value) =>
              dispatch({ type: "UPDATE_FIELD", field: "kinPhone", value })
            }
            kinEmail={state.kinEmail}
            setKinEmail={(value) =>
              dispatch({ type: "UPDATE_FIELD", field: "kinEmail", value })
            }
            kinAddress={state.kinAddress}
            setKinAddress={(value) =>
              dispatch({ type: "UPDATE_FIELD", field: "kinAddress", value })
            }
            prevStep={prevStep}
          />
        );
      case 5:
        return (
          <Stage5Documents
            profilePicture={state.profilePicture}
            setProfilePicture={(value) =>
              dispatch({ type: "UPDATE_FIELD", field: "profilePicture", value })
            }
            ninDocument={state.ninDocument}
            setNinDocument={(value) =>
              dispatch({ type: "UPDATE_FIELD", field: "ninDocument", value })
            }
            prevStep={prevStep}
          />
        );
      case 6:
        return (
          <Stage6Security
            securityQuestion={state.securityQuestion}
            setSecurityQuestion={(value) =>
              dispatch({
                type: "UPDATE_FIELD",
                field: "securityQuestion",
                value,
              })
            }
            securityAnswer={state.securityAnswer}
            setSecurityAnswer={(value) =>
              dispatch({ type: "UPDATE_FIELD", field: "securityAnswer", value })
            }
            prevStep={prevStep}
          />
        );
      default:
        return null;
    }
  }, [
    state.step,
    state.username,
    state.password,
    state.fullName,
    state.address,
    state.dob,
    state.gender,
    state.isDatePickerVisible,
    state.phone,
    state.email,
    state.occupation,
    state.placeOfWork,
    state.stateOrigin,
    state.maritalStatus,
    state.spouseName,
    state.bankName,
    state.accountNumber,
    state.accountName,
    state.monthlyDeduction,
    state.transactionPin,
    state.kinFirstName,
    state.kinLastName,
    state.kinGender,
    state.relationship,
    state.kinPhone,
    state.kinEmail,
    state.kinAddress,
    state.profilePicture,
    state.ninDocument,
    state.securityQuestion,
    state.securityAnswer,
    showDatePicker,
    hideDatePicker,
    handleConfirm,
    prevStep,
  ]);

  if (state.showSuccess) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ImageBackground
          source={require("../../assets/images/naowa.png")}
          resizeMode="cover"
          style={styles.backgroundImage}
        >
          <View style={styles.successOverlay}>
            <View style={styles.successContainer}>
              <View style={styles.logo}>
                <Image
                  source={require("../../assets/images/naowa.png")}
                  style={styles.logoImage}
                />
              </View>
              <View style={styles.successCard}>
                <Text style={styles.successTitle}>
                  Your Account Has been{"\n"}Created Successfully
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
                  onPress={handleLogin}
                >
                  <Text style={styles.loginButtonText}>Login</Text>
                  <ArrowRight color={"white"} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.logo}>
          <Image
            source={require("../../assets/images/naowa.png")}
            style={styles.logoImage}
          />
        </View>

        <View style={styles.form}>
          <View style={styles.stepper}>
            {[
              "Personal Info",
              "More Details",
              "Bank Info",
              "Next of Kin",
              "Documents",
              "Security",
            ].map((label, index) => {
              const stepNumber = index + 1;
              const isActive = state.step === stepNumber;
              return (
                <View key={index} style={styles.stepItem}>
                  <View
                    style={[styles.circle, isActive && styles.activeCircle]}
                  >
                    <Text style={styles.circleText}>{stepNumber}</Text>
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      isActive && styles.activeStepLabel,
                    ]}
                  >
                    {label}
                  </Text>
                </View>
              );
            })}
          </View>

          {renderCurrentStage()}
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[
              styles.buttonPrimary,
              state.isLoading && styles.buttonDisabled,
            ]}
            onPress={nextStep}
            disabled={state.isLoading}
          >
            <Text style={styles.buttonText}>
              {state.isLoading
                ? "Submitting..."
                : state.step === 6
                ? "Submit"
                : "Proceed"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegistrationForm;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingTop: 30,
  },
  logo: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 10,
  },
  logoImage: {
    width: 60,
    height: 80,
    resizeMode: "contain",
  },
  form: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
  },
  stepper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  stepItem: {
    alignItems: "center",
    flex: 1,
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  activeCircle: {
    backgroundColor: "#982323",
  },
  circleText: {
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "Poppins_400Regular",
  },
  stepLabel: {
    fontSize: 9,
    marginTop: 4,
    color: "#666",
    textAlign: "center",
    fontFamily: "Poppins_400Regular",
  },
  activeStepLabel: {
    color: "#982323",
    fontWeight: "bold",
    fontFamily: "Poppins_400Regular",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 20,
  },
  buttonPrimary: {
    backgroundColor: "#982323",
    padding: 14,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    marginLeft: 5,
    width: "100%",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "Poppins_400Regular",
  },
  successOverlay: {
    flex: 1,
    backgroundColor: "#982323",
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
    backgroundColor: "#982323",
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
  loginButton: {
    backgroundColor: "#982323",
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
  loginArrow: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Poppins_400Regular",
  },
});
