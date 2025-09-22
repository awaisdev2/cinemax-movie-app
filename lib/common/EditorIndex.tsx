import React, { useRef, useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";
import EmojiPicker from "rn-emoji-keyboard";
import FileUploader from "../common/FileUploader";

interface EditorProps {
  resourceType: string;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
  isUploading?: boolean;
  onFileUpload: (result: any) => void;
  initialValue?: string;
  name?: string;
  handleChange?: (e: any) => void;
  value?: string;
}

const EditorIndex: React.FC<EditorProps> = ({
  resourceType,
  setIsUploading,
  isUploading = false,
  onFileUpload,
  initialValue = "",
  name = "description",
  handleChange,
  value,
}) => {
  const richText = useRef<RichEditor>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showFileUploader, setShowFileUploader] = useState(false);

  // Handle text changes
  const handleEditorChange = (content: string) => {
    handleChange?.({ target: { name, value: content } });
  };

  // Insert emoji
  const onEmojiSelect = (emojiObject: { emoji: string }) => {
    richText.current?.insertText(emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  // Insert link
  const onLinkInsert = (url: string) => {
    richText.current?.insertLink(url, url);
    setShowLinkModal(false);
  };

  // Insert video
  const onVideoInsert = (url: string) => {
    onFileUpload({
      fileType: "media",
      originalFileName: url,
      signedFileName: url,
    });
    setShowVideoModal(false);
  };

  // Handle file upload completion
  const handleFileUploadComplete = (result: any) => {
    onFileUpload(result);
    setShowFileUploader(false);
  };

  return (
    <View className="flex-1">
      {/* Rich Editor */}
      <RichEditor
        ref={richText}
        initialContentHTML={initialValue}
        placeholder="Write something..."
        style={{
          minHeight: 200,
        }}
        onChange={handleEditorChange}
      />

      {/* Rich Toolbar */}
      <View>
        <RichToolbar
          editor={richText}
          actions={[
            actions.setBold,
            actions.setItalic,
            actions.insertBulletsList,
            actions.insertOrderedList,
            actions.insertLink,
            "emoji",
            "fileUpload",
            "videoUpload",
          ]}
          iconMap={{
            emoji: () => <Text className="text-xl">😊</Text>,
            fileUpload: () => (
              <FileUploader
                resourceType={resourceType}
                setIsUploading={setIsUploading}
                isUploading={isUploading}
                onFileUpload={handleFileUploadComplete}
                btn={<Text className="text-xl">📎</Text>}
              />
            ),
            videoUpload: () => <Text className="text-xl">🎥</Text>,
          }}
          onPress={(action: string) => {
            if (action === "emoji") setShowEmojiPicker(true);
            if (action === "fileUpload") setShowFileUploader(true);
            if (action === "videoUpload") setShowVideoModal(true);
          }}
        />
        
        {/* Inline File Uploader (appears below toolbar when activated) */}
        {showFileUploader && (
          <View className="bg-gray-100 p-3 border-t border-gray-200">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Upload a file
            </Text>
            <FileUploader
              resourceType={resourceType}
              setIsUploading={setIsUploading}
              isUploading={isUploading}
              onFileUpload={handleFileUploadComplete}
            />
          </View>
        )}
      </View>

      {/* Emoji Picker */}
      <EmojiPicker
        onEmojiSelected={onEmojiSelect}
        open={showEmojiPicker}
        onClose={() => setShowEmojiPicker(false)}
      />

      {/* Link Modal */}
      {showLinkModal && (
        <Modal visible={showLinkModal} transparent animationType="slide">
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white p-6 rounded-lg w-5/6 max-w-md">
              <Text className="text-lg font-semibold mb-4 text-gray-800">
                Insert Link
              </Text>
              <TouchableOpacity
                onPress={() => onLinkInsert("https://example.com")}
                className="p-3 bg-blue-500 rounded-lg mb-3"
              >
                <Text className="text-white text-center font-medium">
                  Insert Example Link
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowLinkModal(false)}
                className="p-3 bg-gray-200 rounded-lg"
              >
                <Text className="text-gray-700 text-center">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Video Modal */}
      {showVideoModal && (
        <Modal visible={showVideoModal} transparent animationType="slide">
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white p-6 rounded-lg w-5/6 max-w-md">
              <Text className="text-lg font-semibold mb-4 text-gray-800">
                Insert Video URL
              </Text>
              <TouchableOpacity
                onPress={() =>
                  onVideoInsert("https://youtube.com/embed/videoid")
                }
                className="p-3 bg-blue-500 rounded-lg mb-3"
              >
                <Text className="text-white text-center font-medium">
                  Insert Example Video
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowVideoModal(false)}
                className="p-3 bg-gray-200 rounded-lg"
              >
                <Text className="text-gray-700 text-center">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default EditorIndex;