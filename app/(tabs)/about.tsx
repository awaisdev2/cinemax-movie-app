import { Link, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

const About = () => {
  const [animationKey, setAnimationKey] = useState(0);

  // Reset animation each time screen is focused
  useFocusEffect(
    useCallback(() => {
      setAnimationKey((prev) => prev + 1);
    }, [])
  );

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View className="bg-gray-900 flex-1 pt-10 pb-24">
      <ScrollView className="px-6">
        {/* Header */}
        <Animated.View
          key={`header-${animationKey}`}
          entering={FadeInDown.duration(600)}
          className="items-center my-6"
        >
          <Text className="text-3xl font-bold text-white">About CineMax</Text>
          <Text className="text-lg text-gray-400 mt-2">
            Your Ultimate Movie Companion
          </Text>
        </Animated.View>

        {/* App Description */}
        <Animated.View
          key={`desc-${animationKey}`}
          entering={FadeInUp.delay(200).duration(600)}
          className="bg-gray-800 p-6 rounded-xl mb-8"
        >
          <Text className="text-white text-lg mb-4">
            CineMax is a modern mobile application built with React Native and
            Expo, designed to help movie enthusiasts discover, explore, and keep
            track of their favorite films and TV shows.
          </Text>
          <Text className="text-white text-lg">
            We leverage the powerful TMDB API to bring you the most
            comprehensive and up-to-date information about movies, including
            ratings, reviews, cast details, and much more.
          </Text>
        </Animated.View>

        {/* Features */}
        <Animated.View
          key={`features-${animationKey}`}
          entering={FadeInDown.delay(400).duration(600)}
          className="mb-8"
        >
          <Text className="text-2xl font-bold text-white mb-4">Features</Text>

          {[
            {
              title: "• Discover New Movies",
              desc: "Browse through thousands of movies from various genres and find your next favorite.",
            },
            {
              title: "• Popular & Trending",
              desc: "Stay updated with the latest popular movies and what’s trending in the film industry.",
            },
            {
              title: "• Detailed Information",
              desc: "Get comprehensive details about each movie including cast, crew, ratings, and reviews.",
            },
          ].map((item, index) => (
            <Animated.View
              key={`feature-${index}-${animationKey}`}
              entering={FadeInUp.delay(200 * index).duration(600)}
              className="bg-gray-800 p-5 rounded-xl mb-4"
            >
              <Text className="text-blue-400 text-lg font-semibold mb-2">
                {item.title}
              </Text>
              <Text className="text-gray-300">{item.desc}</Text>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Built With */}
        <Animated.View
          key={`stack-${animationKey}`}
          entering={FadeInDown.delay(600).duration(600)}
          className="mb-8"
        >
          <Text className="text-2xl font-bold text-white mb-4">Built With</Text>
          <View className="flex-row flex-wrap justify-between">
            {[
              { title: "React Native", desc: "Cross-platform framework" },
              { title: "Expo", desc: "Development platform" },
              { title: "Tailwind CSS", desc: "Styling framework" },
              { title: "TMDB API", desc: "Movie data source" },
            ].map((tech, index) => (
              <Animated.View
                key={`tech-${index}-${animationKey}`}
                entering={FadeInUp.delay(150 * index).duration(500)}
                className="w-[48%] bg-gray-800 p-4 rounded-xl mb-4 items-center"
              >
                <Text className="text-blue-400 font-bold">{tech.title}</Text>
                <Text className="text-gray-300 text-center mt-2">
                  {tech.desc}
                </Text>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Links */}
        <Animated.View
          key={`links-${animationKey}`}
          entering={FadeInDown.delay(800).duration(600)}
          className="mb-8"
        >
          <Text className="text-2xl font-bold text-white mb-4">Links</Text>
          <TouchableOpacity
            className="bg-gray-800 p-4 rounded-xl mb-4"
            onPress={() => openLink("https://www.themoviedb.org/")}
          >
            <Text className="text-blue-400 text-center font-semibold">
              TMDB Website
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-gray-800 p-4 rounded-xl mb-4"
            onPress={() =>
              openLink("https://www.themoviedb.org/documentation/api")
            }
          >
            <Text className="text-blue-400 text-center font-semibold">
              API Documentation
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Developer Info */}
        <Animated.View
          key={`dev-${animationKey}`}
          entering={FadeInUp.delay(1000).duration(600)}
          className="mb-10"
        >
          <Text className="text-2xl font-bold text-white mb-4">Developer</Text>
          <View className="bg-gray-800 p-5 rounded-xl">
            <Text className="text-white text-lg mb-2">
              This app was developed by movie enthusiasts for movie enthusiasts.
            </Text>
            <Text className="text-gray-300">
              We&apos;re constantly working to improve the app and add new
              features. If you have any suggestions or feedback, we&apos;d love
              to hear from you!
            </Text>
          </View>
        </Animated.View>

        {/* Back Button */}
        <Animated.View
          key={`back-${animationKey}`}
          entering={FadeInUp.delay(1200).duration(600)}
          className="items-center mb-10"
        >
          <Link href="/" asChild>
            <TouchableOpacity className="bg-blue-600 px-8 py-3 rounded-full">
              <Text className="text-white font-bold text-lg">Back to Home</Text>
            </TouchableOpacity>
          </Link>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default About;
