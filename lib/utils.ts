import AsyncStorage from "@react-native-async-storage/async-storage";

export const getSelectedCommunityId = async () => {
  try {
    const community = await AsyncStorage.getItem("selectedCommunity");
    const communityData = JSON.parse(community || "");
    return communityData?.uuid;
  } catch {
    return null;
  }
};

export const parseError = (error: any) => {
  return (
    error?.response?.data?.message ||
    "An error occurred, please try again later."
  );
};
