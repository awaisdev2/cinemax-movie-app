import EditorIndex from "@/lib/common/EditorIndex";
import {
  Category,
  FeedAttachment,
  FeedFormProps,
  FeedFormValues,
} from "@/lib/types/feeds.type";
import {
  useCreateFeed,
  useGetCategories,
  useUpdateFeed,
} from "@/queries/feeds";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";
import FeedAttachments from "./FeedAttachments";

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
});

const FeedForm: React.FC<FeedFormProps> = ({
  feed,
  setShowCreateFeedModal,
  feedType,
  user,
}) => {
  const createFeedMutation = useCreateFeed();
  const updateFeedMutation = useUpdateFeed();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [attachments, setAttachments] = useState<FeedAttachment[]>(
    feed?._attachments || []
  );
  const categoriesResult = useGetCategories();
  const categories: Category[] = categoriesResult?.data?.categories || [];

  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(
    feed?.categoryId || categories?.[0]?.id
  );

  const navigation = useNavigation();

  const initialValues = {
    title: feed?.title || "",
    description: feed?.description || "",
  };

  const onFileUpload = (result: FeedAttachment) => {
    setAttachments([...attachments, result]);
  };

  const handleDeleteFile = (index: number) => {
    const updatedAttachments = [...attachments];
    updatedAttachments.splice(index, 1);
    setAttachments(updatedAttachments);
  };

  const handleOnSubmit = async (values: FeedFormValues, { resetForm }: any) => {
    try {
      setIsLoading(true);
      const trimmedTitle = values.title.trim();
      if (feed?.id) {
        await updateFeedMutation.mutateAsync({
          feedId: feed.id,
          feedData: {
            title: trimmedTitle,
            description: values.description,
            attachments,
            categoryId: selectedCategoryId,
          },
        });
      } else {
        await createFeedMutation.mutateAsync({
          title: trimmedTitle,
          description: values.description,
          feedType,
          attachments,
          categoryId: selectedCategoryId,
        });
      }
      resetForm();
      setShowCreateFeedModal(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleOnSubmit}
      >
        {({ errors, touched, handleChange, handleSubmit, values }) => (
          <View className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
              <Image
                source={{
                  uri:
                    user?.absoluteProfilePath ??
                    "https://app.govacha.com/media/avatars/blank.png",
                }}
                className="w-10 h-10 rounded-full mr-3"
              />
              <View className="flex-1">
                <View>
                  <Text className="font-semibold text-base">
                    {user?.firstName} {user?.lastName}
                  </Text>
                  <Text className="text-sm text-gray-500">posting feed...</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setShowCreateFeedModal(false)}
                className="p-2"
              >
                <Text className="text-xl text-gray-500">✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 p-4">
              {/* Title */}
              <View className="mb-6">
                <TextInput
                  placeholder="Add a title"
                  placeholderTextColor="#9CA3AF"
                  value={values.title}
                  onChangeText={handleChange("title")}
                  className="px-4 py-3 text-lg font-semibold text-gray-900 rounded-lg"
                />
                {errors.title && touched.title && (
                  <Text className="text-red-500 mt-2 ml-1">{errors.title}</Text>
                )}
              </View>

              {/* Description / Editor */}
              <View>
                <View className="rounded-lg overflow-hidden h-[300px]">
                  <EditorIndex
                    value={values.description}
                    name="description"
                    handleChange={handleChange}
                    initialValue={initialValues.description}
                    resourceType="feeds"
                    isUploading={isUploading}
                    setIsUploading={setIsUploading}
                    onFileUpload={onFileUpload}
                  />
                </View>

                <FeedAttachments
                  handleDeleteFile={handleDeleteFile}
                  isUploading={isUploading}
                  attachments={attachments}
                />

                {errors.description && touched.description && (
                  <Text className="text-red-500 mt-2 ml-1">
                    {errors.description}
                  </Text>
                )}
              </View>

              {/* Category Picker */}
              <View className="mb-6">
                <View className="rounded-lg overflow-hidden bg-gray-50">
                  <Picker
                    selectedValue={selectedCategoryId}
                    onValueChange={(itemValue) =>
                      setSelectedCategoryId(Number(itemValue))
                    }
                  >
                    {categories.map((category: Category) => (
                      <Picker.Item
                        key={category.id}
                        label={category.name}
                        value={category.id}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            </ScrollView>

            {/* Footer with buttons */}
            <View className="flex-row justify-end items-center p-4 border-t border-gray-200 bg-white">
              <TouchableOpacity
                disabled={isUploading}
                onPress={() => {
                  const hasUnsavedChanges = Object.keys(initialValues).some(
                    (fieldName) =>
                      // @ts-ignore
                      initialValues[fieldName] !== values[fieldName]
                  );

                  if (attachments.length > 0 || hasUnsavedChanges) {
                    Alert.alert(
                      "Discard Changes?",
                      "You haven't finished your post yet. Do you want to leave without finishing?",
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Discard",
                          style: "destructive",
                          onPress: () => setShowCreateFeedModal(false),
                        },
                      ]
                    );
                  } else if (setShowCreateFeedModal) {
                    setShowCreateFeedModal(false);
                  } else {
                    navigation.navigate("FeedsPublic" as never);
                  }
                }}
                className="px-5 py-3 rounded-lg bg-gray-200 mr-2"
              >
                <Text className="text-gray-600 font-medium">Discard</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSubmit as any}
                disabled={
                  isLoading ||
                  isUploading ||
                  values.title.trim() === "" ||
                  values.description === ""
                }
                className="px-5 py-3 rounded-lg bg-blue-600 disabled:bg-blue-300"
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-semibold">Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
};

export default FeedForm;
