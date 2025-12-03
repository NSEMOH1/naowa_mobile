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
import api from "@/constants/api";

const ForgotPasswordFlow: React.FC<ForgotPasswordFlowProps> = ({
  navigation,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<ForgotPasswordFormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);

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
    setErrors({}); 

    try {
      switch (currentStep) {
        case 1:
          try {
            const response = await api.post("/api/auth/verify-email", {
              email: formData.email,
            });

            if (response.data.success) {
              setCurrentStep(2);
            } else {
              setErrors({ email: "Failed to send OTP. Please try again." });
            }
          } catch (error: any) {
            console.error("Error sending OTP:", error);
            setErrors({
              email: error.response?.data?.error || "An error occurred. Please try again.",
            });
          }
          break;

        case 2:
          try {
            const response = await api.post("/api/auth/verify-otp", {
              email: formData.email,
              otp: formData.otp,
            });

            if (response.data.success) {
              setCurrentStep(3);
            } else {
              setErrors({ otp: "Invalid OTP. Please try again." });
            }
          } catch (error: any) {
            console.error("Error verifying OTP:", error);
            setErrors({
              otp: error.response?.data?.error || "Failed to verify OTP. Please try again.",
            });
          }
          break;

        case 3:
          try {
            const response = await api.post("/api/auth/reset-password", {
              email: formData.email,
              newPassword: formData.newPassword,
            });

            if (response.data.success) {
              setCurrentStep(4);
            } else {
              setErrors({ newPassword: "Failed to reset password. Please try again." });
            }
          } catch (error: any) {
            console.error("Error resetting password:", error);
            setErrors({
              newPassword: error.response?.data?.error || "An error occurred. Please try again.",
            });
          }
          break;
      }
    } catch (error: any) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = (): void => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleResendOTP = async (): Promise<void> => {
    setLoading(true);
    setErrors({});
    
    try {
      const response = await api.post("/api/auth/verify-email", {
        email: formData.email,
      });

      if (response.data.success) {
        Alert.alert("Success", "OTP has been resent to your email");
      } else {
        Alert.alert("Error", "Failed to resend OTP. Please try again.");
      }
    } catch (error: any) {
      console.error("Error resending OTP:", error);
      Alert.alert(
        "Error", 
        error.response?.data?.error || "Failed to resend OTP. Please try again."
      );
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
              editable={!loading}
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
              editable={!loading}
            />
            {errors.otp && <Text style={styles.errorText}>{errors.otp}</Text>}

            <TouchableOpacity 
              onPress={handleResendOTP} 
              disabled={loading}
              style={loading && styles.disabledLink}
            >
              <Text style={styles.linkText}>Didn't receive OTP? Resend</Text>
            </TouchableOpacity>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            {renderLogo()}
            <Text style={styles.title}>Create New Password</Text>
            <Text style={styles.subtitle}>Enter your new password</Text>

            <TextInput
              style={[styles.input, errors.newPassword && styles.inputError]}
              placeholder="New password (min. 6 characters)"
              value={formData.newPassword}
              onChangeText={(text: string) =>
                updateFormData("newPassword", text)
              }
              secureTextEntry
              autoCapitalize="none"
              editable={!loading}
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
              editable={!loading}
            />
            {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}
          </View>
        );

      case 4:
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
              <Text style={styles.successButtonText}>Login</Text>
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
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {currentStep < 4 && (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBack}
              disabled={loading}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
          )}

          {renderStepContent()}

          {currentStep < 4 && currentStep !== 4 && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.nextButton, loading && styles.buttonDisabled]}
                onPress={handleNext}
                disabled={loading}
              >
                <Text style={styles.nextButtonText}>
                  {loading
                    ? currentStep === 1
                      ? "Sending OTP..."
                      : currentStep === 2
                      ? "Verifying..."
                      : "Resetting..."
                    : currentStep === 3
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
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: "#007AFF",
    fontFamily: "Poppins_400Regular",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  logo: {
    width: 80,
    height: 100,
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
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    marginTop: -5,
    marginBottom: 10,
    textAlign: "left",
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
  disabledLink: {
    opacity: 0.5,
  },
  buttonContainer: {
    marginTop: 30,
    marginBottom: 20,
  },
  nextButton: {
    backgroundColor: "#982323",
    borderRadius: 12,
    padding: 18,
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
    opacity: 0.7,
  },
  successTitle: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#34C759",
    fontFamily: "Poppins_400Regular",
  },
  successSubtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
    color: "#666",
    lineHeight: 24,
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