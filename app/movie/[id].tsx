import { Link, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInUp,
  SlideInRight,
  ZoomIn,
} from "react-native-reanimated";

interface Rating {
  Source: string;
  Value: string;
}

interface MovieDetails {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Rating[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

const MovieDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://www.omdbapi.com/?i=${id}&apikey=33ddc5cd`
        );
        const data = await response.json();

        if (data.Response === "True") {
          setMovie(data);
        } else {
          setError("Movie not found");
        }
      } catch (err) {
        setError("Failed to fetch movie details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  const openIMDB = () => {
    if (movie?.imdbID) {
      Linking.openURL(`https://www.imdb.com/title/${movie.imdbID}`);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-white mt-4">Loading movie details...</Text>
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center p-4">
        <Text className="text-white text-lg text-center">
          {error || "Movie not found"}
        </Text>
        <Link href="/movies" asChild>
          <TouchableOpacity className="bg-blue-600 px-6 py-3 rounded-lg mt-4">
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </Link>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-900 mt-10">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header with Backdrop */}
      <Animated.View entering={ZoomIn.duration(800)} className="relative">
        <Image
          source={{ uri: movie.Poster }}
          className="w-full h-96"
          resizeMode="cover"
        />
        <View className="absolute inset-0 bg-black opacity-50" />

        {/* Back Button */}
        <Link href="/movies" asChild>
          <TouchableOpacity className="absolute top-11 left-4 bg-black bg-opacity-50 rounded-full px-3 py-2">
            <Text className="text-white text-xl mb-1 font-black">←</Text>
          </TouchableOpacity>
        </Link>
      </Animated.View>

      {/* Content */}
      <View className="px-4 pt-6 pb-10">
        {/* Title and Basic Info */}
        <Animated.View
          entering={FadeInUp.delay(200).duration(800)}
          className="mb-6"
        >
          <Text className="text-3xl font-bold text-white mb-2">
            {movie.Title}
          </Text>
          <View className="flex-row flex-wrap items-center mb-3">
            <Text className="text-gray-400 mr-3">{movie.Year}</Text>
            <Text className="text-gray-400 mr-3">•</Text>
            <Text className="text-gray-400 mr-3">{movie.Rated}</Text>
            <Text className="text-gray-400 mr-3">•</Text>
            <Text className="text-gray-400">{movie.Runtime}</Text>
          </View>

          {/* Ratings */}
          <View className="flex-row justify-between mb-4">
            {movie.Ratings.slice(0, 3).map((rating, index) => (
              <Animated.View
                key={index}
                entering={SlideInRight.delay(400 + index * 200).duration(700)}
                className="items-center bg-gray-800 p-3 rounded-lg flex-1 mx-1"
              >
                <Text className="text-white font-semibold text-sm">
                  {rating.Source}
                </Text>
                <Text className="text-yellow-400 font-bold text-lg">
                  {rating.Value}
                </Text>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View
          entering={FadeInUp.delay(700).duration(800)}
          className="flex-row justify-between mb-6"
        >
          <TouchableOpacity
            className="bg-blue-600 flex-1 mr-2 py-3 rounded-lg items-center"
            onPress={openIMDB}
          >
            <Text className="text-white font-semibold">View on IMDB</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-gray-800 w-12 h-12 rounded-lg items-center justify-center ml-2">
            <Text className="text-white text-xl">♥</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Plot */}
        <Animated.View
          entering={FadeInUp.delay(900).duration(800)}
          className="mb-6"
        >
          <Text className="text-xl font-bold text-white mb-3">Plot</Text>
          <Text className="text-gray-300 leading-6">{movie.Plot}</Text>
        </Animated.View>

        {/* Details Grid */}
        <Animated.View
          entering={FadeInUp.delay(1100).duration(800)}
          className="mb-6"
        >
          <Text className="text-xl font-bold text-white mb-3">Details</Text>
          <View className="bg-gray-800 rounded-lg p-4">
            <View className="flex-row justify-between py-2 border-b border-gray-700">
              <Text className="text-gray-400 font-semibold">Genre</Text>
              <Text className="text-white text-right flex-1 ml-4">
                {movie.Genre}
              </Text>
            </View>
            <View className="flex-row justify-between py-2 border-b border-gray-700">
              <Text className="text-gray-400 font-semibold">Released</Text>
              <Text className="text-white">{movie.Released}</Text>
            </View>
            <View className="flex-row justify-between py-2 border-b border-gray-700">
              <Text className="text-gray-400 font-semibold">Director</Text>
              <Text className="text-white text-right flex-1 ml-4">
                {movie.Director}
              </Text>
            </View>
            <View className="flex-row justify-between py-2 border-b border-gray-700">
              <Text className="text-gray-400 font-semibold">Writer</Text>
              <Text className="text-white text-right flex-1 ml-4">
                {movie.Writer}
              </Text>
            </View>
            <View className="flex-row justify-between py-2 border-b border-gray-700">
              <Text className="text-gray-400 font-semibold">Actors</Text>
              <Text className="text-white text-right flex-1 ml-4">
                {movie.Actors}
              </Text>
            </View>
            <View className="flex-row justify-between py-2 border-b border-gray-700">
              <Text className="text-gray-400 font-semibold">Language</Text>
              <Text className="text-white">{movie.Language}</Text>
            </View>
            <View className="flex-row justify-between py-2 border-b border-gray-700">
              <Text className="text-gray-400 font-semibold">Country</Text>
              <Text className="text-white">{movie.Country}</Text>
            </View>
            <View className="flex-row justify-between py-2 border-b border-gray-700">
              <Text className="text-gray-400 font-semibold">Awards</Text>
              <Text className="text-white text-right flex-1 ml-4">
                {movie.Awards}
              </Text>
            </View>
            {movie.BoxOffice && movie.BoxOffice !== "N/A" && (
              <View className="flex-row justify-between py-2">
                <Text className="text-gray-400 font-semibold">Box Office</Text>
                <Text className="text-white">{movie.BoxOffice}</Text>
              </View>
            )}
          </View>
        </Animated.View>

        {/* Additional Info */}
        <Animated.View entering={FadeInUp.delay(1300).duration(800)}>
          <Text className="text-xl font-bold text-white mb-3">
            Additional Information
          </Text>
          <View className="bg-gray-800 rounded-lg p-4">
            <View className="flex-row justify-between py-2 border-b border-gray-700">
              <Text className="text-gray-400 font-semibold">IMDB Rating</Text>
              <Text className="text-white">
                {movie.imdbRating}/10 ({movie.imdbVotes} votes)
              </Text>
            </View>
            <View className="flex-row justify-between py-2 border-b border-gray-700">
              <Text className="text-gray-400 font-semibold">Metascore</Text>
              <Text className="text-white">{movie.Metascore}/100</Text>
            </View>
            <View className="flex-row justify-between py-2 border-b border-gray-700">
              <Text className="text-gray-400 font-semibold">Type</Text>
              <Text className="text-white capitalize">{movie.Type}</Text>
            </View>
            {movie.DVD && movie.DVD !== "N/A" && (
              <View className="flex-row justify-between py-2 border-b border-gray-700">
                <Text className="text-gray-400 font-semibold">DVD Release</Text>
                <Text className="text-white">{movie.DVD}</Text>
              </View>
            )}
            {movie.Production && movie.Production !== "N/A" && (
              <View className="flex-row justify-between py-2">
                <Text className="text-gray-400 font-semibold">Production</Text>
                <Text className="text-white">{movie.Production}</Text>
              </View>
            )}
          </View>
        </Animated.View>
      </View>
    </ScrollView>
  );
};

export default MovieDetailScreen;
