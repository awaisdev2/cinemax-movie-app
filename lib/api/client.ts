import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import ExpiryMap from "expiry-map";
import pMemoize from "p-memoize";

async function refreshToken(refreshToken: string | undefined) {
  console.log("Refreshing token...");
  const auth: any = await AsyncStorage.getItem("auth_data");
  const jsonData = JSON.parse(auth);

  const response = await axios.post(
    "https://7217594d4afb.ngrok-free.app/v1/auth/refresh-token",
    {
      refreshToken,
    }
  );

  const newAccessToken = response.data?.data?.access?.token;
  if (!newAccessToken) {
    throw new Error("Token not found");
  }

  if (jsonData?.tokens?.access?.token) {
    jsonData.tokens.access.token = newAccessToken;
    await AsyncStorage.setItem("auth_data", JSON.stringify(jsonData)); // save updated tokens
  }

  return newAccessToken;
}

const cache = new ExpiryMap(20000);
const memoizeRefreshToken = pMemoize(refreshToken, { cache });

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: "https://7217594d4afb.ngrok-free.app/v1/",
  headers: {
    "Content-Type": "application/json",
    Accept: 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to add auth token to requests
apiClient.interceptors.request.use(
  async (config: any) => {
    try {
      const auth: any = await AsyncStorage.getItem("auth_data");
      if (auth) {
        const jsonData = JSON.parse(auth);
        if (jsonData?.tokens?.access?.token) {
          config.headers.Authorization = `Bearer ${jsonData.tokens.access.token}`;
        }
      }
      return config;
    } catch (error) {
      console.error("Error in request interceptor:", error);
      return config;
    }
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const auth: any = await AsyncStorage.getItem("auth_data");
      const jsonData = JSON.parse(auth);

      try {
        originalRequest._retry = true;
        const newAccessToken = await memoizeRefreshToken(
          jsonData?.tokens?.refresh?.token
        );
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest, {});
      } catch (refreshError: any) {
        await AsyncStorage.clear();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Helper function to set auth tokens
let currentAccessToken: string | null = null;

export const setAuthTokens = (tokens: { access: { token: string } } | null) => {
  if (tokens?.access?.token) {
    currentAccessToken = tokens.access.token;
    apiClient.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${tokens.access.token}`;
  } else {
    currentAccessToken = null;
    delete apiClient.defaults.headers.common["Authorization"];
  }
};

// Function to get the current access token
export const getAuthToken = () => currentAccessToken;

export default apiClient;
