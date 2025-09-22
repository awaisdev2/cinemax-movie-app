import { useAuth } from "@/contexts/AuthContext";
import Entypo from "@expo/vector-icons/Entypo";
import * as DocumentPicker from "expo-document-picker";
import React from "react";
import { ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import apiClient from "../api/client";

interface FileUploaderProps {
  resourceType: string;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
  isUploading: boolean;
  onFileUpload: (result: any) => void;
  btn?: React.ReactNode;
  acceptFileType?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  resourceType,
  setIsUploading,
  isUploading,
  onFileUpload,
  btn,
}) => {
  const { selectedCommunity } = useAuth();

  const handleUpload = async () => {
    if (isUploading) return;

    try {
      setIsUploading(true);

      const result: any = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });
      console.log("$$", result);

      // Create FormData with proper structure
      const formData = new FormData();

      // For React Native, we need to append the file with specific formatting
      formData.append("file", {
        uri: result.assets[0].uri,
        originalname: result.assets[0].name,
        mimetype: result.assets[0].mimeType,
      });
      formData.append("resourceType", resourceType);

      const response = await apiClient.post(
        `/c/${selectedCommunity?.uuid}/resources/upload-file`,
        formData
      );

      const uploadedFile = response.data?.data;
      onFileUpload(uploadedFile);
    } catch (error: any) {
      console.error("Error uploading file:", error);

      // Show user-friendly error message
      let errorMessage = "Failed to upload file";
      if (error.code === "ENOENT" || error.message.includes("no such file")) {
        errorMessage =
          "The selected file could not be found. Please try again.";
      } else if (error.response) {
        errorMessage = `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }

      Alert.alert("Upload Error", errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <TouchableOpacity onPress={handleUpload} disabled={isUploading}>
      {btn ? (
        btn
      ) : isUploading ? (
        <ActivityIndicator size="small" color="#000" />
      ) : (
        <Entypo name="link" size={20} color="black" />
      )}
    </TouchableOpacity>
  );
};

export default FileUploader;
