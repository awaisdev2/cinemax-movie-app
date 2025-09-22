import { useAuth } from "@/contexts/AuthContext";
import { Feed, FeedAttachment } from "@/lib/types";
import dayjs from "dayjs";
import React, { useMemo } from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import RenderHTML from "react-native-render-html";
import { SvgUri } from "react-native-svg";
import WebView from "react-native-webview";

import RecentFeedLikes from "./RecentFeedLikes";

export default function FeedIndexCard({ feed }: { feed: Feed }) {
  const width = Dimensions.get("window").width;
  const { user } = useAuth();

  const formatFeedComments = useMemo(() => {
    const recentComments = feed.comments.filter((c) => dayjs(c.createdAt));
    if (recentComments.length === 0) return null;

    // find latest comment
    const latestComment = recentComments[0];
    const latestCommentDate = dayjs(latestComment.createdAt);
    const lastWatchedAt = feed.userFeedWatch?.lastWatchedAt
      ? dayjs(feed.userFeedWatch.lastWatchedAt)
      : null;

    const hasNewComment =
      !lastWatchedAt || latestCommentDate.isAfter(lastWatchedAt);

    // skip if latest comment is from current user
    if (latestComment.userId === user?.id) {
      return {
        lastCommentText: `Last comment ${latestCommentDate.format("MMM D")}`,
        hasNewComment: false,
        latestCommentDate: latestComment.createdAt,
        lastWatchedAt: lastWatchedAt?.toISOString() ?? null,
      };
    }

    return {
      lastCommentText: hasNewComment
        ? `New comment ${latestCommentDate.fromNow()}`
        : `Last comment ${latestCommentDate.format("MMM D")}`,
      hasNewComment,
      latestCommentDate: latestComment.createdAt,
      lastWatchedAt: lastWatchedAt?.toISOString() ?? null,
    };
  }, [feed, user?.id]);

  const renderFeedAttachment = () => {
    const imageAttachment = feed._attachments?.find(
      (attachment: FeedAttachment) => attachment.fileType.includes("image")
    );
    const videoAttachment = feed._attachments?.find(
      (attachment: FeedAttachment) => attachment.fileType.includes("media")
    );

    if (imageAttachment) {
      return (
        <View className="w-full h-[150px]">
          <Image
            source={{
              uri: `${process.env?.EXPO_PUBLIC_S3_BASE_URL}${imageAttachment?.signedFileName}`,
            }}
            className="h-[120px] rounded-lg object-cover object-center"
          />
        </View>
      );
    } else if (videoAttachment) {
      return (
        <View className="w-full h-[150px]">
          {/* overlay */}
          <View className="absolute top-0 left-0 w-100 h-100 z-1 pointer-event bg-black-50 opacity-8 rounded" />
          <WebView
            source={{ uri: videoAttachment?.signedFileName }}
            className="h-[150px] w-[150px] rounded-2 cursor-pointer z-0"
            javaScriptEnabled
            domStorageEnabled
            allowsFullscreenVideo
          />
        </View>
      );
    }

    return null;
  };

  const recentFeedComments = formatFeedComments;
  const hasNewFeed =
    feed.user?.id !== user?.id && !feed.userFeedWatch?.lastWatchedAt;
  return (
    <View className="bg-white shadow-sm px-4 py-3 mb-3 w-100 rounded-xl">
      <View className="flex-row items-center mb-2">
        <Image
          source={{
            uri:
              feed.user.absoluteProfilePath ||
              "https://app.govacha.com/media/avatars/blank.png",
          }}
          className="w-10 h-10 rounded-full mr-3"
        />
        <View>
          <View className="flex-row items-center w-full">
            <Text
              className={`font-semibold text-base mr-1 ${
                feed.user?.userCommunities?.[0]?.isCommunityAdmin
                  ? "w-auto"
                  : "w-full"
              }`}
            >
              {feed.user?.fullName}
            </Text>
            {feed.user?.userCommunities?.[0]?.isCommunityAdmin === true && (
              <View className="mx-1 bg-[#DBDDE5] px-2 py-1 rounded-lg">
                <Text className="text-black text-sm font-semibold">
                  Community Admin
                </Text>
              </View>
            )}
          </View>
          <Text className="text-sm text-gray-500">
            Posted {dayjs.unix(feed.createdAt).fromNow()}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center mb-1">
        {hasNewFeed && (
          <View className="inline-block bg-[#15498B] h-4 w-4 rounded-[50%] mr-1" />
        )}
        <Text className="text-xl text-black font-semibold">{feed.title}</Text>
      </View>

      {feed.description.length < 300 && (
        <RenderHTML
          contentWidth={width}
          tagsStyles={{
            p: {
              fontSize: "16px",
              color: "black",
              lineHeight: 24,
            },
          }}
          source={{ html: feed.description }}
        />
      )}
      {feed.description.length >= 300 && (
        <RenderHTML
          contentWidth={width}
          tagsStyles={{
            p: {
              fontSize: "16px",
              color: "black",
              lineHeight: 24,
            },
          }}
          source={{ html: feed.description.slice(0, 300).concat("...") }}
        />
      )}

      {renderFeedAttachment()}

      <View className="flex-row justify-between items-center border-t border-gray-100 pt-2 mt-3">
        <View className="flex-row items-center">
          <RecentFeedLikes
            likes={feed.feedLikes || []}
            feedId={feed.id}
            currentUserId={user?.id}
          />

          <View className="flex-row justify-between items-center">
            <TouchableOpacity className="flex-row items-center ml-5">
              <SvgUri
                width="22"
                height="22"
                uri="https://app.govacha.com/media/svg/general/message.svg"
              />
              <Text className="text-[16px] text-gray-500 ml-1">
                {feed.comments.length}
              </Text>
            </TouchableOpacity>
            <Text className="text-end ml-5">
              {recentFeedComments && (
                <Text
                  className={`text-end w-full ${
                    recentFeedComments.hasNewComment
                      ? "font-bold text-red-800"
                      : "font-normal text-[#807e7e]"
                  }`}
                >
                  {recentFeedComments.lastCommentText}
                </Text>
              )}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
