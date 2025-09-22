import FeedForm from "@/components/feeds/FeedForm";
import { useGetFeeds } from "@/queries/feeds";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FeedIndexCard from "../../components/feeds/FeedIndexCard";
import { useAuth } from "../../contexts/AuthContext";

export default function FeedsScreen() {
  const { user } = useAuth();
  const [showCreateFeedModal, setShowCreateFeedModal] = useState(false);

  const { data: feedsData, isLoading } = useGetFeeds({
    type: "public",
  });

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-gray-500">Loading feeds...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100 pt-12 pb-2">
      <ScrollView className="py-4">
        <View className="d-flex justify-content-center mx-4">
          <View className="bg-white shadow-sm flex-row items-center px-4 py-3 mb-3 w-100 rounded-xl cursor-pointer">
            <Image
              source={{ uri: user?.absoluteProfilePath }}
              className="w-12 h-12 rounded-full"
            />
            <TouchableOpacity
              onPress={() => setShowCreateFeedModal(true)}
              className="p-2 rounded-xl"
            >
              <View className="border-0 mx-5 mt-1 w-full">
                <Text className="font-semibold text-base text-[#807E7E]">
                  What&apos;s on your mind?
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-4">
          {feedsData?.feeds?.length > 0 ? (
            feedsData?.feeds?.map((feed: any) => (
              <FeedIndexCard key={feed.id} feed={feed} />
            ))
          ) : (
            <View className="bg-white p-4 rounded-xl items-center">
              <Text className="text-gray-500">No feeds available</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={showCreateFeedModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowCreateFeedModal(false)}
      >
        <FeedForm
          user={user}
          setShowCreateFeedModal={setShowCreateFeedModal}
          feedType={"public"}
        />
      </Modal>
    </View>
  );
}
