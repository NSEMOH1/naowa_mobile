import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { X, ArrowLeft, Upload, CheckCircle } from "lucide-react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { LoanEnrollmentFlowProps } from "@/types";
import { OtpInput } from "react-native-otp-entry";
import { useSavingsBalance } from "@/hooks/useSavings";
import { useMemberStore } from "@/store/user";
import { useAuthStore } from "@/hooks/useAuth";
import SuccessScreen from "@/components/Success";
import { useBalances } from "@/hooks/useBalances";
import api from "@/constants/api";
import { router } from "expo-router";

interface UploadedFile {
  uri: string;
  name: string;
  type: string;
  size?: number;
}

interface UploadedFiles {
  nonIndebtedness: UploadedFile | null;
  application: UploadedFile | null;
  validId: UploadedFile | null;
  incomeProof: UploadedFile | null;
  accountStatement: UploadedFile | null;
  utilityBill: UploadedFile | null;
  guarantorLetter: UploadedFile | null;
  guarantorPassport: UploadedFile | null;
  personalPassport: UploadedFile | null;
}

const LoanEnrollmentFlow: React.FC<LoanEnrollmentFlowProps> = ({
  visible,
  onClose,
}) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [servicingLoan, setServicingLoan] = useState("");
  const [amount, setAmount] = useState("");
  const [tenure, setTenure] = useState("");
  const [category, setCategory] = useState("REGULAR");

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({
    nonIndebtedness: null,
    application: null,
    validId: null,
    incomeProof: null,
    accountStatement: null,
    utilityBill: null,
    guarantorLetter: null,
    guarantorPassport: null,
    personalPassport: null,
  });
  const [otp, setOtp] = useState("");
  const [loanId, setLoanId] = useState<string>("");
  const [loanReference, setLoanReference] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState("");

  const { balance: savingsBalance } = useSavingsBalance();
  const balances = useBalances();
  const { user } = useAuthStore();
  const { member, fetchMember } = useMemberStore();

  useEffect(() => {
    if (user?.id && visible) {
      fetchMember(user?.id);
    }
  }, [user?.id, fetchMember, visible]);

  const getInterestRate = (selectedTenure: string): number => {
    switch (selectedTenure) {
      case "12":
        return 5;
      case "24":
        return 7;
      default:
        return 5;
    }
  };

  const interestRate = getInterestRate(tenure);
  const loanAmount = parseFloat(amount) || 0;
  const interestAmount = (loanAmount * interestRate) / 100;
  const totalInterest = interestAmount * (parseInt(tenure) || 1);
  const totalAmount = loanAmount + totalInterest;
  const monthlyPayment = totalAmount / (parseInt(tenure) || 1);

  const handleFileUpload = async (fileType: keyof UploadedFiles) => {
    try {
      Alert.alert(
        "Choose Upload Method",
        "How would you like to upload the document?",
        [
          {
            text: "Take Photo",
            onPress: () => takePhoto(fileType),
          },
          {
            text: "Choose from Gallery",
            onPress: () => pickImage(fileType),
          },
          {
            text: "Choose Document",
            onPress: () => pickDocument(fileType),
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]
      );
    } catch (error) {
      console.error("Error requesting permissions:", error);
      Alert.alert("Error", "Failed to request permissions");
    }
  };

  const takePhoto = async (fileType: keyof UploadedFiles) => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Camera permission is required to take photos"
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setUploadedFiles((prev) => ({
          ...prev,
          [fileType]: {
            uri: asset.uri,
            name: `${fileType}_${Date.now()}.jpg`,
            type: asset.type || "image/jpeg",
            size: asset.fileSize,
          },
        }));
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const pickImage = async (fileType: keyof UploadedFiles) => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Gallery permission is required to select images"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setUploadedFiles((prev) => ({
          ...prev,
          [fileType]: {
            uri: asset.uri,
            name: asset.fileName || `${fileType}_${Date.now()}.jpg`,
            type: asset.type || "image/jpeg",
            size: asset.fileSize,
          },
        }));
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to select image");
    }
  };

  const pickDocument = async (fileType: keyof UploadedFiles) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/jpeg", "image/png"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        if (asset.size && asset.size > 3 * 1024 * 1024) {
          Alert.alert("File too large", "File must be less than 3MB");
          return;
        }

        setUploadedFiles((prev) => ({
          ...prev,
          [fileType]: {
            uri: asset.uri,
            name: asset.name,
            type: asset.mimeType || "application/pdf",
            size: asset.size,
          },
        }));
      }
    } catch (error) {
      console.error("Error picking document:", error);
      Alert.alert("Error", "Failed to select document");
    }
  };

  const validateStep1 = (): boolean => {
    if (!servicingLoan) {
      setErrorMessage("Please indicate if you're currently servicing a loan");
      return false;
    }
    if (!amount || loanAmount <= 0) {
      setErrorMessage("Please enter a valid loan amount");
      return false;
    }
    if (!tenure || (tenure !== "12" && tenure !== "24")) {
      setErrorMessage("Please select a valid tenure (12 or 24 months)");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const validateStep3 = (): boolean => {
    const hasAllFiles = !!(
      uploadedFiles.nonIndebtedness &&
      uploadedFiles.application &&
      uploadedFiles.validId
    );
    if (!hasAllFiles) {
      setErrorMessage("Please upload all required documents in step 3");
    }
    return hasAllFiles;
  };

  const validateStep4 = (): boolean => {
    const hasAllFiles = !!(
      uploadedFiles.incomeProof &&
      uploadedFiles.accountStatement &&
      uploadedFiles.utilityBill
    );
    if (!hasAllFiles) {
      setErrorMessage("Please upload all required documents in step 4");
    }
    return hasAllFiles;
  };

  const validateStep5 = (): boolean => {
    const hasAllFiles = !!(
      uploadedFiles.guarantorLetter &&
      uploadedFiles.guarantorPassport &&
      uploadedFiles.personalPassport
    );
    if (!hasAllFiles) {
      setErrorMessage("Please upload all required documents in step 5");
    }
    return hasAllFiles;
  };

  const handleProceed = () => {
    let canProceed = false;
    let validationFunction: (() => boolean) | null = null;

    switch (step) {
      case 1:
        validationFunction = validateStep1;
        break;
      case 3:
        validationFunction = validateStep3;
        break;
      case 4:
        validationFunction = validateStep4;
        break;
      case 5:
        validationFunction = validateStep5;
        break;
      case 6:
        submitLoanApplication();
        return;
      default:
        canProceed = true;
    }

    if (validationFunction) {
      canProceed = validationFunction();
    }

    if (!canProceed && step !== 2) {
      Alert.alert(
        "Validation Error",
        errorMessage || "Please complete all required fields"
      );
      return;
    }

    setStep(step + 1);
    setErrorMessage("");
  };

  const createFormData = () => {
    try {
      const formData = new FormData();

      const loanAmountValue = parseFloat(amount);
      const tenureValue = parseInt(tenure);

      const payload = {
        category: category,
        amount: loanAmountValue,
        durationMonths: tenureValue,
        servicingLoan: servicingLoan,
      };

      formData.append("data", JSON.stringify(payload));

      const appendFile = (fieldName: string, file: UploadedFile | null) => {
        if (file) {
          const fileData = {
            uri: file.uri,
            type: file.type,
            name: file.name,
          };
          formData.append(fieldName, fileData as any);
        }
      };

      appendFile("nonIndebtedness", uploadedFiles.nonIndebtedness);
      appendFile("application", uploadedFiles.application);
      appendFile("validId", uploadedFiles.validId);
      appendFile("incomeProof", uploadedFiles.incomeProof);
      appendFile("accountStatement", uploadedFiles.accountStatement);
      appendFile("utilityBill", uploadedFiles.utilityBill);
      appendFile("guarantorLetter", uploadedFiles.guarantorLetter);
      appendFile("guarantorPassport", uploadedFiles.guarantorPassport);
      appendFile("personalPassport", uploadedFiles.personalPassport);

      return formData;
    } catch (error) {
      console.error("Error creating FormData:", error);
      throw new Error("Failed to prepare loan application data");
    }
  };

  const submitLoanApplication = async () => {
    setLoading(true);
    try {
      const formData = createFormData();
      const response = await api.post("/api/loan/apply", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      });

      if (response.data.success && response.data.loan) {
        setLoanId(response.data.loan.id);
        setLoanReference(response.data.loan.reference || `REF-${Date.now()}`);
        setStep(7);
        Alert.alert(
          "Success",
          "Loan application submitted successfully. Please check your phone for OTP.",
          [{ text: "OK" }]
        );
      } else {
        throw new Error(
          response.data.message || "Failed to submit application"
        );
      }
    } catch (error: any) {
      console.error("Error submitting loan:", error);
      let errorMessage = "Failed to submit loan application";

      if (error?.response?.data) {
        errorMessage =
          error.response.data.message ||
          error.response.data.error ||
          errorMessage;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      Alert.alert("Submission Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert("Error", "Please enter complete 6-digit OTP");
      return;
    }

    if (!loanId) {
      Alert.alert(
        "Error",
        "Loan ID not found. Please restart the application."
      );
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/api/loan/${loanId}/verify`, { otp });

      if (response.data.success) {
        setStep(8)
      } else {
        throw new Error(response.data.message || "OTP verification failed");
      }
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      Alert.alert(
        "Verification Failed",
        error.response?.data?.message || error.message || "Invalid OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrorMessage("");
    } else {
      onClose();
    }
  };

  const resetFlow = () => {
    setStep(1);
    setAmount("");
    setServicingLoan("");
    setTenure("");
    setCategory("");
    setUploadedFiles({
      nonIndebtedness: null,
      application: null,
      validId: null,
      incomeProof: null,
      accountStatement: null,
      utilityBill: null,
      guarantorLetter: null,
      guarantorPassport: null,
      personalPassport: null,
    });
    setOtp("");
    setLoanId("");
    setLoanReference("");
    setErrorMessage("");
    onClose();
  };

  const renderFileUploadBox = (
    fileType: keyof UploadedFiles,
    title: string
  ) => {
    const file = uploadedFiles[fileType];
    const isUploaded = !!file;

    return (
      <TouchableOpacity
        style={[styles.uploadBox, isUploaded && styles.uploadedBox]}
        onPress={() => handleFileUpload(fileType)}
        activeOpacity={0.7}
      >
        {isUploaded ? (
          <CheckCircle size={24} color="#982323" />
        ) : (
          <Upload size={24} color="#666" />
        )}
        <Text style={styles.uploadTitle}>{title}</Text>
        <Text style={styles.uploadSubtitle} numberOfLines={2}>
          {isUploaded ? file.name || "Uploaded" : "Tap to upload"}
        </Text>
        {isUploaded && file.size && (
          <Text style={styles.fileSizeText}>
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={step === 8 ? resetFlow : handleBack}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            {step !== 8 && step > 1 && (
              <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <ArrowLeft size={24} color="#333" />
              </TouchableOpacity>
            )}
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Loan Application</Text>
              <Text style={styles.headerSubtitle}>Step {step} of 8</Text>
            </View>
            {step !== 8 && (
              <TouchableOpacity onPress={resetFlow} style={styles.closeButton}>
                <X size={24} color="#333" />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {step === 1 && (
              <>
                <Text style={styles.sectionTitle}>Loan Information</Text>
                <Text style={styles.subTitle}>
                  Fill in your loan details below
                </Text>

                {errorMessage ? (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{errorMessage}</Text>
                  </View>
                ) : null}

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Loan Type</Text>
                  <TextInput
                    style={[styles.input, styles.disabledInput]}
                    value={"REGULAR LOAN"}
                    editable={false}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    Are you currently servicing a loan? *
                  </Text>
                  <View style={styles.radioGroup}>
                    <TouchableOpacity
                      style={[
                        styles.radioButton,
                        servicingLoan === "yes" && styles.selectedRadio,
                      ]}
                      onPress={() => setServicingLoan("yes")}
                    >
                      <Text
                        style={[
                          styles.radioText,
                          servicingLoan === "yes" && styles.selectedRadioText,
                        ]}
                      >
                        Yes
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.radioButton,
                        servicingLoan === "no" && styles.selectedRadio,
                      ]}
                      onPress={() => setServicingLoan("no")}
                    >
                      <Text
                        style={[
                          styles.radioText,
                          servicingLoan === "no" && styles.selectedRadioText,
                        ]}
                      >
                        No
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Loan Amount (₦) *</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder="Enter loan amount"
                    value={amount}
                    onChangeText={(text) => {
                      setAmount(text.replace(/[^0-9]/g, ""));
                      setErrorMessage("");
                    }}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Tenure (months) *</Text>
                  <View style={styles.tenureOptions}>
                    <TouchableOpacity
                      style={[
                        styles.tenureButton,
                        tenure === "12" && styles.selectedTenure,
                      ]}
                      onPress={() => setTenure("12")}
                    >
                      <Text
                        style={[
                          styles.tenureText,
                          tenure === "12" && styles.selectedTenureText,
                        ]}
                      >
                        12 months (5%)
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.tenureButton,
                        tenure === "24" && styles.selectedTenure,
                      ]}
                      onPress={() => setTenure("24")}
                    >
                      <Text
                        style={[
                          styles.tenureText,
                          tenure === "24" && styles.selectedTenureText,
                        ]}
                      >
                        24 months (7%)
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    loading && styles.buttonDisabled,
                  ]}
                  onPress={handleProceed}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Proceed</Text>
                  )}
                </TouchableOpacity>
              </>
            )}

            {step === 2 && (
              <>
                <Text style={styles.sectionTitle}>Personal Information</Text>
                <Text style={styles.subTitle}>
                  Review your personal details
                </Text>

                <View style={styles.previewBox}>
                  <View style={styles.previewRow}>
                    <Text style={styles.previewLabel}>Full Name:</Text>
                    <Text style={styles.previewValue}>
                      {member?.full_name || "N/A"}
                    </Text>
                  </View>
                  <View style={styles.previewRow}>
                    <Text style={styles.previewLabel}>Email:</Text>
                    <Text style={styles.previewValue}>
                      {member?.email || "N/A"}
                    </Text>
                  </View>
                  <View style={styles.previewRow}>
                    <Text style={styles.previewLabel}>Phone:</Text>
                    <Text style={styles.previewValue}>
                      {member?.phone || "N/A"}
                    </Text>
                  </View>
                  <View style={styles.previewRow}>
                    <Text style={styles.previewLabel}>Address:</Text>
                    <Text style={styles.previewValue}>
                      {member?.address || "N/A"}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleProceed}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Continue</Text>
                  )}
                </TouchableOpacity>
              </>
            )}

            {[3, 4, 5].includes(step) && (
              <>
                <Text style={styles.sectionTitle}>
                  Upload Documents (
                  {step === 3 ? "1/3" : step === 4 ? "2/3" : "3/3"})
                </Text>
                <Text style={styles.subTitle}>
                  Upload clear photos or PDFs of the required documents
                </Text>

                {errorMessage ? (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{errorMessage}</Text>
                  </View>
                ) : null}

                <View style={styles.uploadSection}>
                  {step === 3 && (
                    <>
                      {renderFileUploadBox(
                        "nonIndebtedness",
                        "Letter of Non-Indebtedness"
                      )}
                      {renderFileUploadBox("application", "Application Letter")}
                      {renderFileUploadBox("validId", "Valid ID Card")}
                    </>
                  )}
                  {step === 4 && (
                    <>
                      {renderFileUploadBox("incomeProof", "Proof of Income")}
                      {renderFileUploadBox(
                        "accountStatement",
                        "Account Statement"
                      )}
                      {renderFileUploadBox("utilityBill", "Utility Bill")}
                    </>
                  )}
                  {step === 5 && (
                    <>
                      {renderFileUploadBox(
                        "guarantorLetter",
                        "Guarantor's Letter"
                      )}
                      {renderFileUploadBox(
                        "guarantorPassport",
                        "Guarantor's Passport"
                      )}
                      {renderFileUploadBox(
                        "personalPassport",
                        "Personal Passport"
                      )}
                    </>
                  )}
                </View>

                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    loading && styles.buttonDisabled,
                  ]}
                  onPress={handleProceed}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Continue</Text>
                  )}
                </TouchableOpacity>
              </>
            )}

            {step === 6 && (
              <>
                <Text style={styles.sectionTitle}>Loan Summary</Text>

                <View style={styles.previewBox}>
                  <View style={styles.previewRow}>
                    <Text style={styles.previewLabel}>Applicant:</Text>
                    <Text style={styles.previewValue}>
                      {member?.full_name || "N/A"}
                    </Text>
                  </View>
                  <View style={styles.previewRow}>
                    <Text style={styles.previewLabel}>Loan Amount:</Text>
                    <Text style={styles.previewValue}>
                      ₦{loanAmount.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.previewRow}>
                    <Text style={styles.previewLabel}>Tenure:</Text>
                    <Text style={styles.previewValue}>{tenure} months</Text>
                  </View>
                  <View style={styles.previewRow}>
                    <Text style={styles.previewLabel}>Interest Rate:</Text>
                    <Text style={styles.previewValue}>
                      {interestRate}% p.a.
                    </Text>
                  </View>
                  <View style={styles.previewRow}>
                    <Text style={styles.previewLabel}>Total Interest:</Text>
                    <Text style={styles.previewValue}>
                      ₦{totalInterest.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.previewRow}>
                    <Text style={styles.previewLabel}>Total Payable:</Text>
                    <Text style={[styles.previewValue, styles.totalValue]}>
                      ₦{totalAmount.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.previewRow}>
                    <Text style={styles.previewLabel}>Monthly Payment:</Text>
                    <Text style={styles.previewValue}>
                      ₦{monthlyPayment.toLocaleString()}
                    </Text>
                  </View>
                </View>

                <Text style={styles.noteText}>
                  By proceeding, you agree to our terms and conditions. The loan
                  will be disbursed to your registered account.
                </Text>

                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    loading && styles.buttonDisabled,
                  ]}
                  onPress={handleProceed}
                  disabled={loading}
                >
                  <Text style={styles.primaryButtonText}>
                    {loading ? "Please wait..." : "Confirm & Submit"}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {step === 7 && (
              <>
                <Text style={styles.sectionTitle}>OTP Verification</Text>
                <Text style={styles.subTitle}>
                  Enter the 6-digit OTP sent to your registered email
                </Text>

                <View style={styles.otpContainer}>
                  <OtpInput
                    numberOfDigits={6}
                    onTextChange={setOtp}
                    placeholder="000000"
                    autoFocus={true}
                    disabled={loading}
                    type="numeric"
                    focusStickBlinkingDuration={500}
                  />
                </View>

                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    loading && styles.buttonDisabled,
                  ]}
                  onPress={handleVerifyOTP}
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Verify OTP</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.resendButton}
                  onPress={() =>
                    Alert.alert(
                      "Info",
                      "Resend OTP functionality to be implemented"
                    )
                  }
                  disabled={loading}
                >
                  <Text style={styles.resendText}>
                    Didn't receive OTP? Resend
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {step === 8 && (
              <SuccessScreen
                message={`Your loan application (Ref: ${loanReference}) has been submitted successfully and will be processed within 72 hours.`}
                onLoginPress={resetFlow}
              />
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
    minHeight: "70%",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 8,
  },
  closeButton: {
    padding: 8,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "Poppins_600SemiBold",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
    fontFamily: "Poppins_400Regular",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    fontFamily: "Poppins_600SemiBold",
    textAlign: "center",
  },
  subTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
    fontFamily: "Poppins_400Regular",
  },
  errorContainer: {
    backgroundColor: "#FFEBEE",
    borderWidth: 1,
    borderColor: "#FFCDD2",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Poppins_400Regular",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "black",
    marginBottom: 8,
    fontFamily: "Poppins_500Medium",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: "#fff",
    fontFamily: "Poppins_400Regular",
  },
  disabledInput: {
    backgroundColor: "#f5f5f5",
    color: "#888",
  },
  radioGroup: {
    flexDirection: "row",
    gap: 15,
  },
  radioButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 1,
  },
  selectedRadio: {
    borderColor: "#982323",
    backgroundColor: "#982323",
  },
  radioText: {
    color: "#333",
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Poppins_500Medium",
  },
  selectedRadioText: {
    color: "#fff",
    fontFamily: "Poppins_500Medium",
  },
  tenureOptions: {
    flexDirection: "row",
    gap: 10,
  },
  tenureButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    flex: 1,
    alignItems: "center",
  },
  selectedTenure: {
    borderColor: "#982323",
    backgroundColor: "#982323",
  },
  tenureText: {
    textAlign: "center",
    color: "#333",
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
  },
  selectedTenureText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
  },
  uploadSection: {
    marginBottom: 30,
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 15,
    minHeight: 120,
    justifyContent: "center",
  },
  uploadedBox: {
    borderColor: "#4CAF50",
    backgroundColor: "#f8fff8",
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 5,
    fontFamily: "Poppins_600SemiBold",
  },
  uploadSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontFamily: "Poppins_400Regular",
  },
  fileSizeText: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
    fontFamily: "Poppins_400Regular",
  },
  previewBox: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
  },
  previewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    alignItems: "flex-start",
  },
  previewLabel: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Poppins_400Regular",
    flex: 1,
  },
  previewValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    fontFamily: "Poppins_500Medium",
    flex: 2,
    textAlign: "right",
  },
  totalValue: {
    fontWeight: "bold",
    color: "#982323",
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
  noteText: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 20,
    fontFamily: "Poppins_400Regular",
  },
  otpContainer: {
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: "#982323",
    borderRadius: 10,
    padding: 18,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#CC9999",
    opacity: 0.7,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Poppins_600SemiBold",
  },
  resendButton: {
    alignSelf: "center",
    marginTop: 20,
    padding: 10,
  },
  resendText: {
    color: "#982323",
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    textDecorationLine: "underline",
  },
});

export default LoanEnrollmentFlow;
