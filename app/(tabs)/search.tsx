import { Link, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

interface Movie {
  Poster: string;
  Title: string;
  Type: string;
  Year: string;
  imdbID: string;
}

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // 👇 Added key to force re-mount animations
  const [animKey, setAnimKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      // reset key when screen comes into focus
      setAnimKey((prev) => prev + 1);
    }, [])
  );

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setHasSearched(true);

    const response = await fetch(
      `https://www.omdbapi.com/?i=tt3896198&apikey=33ddc5cd&type=movie&s=${searchQuery}`
    );
    const data = await response.json();

    const filteredResults =
      data.Search?.filter((movie: Movie) =>
        movie.Title.toLowerCase().includes(searchQuery.toLowerCase())
      ) || [];

    setSearchResults(filteredResults);
    setIsSearching(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setHasSearched(false);
  };

  const MovieCard = ({
    Title,
    Type,
    Poster,
    Year,
    imdbID,
    index,
  }: Movie & { index: number }) => (
    <Link href={`/movie/${imdbID}`} asChild>
      <TouchableOpacity className="mb-4 w-full">
        <Animated.View
          key={animKey + "-" + index} // 👈 re-mount each time
          entering={FadeInUp.delay(index * 100).duration(500)}
          className="bg-gray-800 rounded-lg p-4 flex-row"
        >
          {/* Poster */}
          <View className="w-16 h-24 mr-4">
            {Poster && Poster !== "N/A" ? (
              <Image
                source={{ uri: Poster }}
                className="h-full w-full rounded-lg"
                resizeMode="cover"
              />
            ) : (
              <View className="h-full w-full bg-gray-700 rounded-lg items-center justify-center">
                <Text className="text-gray-400 text-xs">No Image</Text>
              </View>
            )}
          </View>

          {/* Movie Details */}
          <View className="flex-1">
            <Text className="text-white font-bold text-lg" numberOfLines={1}>
              {Title}
            </Text>
            <View className="flex-row items-center mt-1">
              <Text className="text-gray-400 text-sm">
                {Type.charAt(0).toUpperCase() + Type.slice(1)}
              </Text>
              <Text className="text-gray-400 text-sm mx-2">•</Text>
              <Text className="text-gray-400 text-sm">{Year}</Text>
            </View>
            <Text className="text-yellow-400 text-xs mt-1" numberOfLines={1}>
              IMDB: {imdbID}
            </Text>
          </View>

          {/* Chevron */}
          <View className="justify-center">
            <Text className="text-gray-400 text-lg">›</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View className="flex-1 bg-gray-900 pt-10 pb-24">
      {/* Header */}
      <Animated.View
        key={animKey + "-header"} // 👈 re-mount header animations
        entering={FadeInDown.duration(600)}
        className="px-4 pb-4 mt-5"
      >
        <Text className="text-3xl font-bold text-white mb-3 text-center">
          Search Movies
        </Text>

        {/* Search Bar */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(600)}
          className="flex-row items-center bg-gray-800 rounded-lg px-4 py-3"
        >
          <Text className="text-gray-400 mr-2">🔍</Text>
          <TextInput
            className="flex-1 text-white text-base"
            placeholder="Search for movies..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <Text className="text-gray-400 text-lg">✕</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Search Button */}
        <Animated.View entering={FadeInDown.delay(400).duration(600)}>
          <TouchableOpacity
            className="bg-blue-600 rounded-lg py-3 mt-3 items-center"
            onPress={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
          >
            <Text className="text-white font-semibold text-base">
              {isSearching ? "Searching..." : "Search"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      {/* Results */}
      <ScrollView className="px-4 flex-1">
        {isSearching ? (
          <View className="flex-1 justify-center items-center py-10">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="text-white mt-4">Searching for movies...</Text>
          </View>
        ) : hasSearched ? (
          searchResults.length > 0 ? (
            <>
              <Animated.Text
                key={animKey + "-results-title"} // 👈 re-mount
                entering={FadeInDown.duration(500)}
                className="text-white text-lg font-semibold mb-4"
              >
                Found {searchResults.length} results
              </Animated.Text>
              {searchResults.map((movie, index) => (
                <MovieCard key={movie.imdbID} {...movie} index={index} />
              ))}
            </>
          ) : (
            <Animated.View
              key={animKey + "-no-results"} // 👈 re-mount
              entering={FadeInUp.duration(500)}
              className="flex-1 justify-center items-center py-10"
            >
              <Text className="text-white text-lg mb-2">No movies found</Text>
              <Text className="text-gray-400 text-center">
                Try different keywords or browse popular movies
              </Text>
            </Animated.View>
          )
        ) : (
          <Animated.View
            key={animKey + "-tips"} // 👈 re-mount
            entering={FadeInUp.duration(600)}
            className="py-6"
          >
            <Text className="text-white text-lg font-semibold mb-4">
              Search Tips
            </Text>
            <View className="bg-gray-800 rounded-lg p-4 mb-4">
              <Text className="text-blue-400 font-semibold mb-1">
                • Try specific titles
              </Text>
              <Text className="text-gray-300">
                e.g., &quot;The Dark Knight&quot; instead of &quot;batman
                movie&quot;
              </Text>
            </View>
            <View className="bg-gray-800 rounded-lg p-4 mb-4">
              <Text className="text-blue-400 font-semibold mb-1">
                • Check your spelling
              </Text>
              <Text className="text-gray-300">
                Even small typos can affect results
              </Text>
            </View>
            <View className="bg-gray-800 rounded-lg p-4">
              <Text className="text-blue-400 font-semibold mb-1">
                • Try different keywords
              </Text>
              <Text className="text-gray-300">Sometimes simpler is better</Text>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
};

export default SearchScreen;
