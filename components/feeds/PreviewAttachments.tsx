import { FeedAttachment, PreviewAttachmentsProps } from '@/lib/types/feeds.type'
import React from 'react'
import { Alert, Dimensions, Image, Modal, Text, TouchableOpacity, View } from 'react-native'
import { WebView } from 'react-native-webview'

const { width, height } = Dimensions.get('window')

const PreviewAttachments: React.FC<PreviewAttachmentsProps> = ({
  attachments,
  selectedAttachmentIndex,
  setSelectedAttachmentIndex,
  handleModalClose,
}) => {
  const selectedAttachment: FeedAttachment | null =
    selectedAttachmentIndex !== null ? attachments[selectedAttachmentIndex] : null

  if (!selectedAttachment) {
    return null
  }

  const attachmentUrl = selectedAttachment.signedFileName

  const onClickNext = () => {
    if (
      selectedAttachmentIndex !== null &&
      selectedAttachmentIndex < attachments.length - 1
    ) {
      setSelectedAttachmentIndex(selectedAttachmentIndex + 1)
    }
  }

  const onClickPrevious = () => {
    if (selectedAttachmentIndex !== null && selectedAttachmentIndex > 0) {
      setSelectedAttachmentIndex(selectedAttachmentIndex - 1)
    }
  }

  const hasUnsupportedFormat = (): boolean => {
    if (!selectedAttachment || !selectedAttachment.fileType) return true
    const supportedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'media']
    return !supportedTypes.includes(selectedAttachment.fileType)
  }

  const downloadAttachment = () => {
    Alert.alert(
      'Download',
      `Downloading ${selectedAttachment.originalFileName}...`,
      [{ text: 'OK' }],
    )
    // 👉 Implement with expo-file-system or react-native-fs here
  }

  return (
    <Modal visible transparent animationType="fade" onRequestClose={handleModalClose}>
      <View className="flex-1 bg-black/90">
        {/* Header */}
        <View className="flex-row justify-between items-center px-4 py-3">
          <Text className="text-white text-lg flex-1" numberOfLines={1}>
            {selectedAttachment.originalFileName}
          </Text>

          {/* Download button for images */}
          {selectedAttachment?.fileType?.startsWith('image/') && (
            <TouchableOpacity
              onPress={downloadAttachment}
              className="bg-white rounded-full p-2 mx-2"
            >
              <Text className="text-black">⬇</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handleModalClose}
            className="bg-white rounded-full p-2"
          >
            <Text className="text-black font-bold">✕</Text>
          </TouchableOpacity>
        </View>

        {/* Body */}
        <View className="flex-1 justify-center items-center">
          {selectedAttachment.fileType.startsWith('image/') && (
            <Image
              source={{ uri: attachmentUrl }}
              style={{ width: width * 0.9, height: height * 0.7 }}
              resizeMode="contain"
            />
          )}

          {(selectedAttachment.fileType.startsWith('application/pdf') ||
            selectedAttachment.fileType === 'media') && (
            <WebView
              source={{
                uri:
                  selectedAttachment.fileType === 'media'
                    ? selectedAttachment.signedFileName
                    : attachmentUrl,
              }}
              style={{ width: width * 0.9, height: height * 0.7 }}
            />
          )}

          {hasUnsupportedFormat() && (
            <View className="bg-white p-6 rounded-lg items-center">
              <Text className="text-lg font-bold mb-4">No preview available</Text>
              <Text className="mb-4 text-gray-700">
                for {selectedAttachment.originalFileName}
              </Text>
              <TouchableOpacity
                onPress={downloadAttachment}
                className="bg-blue-600 px-4 py-2 rounded-lg"
              >
                <Text className="text-white font-semibold">Download</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Navigation Arrows */}
        <View className="absolute inset-x-0 top-1/2 flex-row justify-between px-4">
          <TouchableOpacity
            disabled={selectedAttachmentIndex === 0}
            onPress={onClickPrevious}
            className={`bg-white rounded-full p-3 ${
              selectedAttachmentIndex === 0 ? 'opacity-30' : ''
            }`}
          >
            <Text className="text-black">{'‹'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={selectedAttachmentIndex === attachments.length - 1}
            onPress={onClickNext}
            className={`bg-white rounded-full p-3 ${
              selectedAttachmentIndex === attachments.length - 1 ? 'opacity-30' : ''
            }`}
          >
            <Text className="text-black">{'›'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

export default PreviewAttachments
