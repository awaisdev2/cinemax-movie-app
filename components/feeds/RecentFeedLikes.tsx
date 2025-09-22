import { FeedLike, RecentFeedLikesProps } from "@/lib/types/feeds.type";
import { useLikeFeedComment } from "@/queries/feedComments";
import { useAddFeedLike } from "@/queries/feeds";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SvgUri } from "react-native-svg";

const RecentFeedLikes: React.FC<RecentFeedLikesProps> = ({
  likes,
  feedId,
  currentUserId,
  commentId,
}) => {
  const hasCurrentUserLiked = likes?.find(
    (like: FeedLike) => like.userId === currentUserId
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutateAsync: postNewFeedLike } = useAddFeedLike();
  const { mutateAsync: postCommentLike } = useLikeFeedComment();

  const handleLikeClick = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      if (commentId) {
        await postCommentLike({ feedId, commentId });
      } else {
        await postNewFeedLike(feedId);
      }

      setTimeout(() => {
        setIsSubmitting(false);
      }, 500);
    } catch (err) {
      console.error(err, "An error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-row items-center">
      <TouchableOpacity
        disabled={isSubmitting}
        onPress={handleLikeClick}
        className="mr-2 flex-row"
      >
        <SvgUri
          width="22"
          height="22"
          uri={
            hasCurrentUserLiked
              ? "https://app.govacha.com/media/svg/general/highlighted-thumb.svg"
              : "https://app.govacha.com/media/svg/general/like.svg"
          }
        />
        <Text className="text-[16px] text-gray-500 ml-1">{likes.length}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RecentFeedLikes;
