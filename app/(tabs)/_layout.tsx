import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import React from "react";
import { ImageBackground, Text, View } from "react-native";

const TabIcons = ({
  focused,
  title,
  icon,
}: {
  title: string;
  focused: boolean;
  icon: any;
}) => {
  if (!focused) {
    return (
      <View className="size-full justify-center items-center mt-4 rounded-full">
        <MaterialCommunityIcons name={icon} size={24} color="white" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../../assets/images/highlight.png")}
      className="flex flex-row w-full flex-1 items-center justify-center overflow-hidden rounded-full mt-4 min-h-14 min-w-[100px]"
    >
      <MaterialCommunityIcons
        name={icon}
        size={24}
        color="white"
      />
      <Text className="text-white font-bold text-center ml-1">{title}</Text>
    </ImageBackground>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarStyle: {
          backgroundColor: "#2d285d",
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: 36,
          height: 52,
          position: "absolute",
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "#2d285d",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            TabIcons({ focused, title: "Home", icon: "home" }),
        }}
      />
      <Tabs.Screen
        name="movies"
        options={{
          title: "Movies",
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            TabIcons({ focused, title: "Movies", icon: "movie" }),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            TabIcons({ focused, title: "Search", icon: "magnify" }),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            TabIcons({ focused, title: "About", icon: "information-outline" }),
        }}
      />
    </Tabs>
  );
}
