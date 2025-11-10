import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { router } from "expo-router";
import {
  ForgotPasswordFlowProps,
  ForgotPasswordFormData,
  ForgotPasswordFormErrors,
} from "@/types";
import { SafeAreaView } from "react-native-safe-area-context";

const ForgotPasswordFlow: React.FC<ForgotPasswordFlowProps> = ({
  navigation,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: "",
    otp: "",
    securityAnswer: "",
    transactionPin: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<ForgotPasswordFormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);

  const securityQuestion: string = "What is your mother's maiden name?";

  const updateFormData = (
    field: keyof ForgotPasswordFormData,
    value: string
  ): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: ForgotPasswordFormErrors = {};

    switch (step) {
      case 1:
        if (!formData.email.trim()) {
          newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = "Please enter a valid email";
        }
        break;

      case 2:
        if (!formData.otp.trim()) {
          newErrors.otp = "OTP is required";
        } else if (formData.otp.length !== 6) {
          newErrors.otp = "OTP must be 6 digits";
        }
        break;

      case 3:
        if (!formData.securityAnswer.trim()) {
          newErrors.securityAnswer = "Security answer is required";
        }
        break;

      case 4:
        if (!formData.transactionPin.trim()) {
          newErrors.transactionPin = "Transaction PIN is required";
        } else if (formData.transactionPin.length !== 4) {
          newErrors.transactionPin = "PIN must be 4 digits";
        }
        break;

      case 5:
        if (!formData.newPassword.trim()) {
          newErrors.newPassword = "New password is required";
        } else if (formData.newPassword.length < 6) {
          newErrors.newPassword = "Password must be at least 6 characters";
        }

        if (!formData.confirmPassword.trim()) {
          newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.newPassword !== formData.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async (): Promise<void> => {
    if (!validateStep(currentStep)) return;

    setLoading(true);

    try {
      // Simulate API calls
      switch (currentStep) {
        case 1:
          // Send OTP to email
          console.log("Sending OTP to:", formData.email);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          break;

        case 2:
          // Verify OTP
          console.log("Verifying OTP:", formData.otp);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          break;

        case 3:
          // Verify security answer
          console.log("Verifying security answer:", formData.securityAnswer);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          break;

        case 4:
          // Verify transaction PIN
          console.log("Verifying transaction PIN:", formData.transactionPin);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          break;

        case 5:
          // Reset password
          console.log("Resetting password");
          await new Promise((resolve) => setTimeout(resolve, 1000));
          break;
      }

      if (currentStep < 6) {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = (): void => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleResendOTP = async (): Promise<void> => {
    setLoading(true);
    try {
      console.log("Resending OTP to:", formData.email);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      Alert.alert("Success", "OTP has been resent to your email");
    } catch (error) {
      Alert.alert("Error", "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const renderLogo = (): React.JSX.Element => (
    <View style={styles.logoContainer}>
      <Image
        source={require("../../assets/images/naowa.png")}
        style={styles.logo}
      />
    </View>
  );

  const renderStepContent = (): React.JSX.Element => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            {renderLogo()}
            <Text style={styles.title}>Enter Your Email</Text>
            <Text style={styles.subtitle}>
              We'll send an OTP to verify your identity
            </Text>

            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="Enter your email address"
              value={formData.email}
              onChangeText={(text: string) => updateFormData("email", text)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            {renderLogo()}
            <Text style={styles.title}>Enter OTP</Text>
            <Text style={styles.subtitle}>
              Enter the 6-digit code sent to {formData.email}
            </Text>

            <TextInput
              style={[
                styles.input,
                styles.otpInput,
                errors.otp && styles.inputError,
              ]}
              placeholder="000000"
              value={formData.otp}
              onChangeText={(text: string) =>
                updateFormData("otp", text.replace(/\D/g, ""))
              }
              keyboardType="numeric"
              maxLength={6}
              textAlign="center"
            />
            {errors.otp && <Text style={styles.errorText}>{errors.otp}</Text>}

            <TouchableOpacity onPress={handleResendOTP} disabled={loading}>
              <Text style={styles.linkText}>Didn't receive OTP? Resend</Text>
            </TouchableOpacity>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            {renderLogo()}
            <Text style={styles.title}>Security Question</Text>
            <Text style={styles.subtitle}>
              Please answer your security question
            </Text>

            <Text style={styles.questionText}>{securityQuestion}</Text>

            <TextInput
              style={[styles.input, errors.securityAnswer && styles.inputError]}
              placeholder="Enter your answer"
              value={formData.securityAnswer}
              onChangeText={(text: string) =>
                updateFormData("securityAnswer", text)
              }
              autoCapitalize="words"
            />
            {errors.securityAnswer && (
              <Text style={styles.errorText}>{errors.securityAnswer}</Text>
            )}
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContainer}>
            {renderLogo()}
            <Text style={styles.title}>Transaction PIN</Text>
            <Text style={styles.subtitle}>
              Enter your 4-digit transaction PIN
            </Text>

            <TextInput
              style={[
                styles.input,
                styles.pinInput,
                errors.transactionPin && styles.inputError,
              ]}
              placeholder="0000"
              value={formData.transactionPin}
              onChangeText={(text: string) =>
                updateFormData("transactionPin", text.replace(/\D/g, ""))
              }
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
              textAlign="center"
            />
            {errors.transactionPin && (
              <Text style={styles.errorText}>{errors.transactionPin}</Text>
            )}
          </View>
        );

      case 5:
        return (
          <View style={styles.stepContainer}>
            {renderLogo()}
            <Text style={styles.title}>Create New Password</Text>
            <Text style={styles.subtitle}>Enter your new password</Text>

            <TextInput
              style={[styles.input, errors.newPassword && styles.inputError]}
              placeholder="New password"
              value={formData.newPassword}
              onChangeText={(text: string) =>
                updateFormData("newPassword", text)
              }
              secureTextEntry
              autoCapitalize="none"
            />
            {errors.newPassword && (
              <Text style={styles.errorText}>{errors.newPassword}</Text>
            )}

            <TextInput
              style={[
                styles.input,
                errors.confirmPassword && styles.inputError,
              ]}
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChangeText={(text: string) =>
                updateFormData("confirmPassword", text)
              }
              secureTextEntry
              autoCapitalize="none"
            />
            {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}
          </View>
        );

      case 6:
        return (
          <View style={styles.stepContainer}>
            {renderLogo()}
            <Text style={styles.successTitle}>
              Password Changed Successfully! 🎉
            </Text>
            <Text style={styles.successSubtitle}>
              Your password has been successfully reset. You can now login with
              your new password.
            </Text>

            <TouchableOpacity
              style={styles.successButton}
              onPress={() => router.push("/auth/login")}
            >
              <Text style={styles.successButtonText}>Login </Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return <View />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {renderStepContent()}

          {currentStep < 6 && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.nextButton, loading && styles.buttonDisabled]}
                onPress={handleNext}
                disabled={loading}
              >
                <Text style={styles.nextButtonText}>
                  {loading
                    ? "Please wait..."
                    : currentStep === 5
                    ? "Reset Password"
                    : "Continue"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 60,
    height: 80,
    resizeMode: "contain",
  },
  stepContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "Poppins_400Regular",
    color: "#1a1a1a",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
    lineHeight: 22,
    fontFamily: "Poppins_400Regular",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    fontFamily: "Poppins_400Regular",
  },
  inputError: {
    borderColor: "#FF3B30",
    backgroundColor: "#FFF5F5",
  },
  otpInput: {
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 8,
    fontFamily: "Poppins_400Regular",
  },
  pinInput: {
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 4,
    fontFamily: "Poppins_400Regular",
  },
  questionText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    fontFamily: "Poppins_400Regular",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    marginTop: -10,
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "Poppins_400Regular",
  },
  linkText: {
    color: "#007AFF",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    textDecorationLine: "underline",
    fontFamily: "Poppins_400Regular",
  },
  buttonContainer: {
    marginTop: 30,
  },
  nextButton: {
    backgroundColor: "#2F4F2F",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Poppins_400Regular",
  },
  buttonDisabled: {
    backgroundColor: "#B0B0B0",
  },
  successTitle: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#34C759",
    fontFamily: "Poppins_400Regular",
  },
  successSubtitle: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 40,
    color: "#666",
    lineHeight: 26,
    fontFamily: "Poppins_400Regular",
  },
  successButton: {
    backgroundColor: "#2F4F2F",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
  },
  successButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Poppins_400Regular",
  },
});

export default ForgotPasswordFlow;
