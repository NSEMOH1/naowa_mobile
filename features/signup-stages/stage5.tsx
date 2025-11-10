import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { Upload, FileText, X, ChevronLeft } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";

interface Document {
  uri: string;
  name: string;
  type?: string;
}

interface Stage5Props {
  profilePicture: Document | null;
  setProfilePicture: (doc: Document | null) => void;
  ninDocument: Document | null;
  setNinDocument: (doc: Document | null) => void;
  prevStep: () => void;
}

const Stage5Documents: React.FC<Stage5Props> = ({
  profilePicture,
  setProfilePicture,
  ninDocument,
  setNinDocument,
  prevStep,
}) => {

  const pickProfilePicture = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setProfilePicture({
          uri: asset.uri,
          name: asset.fileName || `profile_${Date.now()}.jpg`,
          type: asset.mimeType || "image/jpeg",
        });
        Alert.alert("Success", "Profile picture selected");
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const pickDocument = async (setDocumentFunction: (doc: Document | null) => void) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        setDocumentFunction({
          uri: asset.uri,
          name: asset.name || `document_${Date.now()}`,
          type: asset.mimeType || "application/pdf",
        });
        Alert.alert("Success", "Document selected");
      }
    } catch (error) {
      console.error("Error picking document:", error);
      Alert.alert("Error", "Failed to pick document");
    }
  };

  const removeDocument = (setDocumentFunction: (doc: Document | null) => void) => {
    setDocumentFunction(null);
  };

  const renderDocumentPreview = (
    document: Document | null,
    setDocumentFunction: (doc: Document | null) => void
  ) => {
    if (!document) return null;

    const isImage =
      document.name?.match(/\.(jpg|jpeg|png|gif)$/i) ||
      document.type?.startsWith("image/");

    return (
      <View style={styles.previewContainer}>
        <View style={styles.preview}>
          {isImage ? (
            <Image
              source={{ uri: document.uri }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          ) : (
            <FileText size={24} color="#666" />
          )}
          <Text style={styles.previewText} numberOfLines={1}>
            {document.name}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeDocument(setDocumentFunction)}
        >
          <X size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View>
      <View style={styles.headerWithBack}>
        <TouchableOpacity onPress={prevStep} style={styles.backButton}>
          <ChevronLeft size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Upload Documents</Text>
      </View>
      <Text style={styles.subtitle}>
        Please upload your profile picture and NIN document
      </Text>

      <View style={styles.uploadSection}>
        <Text style={styles.uploadLabel}>Profile Picture *</Text>
        {renderDocumentPreview(profilePicture, setProfilePicture)}
        {!profilePicture && (
          <TouchableOpacity
            style={styles.uploadBox}
            onPress={pickProfilePicture}
          >
            <Upload size={24} color="#666" />
            <Text style={styles.uploadText}>
              Tap to select profile picture
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.uploadSection}>
        <Text style={styles.uploadLabel}>NIN Document *</Text>
        {renderDocumentPreview(ninDocument, setNinDocument)}
        {!ninDocument && (
          <TouchableOpacity
            style={styles.uploadBox}
            onPress={() => pickDocument(setNinDocument)}
          >
            <Upload size={24} color="#666" />
            <Text style={styles.uploadText}>
              Tap to select NIN document
            </Text>
          </TouchableOpacity>
        )}
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
  uploadSection: {
    marginBottom: 15,
  },
  uploadLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
    fontFamily: "Poppins_400Regular",
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: "#000",
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
  },
  uploadText: {
    marginTop: 8,
    color: "#666",
    fontSize: 12,
    textAlign: "center",
  },
  previewContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 8,
  },
  preview: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  previewImage: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 4,
  },
  previewText: {
    flex: 1,
    fontSize: 12,
    color: "#666",
    fontFamily: "Poppins_400Regular",
  },
  removeButton: {
    backgroundColor: "#ff4444",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
});

export default Stage5Documents;