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
import {
  X,
  ArrowLeft,
  Upload,
  CheckCircle,
  Icon,
  Sparkle,
} from "lucide-react-native";
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

  const { balance: savingsBalance } = useSavingsBalance();
  const balance = useBalances();
  const { user } = useAuthStore();
  const { member, fetchMember} = useMemberStore();

  useEffect(() => {
    if (user?.id) {
      fetchMember(user?.id);
    }
  }, [user?.id, fetchMember]);

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
  const interestAmount = ((loanAmount * interestRate) / 100) * parseInt(tenure);
  const totalAmount = loanAmount + interestAmount;
  const monthlyPayment = totalAmount / parseInt(tenure);

  const handleFileUpload = async (fileType: keyof UploadedFiles) => {
    try {
      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

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
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setUploadedFiles((prev) => ({
          ...prev,
          [fileType]: {
            uri: asset.uri,
            name: `${fileType}_${Date.now()}.jpg`,
            type: "image/jpeg",
            size: asset.fileSize,
          },
        }));
        Alert.alert("Success", "Photo captured successfully");
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const pickImage = async (fileType: keyof UploadedFiles) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setUploadedFiles((prev) => ({
          ...prev,
          [fileType]: {
            uri: asset.uri,
            name: asset.fileName || `${fileType}_${Date.now()}.jpg`,
            type: "image/jpeg",
            size: asset.fileSize,
          },
        }));
        Alert.alert("Success", "Image selected successfully");
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to select image");
    }
  };

  const pickDocument = async (fileType: keyof UploadedFiles) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setUploadedFiles((prev) => ({
          ...prev,
          [fileType]: {
            uri: asset.uri,
            name: asset.name,
            type: asset.mimeType || "application/pdf",
            size: asset.size,
          },
        }));
        Alert.alert("Success", "Document selected successfully");
      }
    } catch (error) {
      console.error("Error picking document:", error);
      Alert.alert("Error", "Failed to select document");
    }
  };

  const validateStep1 = (): boolean => {
    return !!(servicingLoan && amount && !isNaN(loanAmount) && loanAmount > 0);
  };

  const validateStep2 = (): boolean => {
    return true;
  };

  const validateStep3 = (): boolean => {
    return !!(
      uploadedFiles.nonIndebtedness &&
      uploadedFiles.application &&
      uploadedFiles.validId
    );
  };

  const validateStep4 = (): boolean => {
    return !!(
      uploadedFiles.incomeProof &&
      uploadedFiles.accountStatement &&
      uploadedFiles.utilityBill
    );
  };

  const validateStep5 = (): boolean => {
    return !!(
      uploadedFiles.guarantorLetter &&
      uploadedFiles.guarantorPassport &&
      uploadedFiles.personalPassport
    );
  };

  const handleProceed = () => {
    let canProceed = false;
    let errorMessage = "";

    switch (step) {
      case 1:
        canProceed = validateStep1();
        errorMessage = "Please fill in all required fields and enter a valid loan amount";
        break;
      case 2:
        canProceed = validateStep2();
        break;
      case 3:
        canProceed = validateStep3();
        errorMessage = "Please upload all required documents";
        break;
      case 4:
        canProceed = validateStep4();
        errorMessage = "Please upload all required documents";
        break;
      case 5:
        canProceed = validateStep5();
        errorMessage = "Please upload all required documents";
        break;
      case 6:
        submitLoanApplication();
        return;
      default:
        canProceed = true;
    }

    if (!canProceed && step !== 2) {
      Alert.alert("Error", errorMessage);
      return;
    }
    setStep(step + 1);
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

      if (uploadedFiles.nonIndebtedness) {
        formData.append("nonIndebtedness", {
          uri: uploadedFiles.nonIndebtedness.uri,
          type: uploadedFiles.nonIndebtedness.type,
          name: uploadedFiles.nonIndebtedness.name,
        } as any);
      }

      if (uploadedFiles.application) {
        formData.append("application", {
          uri: uploadedFiles.application.uri,
          type: uploadedFiles.application.type,
          name: uploadedFiles.application.name,
        } as any);
      }

      if (uploadedFiles.validId) {
        formData.append("validId", {
          uri: uploadedFiles.validId.uri,
          type: uploadedFiles.validId.type,
          name: uploadedFiles.validId.name,
        } as any);
      }

      if (uploadedFiles.incomeProof) {
        formData.append("incomeProof", {
          uri: uploadedFiles.incomeProof.uri,
          type: uploadedFiles.incomeProof.type,
          name: uploadedFiles.incomeProof.name,
        } as any);
      }

      if (uploadedFiles.accountStatement) {
        formData.append("accountStatement", {
          uri: uploadedFiles.accountStatement.uri,
          type: uploadedFiles.accountStatement.type,
          name: uploadedFiles.accountStatement.name,
        } as any);
      }

      if (uploadedFiles.utilityBill) {
        formData.append("utilityBill", {
          uri: uploadedFiles.utilityBill.uri,
          type: uploadedFiles.utilityBill.type,
          name: uploadedFiles.utilityBill.name,
        } as any);
      }

      if (uploadedFiles.guarantorLetter) {
        formData.append("guarantorLetter", {
          uri: uploadedFiles.guarantorLetter.uri,
          type: uploadedFiles.guarantorLetter.type,
          name: uploadedFiles.guarantorLetter.name,
        } as any);
      }

      if (uploadedFiles.guarantorPassport) {
        formData.append("guarantorPassport", {
          uri: uploadedFiles.guarantorPassport.uri,
          type: uploadedFiles.guarantorPassport.type,
          name: uploadedFiles.guarantorPassport.name,
        } as any);
      }

      if (uploadedFiles.personalPassport) {
        formData.append("personalPassport", {
          uri: uploadedFiles.personalPassport.uri,
          type: uploadedFiles.personalPassport.type,
          name: uploadedFiles.personalPassport.name,
        } as any);
      }

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

      if (response.data.success) {
        setLoanId(response.data.loan.id);
        console.log("otp", response.data.otp);
        Alert.alert("Success", response.data.message);
      }
      setStep(7);
    } catch (error) {
      console.error("Error submitting loan:", error);
      let errorMessage = "Failed to submit loan application";

      if (error && typeof error === "object") {
        if ("response" in error && error.response) {
          const response = error.response as any;
          errorMessage =
            response.data?.message ||
            response.data?.error ||
            `Server error: ${response.status}`;
          console.error("Error details:", response.data);
        } else if ("message" in error && error.message) {
          errorMessage = String(error.message);
        }
      }
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 6) {
      Alert.alert("Error", "Please enter complete OTP");
      return;
    }
    setLoading(true);
    try {
      // const response = await api.post(`/api/loan/${loanId}/verify`, {
      //   otp,
      // });

      // if (response.data.success) {

      // }
      setStep(8);
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      Alert.alert("Error", error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
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
    onClose();
  };

  const tenureOptions = [
    { value: "6", label: "6 months", disabled: true },
    { value: "9", label: "9 months", disabled: true },
    { value: "12", label: "12 months", disabled: false },
    { value: "24", label: "24 months", disabled: false },
  ];

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
      >
        {isUploaded ? (
          <CheckCircle size={24} color="#982323" />
        ) : (
          <Upload size={24} color="#666" />
        )}
        <Text style={styles.uploadTitle}>{title}</Text>
        <Text style={styles.uploadSubtitle}>
          {isUploaded ? file.name : "Tap to upload"}
        </Text>
        {isUploaded && file.size && (
          <Text>{(file.size / 1024 / 1024).toFixed(2)} MB</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            {step !== 8 && (
              <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <ArrowLeft size={24} color="#333" />
              </TouchableOpacity>
            )}
            {step !== 8 && (
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color="#333" />
              </TouchableOpacity>
            )}
          </View>

          {step === 1 && (
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <Text style={styles.sectionTitle}>Loan Application Form</Text>

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
                  onChangeText={setAmount}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Savings Balance (₦)</Text>
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value={`₦${balance?.savings_balance || 0}`}
                  editable={false}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Loan Balance (₦)</Text>
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value={`₦${balance?.savings_balance || 0}`}
                  editable={false}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Tenure (months)</Text>
                <View style={styles.tenureOptions}>
                  {tenureOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.tenureButton,
                        tenure === option.value && styles.selectedTenure,
                        option.disabled && styles.disabledTenure,
                      ]}
                      onPress={() =>
                        !option.disabled && setTenure(option.value)
                      }
                      disabled={option.disabled}
                    >
                      <Text
                        style={[
                          tenure === option.value
                            ? styles.selectedTenureText
                            : styles.tenureText,
                          option.disabled && styles.disabledTenureText,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Bank Name *</Text>
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value={member?.bank[0]?.bank_name || ""}
                  editable={false}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Account Number *</Text>
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value={member?.bank?.[0]?.account_number || ""}
                  editable={false}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Account Name *</Text>
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value={member?.bank?.[0]?.account_name || ""}
                  editable={false}
                />
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleProceed}
              >
                <Text style={styles.primaryButtonText}>Proceed</Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          {step === 2 && (
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              <Text style={styles.subTitle}>
                Review your personal details before proceeding
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
                    {member?.address || "N/A"}
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
            </ScrollView>
          )}

          {/* Step 3: Document Upload - Page 1 */}
          {step === 3 && (
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <Text style={styles.sectionTitle}>Upload Documents (1/3)</Text>
              <Text style={styles.subTitle}>
                Upload clear photos or PDFs of the required documents
              </Text>

              <View style={styles.uploadSection}>
                {renderFileUploadBox(
                  "nonIndebtedness",
                  "Letter of Non-Indebtedness"
                )}
                {renderFileUploadBox("application", "Self Written Application")}
                {renderFileUploadBox("validId", "Valid ID Card")}
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
            </ScrollView>
          )}

          {/* Step 4: Document Upload - Page 2 */}
          {step === 4 && (
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <Text style={styles.sectionTitle}>Upload Documents (2/3)</Text>
              <Text style={styles.subTitle}>
                Upload clear photos or PDFs of the required documents
              </Text>

              <View style={styles.uploadSection}>
                {renderFileUploadBox("incomeProof", "Proof of Income")}
                {renderFileUploadBox("accountStatement", "Account Statement")}
                {renderFileUploadBox("utilityBill", "Utility Bill")}
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
            </ScrollView>
          )}

          {/* Step 5: Document Upload - Page 3 */}
          {step === 5 && (
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <Text style={styles.sectionTitle}>Upload Documents (3/3)</Text>
              <Text style={styles.subTitle}>
                Upload clear photos or PDFs of the required documents
              </Text>

              <View style={styles.uploadSection}>
                {renderFileUploadBox("guarantorLetter", "Guarantor's Letter")}
                {renderFileUploadBox(
                  "guarantorPassport",
                  "Guarantor's Passport"
                )}
                {renderFileUploadBox("personalPassport", "Personal Passport")}
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
            </ScrollView>
          )}

          {/* Step 6: Loan Summary */}
          {step === 6 && (
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <Text style={styles.sectionTitle}>Loan Summary</Text>

              <View style={styles.previewBox}>
                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>Applicant:</Text>
                  <Text style={styles.previewValue}>
                    {member?.full_name}
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
                  <Text style={styles.previewValue}>{interestRate}%</Text>
                </View>
                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>Total Interest:</Text>
                  <Text style={styles.previewValue}>
                    ₦{interestAmount.toLocaleString()}
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
                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>Bank Details:</Text>
                  <Text style={styles.previewValue}>
                    {member?.bank[0].bank_name} -{" "}
                    {member?.bank[0].account_number}
                  </Text>
                </View>
              </View>

              <Text style={styles.noteText}>
                By proceeding, you agree to our terms and conditions. The loan
                will be disbursed to your registered account.
              </Text>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleProceed}
                disabled={loading}
              >
                <Text style={styles.primaryButtonText}>
                  {loading ? "Please wait..." : "Confirm & Proceed"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          {step === 7 && (
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <Text style={styles.sectionTitle}>OTP Verification</Text>
              <Text style={styles.subTitle}>
                Enter the 6-digit OTP sent to your phone number
              </Text>

              <View style={styles.otpContainer}>
                <OtpInput
                  numberOfDigits={6}
                  onTextChange={setOtp}
                  placeholder="******"
                  blurOnFilled={true}
                  disabled={loading}
                  type="numeric"
                  focusStickBlinkingDuration={500}
                />
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleVerifyOTP}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryButtonText}>Verify OTP</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          )}

          {step === 8 && (
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <SuccessScreen
                message="Dear Customer, Your loan request will be disbursed in 72 hours"
                onLoginPress={resetFlow}
                backgroundImage={undefined}
              />
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

// ... styles remain the same ...
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
    padding: 5,
  },
  closeButton: {
    padding: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    fontFamily: "Poppins_400Regular",
  },
  sectionSubTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 20,
    marginBottom: 15,
    fontFamily: "Poppins_400Regular",
  },
  subTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
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
    fontFamily: "Poppins_400Regular",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
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
  },
  selectedRadio: {
    borderColor: "#982323",
    backgroundColor: "#982323",
  },
  radioText: {
    color: "#333",
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
  },
  selectedRadioText: {
    color: "#fff",
    fontFamily: "Poppins_400Regular",
  },
  signatureContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  signatureText: {
    fontSize: 16,
    color: "#333",
    fontStyle: "italic",
    fontFamily: "Poppins_400Regular",
  },
  changeSignatureButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  changeSignatureText: {
    color: "#6A7814",
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Poppins_400Regular",
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
    minHeight: 100,
    justifyContent: "center",
  },
  uploadedBox: {
    borderColor: "#4CAF50",
    backgroundColor: "#f8fff8",
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 5,
    fontFamily: "Poppins_400Regular",
  },
  uploadSubtitle: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    fontFamily: "Poppins_400Regular",
  },
  tenureOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tenureButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    minWidth: 100,
    alignItems: "center",
  },
  selectedTenure: {
    borderColor: "#982323",
    backgroundColor: "#982323",
  },
  disabledTenure: {
    borderColor: "#e0e0e0",
    backgroundColor: "#f5f5f5",
    opacity: 0.6,
  },
  tenureText: {
    textAlign: "center",
    color: "#333",
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
  },
  selectedTenureText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
  },
  disabledTenureText: {
    textAlign: "center",
    color: "#999",
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
  },
  previewBox: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  previewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  previewLabel: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Poppins_400Regular",
  },
  previewValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    fontFamily: "Poppins_400Regular",
  },
  totalValue: {
    fontWeight: "bold",
    color: "#982323",
    fontFamily: "Poppins_400Regular",
  },
  noteText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 18,
    fontFamily: "Poppins_400Regular",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 20,
    fontFamily: "Poppins_400Regular",
  },
  resendButton: {
    alignSelf: "center",
    marginBottom: 30,
  },
  resendText: {
    color: "#982323",
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
  },
  primaryButton: {
    backgroundColor: "#982323",
    borderRadius: 8,
    padding: 18,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Poppins_400Regular",
  },
  successContent: {
    padding: 30,
    alignItems: "center",
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    fontFamily: "Poppins_400Regular",
  },
  successMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 20,
    fontFamily: "Poppins_400Regular",
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  successText: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
  },
  messageText: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default LoanEnrollmentFlow;