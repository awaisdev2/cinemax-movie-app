import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

interface Movie {
  Poster: string;
  Title: string;
  Type: string;
  Year: string;
  imdbID: string;
}

const MovieApp = () => {
  const [data, setData] = useState<any>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=33ddc5cd&s=batman&page=${page}`
      );
      const data = await response.json();
      setData(data);
      setIsFetching(false);
    };
    fetchData();
  }, [page]);

  const MovieCard = ({
    Title,
    Type,
    Poster,
    Year,
    imdbID,
    index,
  }: Movie & { index: number }) => (
    <Link href={`/movie/${imdbID}`} asChild>
      <TouchableOpacity className="mb-4 w-1/2 px-2">
        <Animated.View
          entering={FadeInUp.delay(index * 100).duration(500)}
          className="bg-gray-800 rounded-lg p-3 h-52 justify-between"
        >
          {/* Poster Image */}
          <View className="h-28 w-full mb-2 mx-auto items-center">
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
          <View>
            <Text
              className="text-white font-bold text-center"
              numberOfLines={1}
            >
              {Title}
            </Text>
            <View className="flex-row justify-center mt-1">
              <Text className="text-gray-400 text-xs">
                {Type.charAt(0).toUpperCase() + Type.slice(1)}:
              </Text>
              <Text className="text-gray-400 text-xs ml-2">{Year}</Text>
            </View>
            <Text
              className="text-yellow-400 text-xs text-center mt-1"
              numberOfLines={1}
            >
              IMDB: {imdbID}
            </Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Link>
  );

  const Section = ({ title, movies }: { title: string; movies: Movie[] }) => (
    <View className="my-6">
      <Animated.Text
        entering={FadeInUp.duration(800)}
        className="text-white text-center text-3xl font-bold mb-3"
      >
        {title}
      </Animated.Text>
      <View className="flex-row flex-wrap">
        {movies?.length === 0 && (
          <Text className="text-white text-center">No movies found</Text>
        )}
        {movies?.map((movie, index: number) => (
          <MovieCard key={index} {...movie} index={index} />
        ))}
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-900 pt-10 pb-24">
      <ScrollView className="px-4">
        {isFetching && (
          <View className="flex-1 justify-center items-center py-10">
            <View className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></View>
            <Text className="text-white mt-4">Loading movies...</Text>
          </View>
        )}
        {!isFetching && (
          <View>
            <Section title="Popular movies" movies={data.Search || []} />
            <View className="flex-1 flex-row justify-center">
              <TouchableOpacity
                onPress={() => setPage(1)}
                className="bg-blue-600 rounded-lg py-3 mt-3 items-center w-1/2 mr-1"
                disabled={page === 1}
              >
                <Text className="text-white font-semibold text-base">
                  Go Back
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setPage(page + 1)}
                className="bg-blue-600 rounded-lg py-3 mt-3 items-center w-1/2 ml-1"
              >
                <Text className="text-white font-semibold text-base">
                  Load More
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <View className="h-px bg-gray-700 my-4" />
      </ScrollView>
    </View>
  );
};

export default MovieApp;
