import { FeedAttachment, FeedAttachmentProps } from "@/lib/types/feeds.type";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import PreviewAttachments from "./PreviewAttachments";

const FeedAttachments: React.FC<FeedAttachmentProps> = ({
  isUploading,
  attachments,
  handleDeleteFile,
  hideDeleteIcon = true,
  template = 2,
}) => {
  const [selectedAttachmentIndex, setSelectedAttachmentIndex] = useState<
    number | null
  >(null);
  const [showAttachmentModal, setShowAttachmentModal] =
    useState<boolean>(false);

  const handleAttachmentClick = (attachmentIndex: number) => {
    setSelectedAttachmentIndex(attachmentIndex);
    setShowAttachmentModal(true);
  };

  const handleModalClose = () => {
    setShowAttachmentModal(false);
  };

  const renderFeedAttachment = (attachment: FeedAttachment) => {
    const imageUrl = attachment.signedFileName;
    const sliceLength = hideDeleteIcon ? 20 : 30;

    switch (attachment.fileType) {
      case "application/pdf":
        return (
          <View className="flex-row items-center bg-gray-100 rounded-md p-2 w-[150px] h-[55px]">
            <MaterialCommunityIcons name="file-pdf-box" size={24} color="red" />
            <Text numberOfLines={1} className="text-xs text-black flex-1 ml-2">
              {attachment.originalFileName?.length > sliceLength
                ? attachment.originalFileName?.slice(0, sliceLength) + "..."
                : attachment.originalFileName}
            </Text>
          </View>
        );

      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        return (
          <View className="flex-row items-center bg-gray-100 rounded-md p-2 w-[150px] h-[55px]">
            <FontAwesome name="file-excel-o" size={24} color="black" />
            <Text numberOfLines={1} className="text-xs text-black flex-1">
              {attachment.originalFileName?.length > sliceLength
                ? attachment.originalFileName?.slice(0, sliceLength) + "..."
                : attachment.originalFileName}
            </Text>
          </View>
        );

      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return (
          <View className="flex-row items-center bg-gray-100 rounded-md p-2 w-[150px] h-[55px]">
            <Ionicons name="document-text-outline" size={24} color="black" />
            <Text numberOfLines={1} className="text-xs text-black flex-1">
              {attachment.originalFileName?.length > sliceLength
                ? attachment.originalFileName?.slice(0, sliceLength) + "..."
                : attachment.originalFileName}
            </Text>
          </View>
        );

      case "image/jpeg":
      case "image/png":
      case "image/jpg":
        return (
          <Image
            source={{ uri: imageUrl }}
            className={`${
              hideDeleteIcon ? "h-[55px] w-[150px]" : "h-[100px] w-[150px]"
            } rounded-md`}
            resizeMode="cover"
          />
        );

      default:
        return null;
    }
  };

  return (
    <View className="w-full">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row"
      >
        {attachments?.map((attachment, index) => (
          <View key={index} className="m-2">
            {/* Delete Button */}
            {!hideDeleteIcon && (
              <TouchableOpacity
                className="absolute top-0 right-0 bg-red-500 rounded-full p-1 z-10"
                onPress={() => handleDeleteFile?.(index)}
              >
                <Text className="text-white text-xs">✕</Text>
              </TouchableOpacity>
            )}

            {/* Attachment */}
            <TouchableOpacity onPress={() => handleAttachmentClick(index)}>
              {renderFeedAttachment(attachment)}
            </TouchableOpacity>

            {/* Preview Modal */}
            {showAttachmentModal && selectedAttachmentIndex === index && (
              <PreviewAttachments
                selectedAttachmentIndex={selectedAttachmentIndex}
                setSelectedAttachmentIndex={setSelectedAttachmentIndex}
                attachments={attachments}
                handleModalClose={handleModalClose}
              />
            )}
          </View>
        ))}

        {/* Uploading Loader */}
        {isUploading && (
          <View className="h-[55px] w-[90px] bg-gray-200 rounded-md flex items-center justify-center mx-5 mt-9">
            <ActivityIndicator size="small" color="#000" />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default FeedAttachments;
