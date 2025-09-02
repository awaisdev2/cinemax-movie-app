import { useIsFocused } from "@react-navigation/native";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

export default function Index() {
  const isFocused = useIsFocused();

  // A key that changes every time the screen is focused
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (isFocused) {
      setKey((prev) => prev + 1);
    }
  }, [isFocused]);

  return (
    <View className="flex-1 bg-gray-900 pt-10">
      <ScrollView className="px-4">
        {/* Hero Section */}
        <View className="items-center my-10">
          <Animated.View
            key={`logo-${key}`}
            entering={FadeInUp.delay(300).duration(800)}
            className="w-36 h-36 bg-purple-600 rounded-full flex items-center justify-center mb-3"
          >
            <Image
              source={require("../../assets/images/logo.png")}
              className="w-full h-full object-cover"
            />
          </Animated.View>

          <Animated.Text
            key={`title-${key}`}
            entering={FadeInUp.delay(300).duration(800)}
            className="text-4xl font-bold text-white text-center mb-2"
          >
            CineMax
          </Animated.Text>

          <Animated.Text
            key={`subtitle-${key}`}
            entering={FadeInUp.delay(600).duration(800)}
            className="text-lg text-gray-300 text-center"
          >
            Your Ultimate Movie Experience
          </Animated.Text>
        </View>

        {/* Browse Movies Section */}
        <Animated.View
          key={`browse-${key}`}
          entering={FadeInUp.delay(900).duration(800)}
          className="mb-10"
        >
          <Text className="text-2xl font-bold text-white mb-4 text-center">
            Browse Movies
          </Text>
          <Text className="text-gray-400 text-center mb-6 px-4">
            Discover thousands of movies from all genres. Find your next
            favorite film with our curated collections.
          </Text>
        </Animated.View>

        {/* App Description */}
        <Animated.View
          key={`about-${key}`}
          entering={FadeInUp.delay(1200).duration(800)}
          className="bg-gray-800 p-6 rounded-xl mb-10"
        >
          <Text className="text-xl font-bold text-white mb-3 text-center">
            About Our App
          </Text>
          <Text className="text-gray-300 text-center mb-4">
            CineMax is your go-to destination for discovering, exploring, and
            organizing your movie watching experience.
          </Text>
          <Text className="text-gray-300 text-center">
            With personalized recommendations and detailed information about
            every film, we make sure you never miss a great movie.
          </Text>
        </Animated.View>

        {/* Get Started Button */}
        <Animated.View
          key={`button-${key}`}
          entering={FadeInUp.delay(1500).duration(800)}
          className="items-center mb-12"
        >
          <Link href="/about" className="mt-4">
            <Text className="text-blue-400">Learn more about us</Text>
          </Link>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
