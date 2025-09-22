import apiClient from "@/lib/api/client";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";

type LoginCredentials = {
  email: string;
  password: string;
};

export interface LoginResponse {
  user: UserModel;
  tokens: {
    access: {
      token: string;
      expires: string;
    };
    refresh: {
      token: string;
      expires: string;
    };
    stream: {
      token: string;
    };
  };
}

export interface UserModel {
  id: number;
  uuid: string;
  username: string;
  password: string | undefined;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  companyName?: string;
  city?: string;
  profilePic: string;
  state: string;
  subscription: any;
  absoluteProfilePath?: string;
  userType: "customer" | "sales" | "admin" | "lead";
  bio: string;
  userCommunities: any;
  userWebsites: any;
  userCertifications: any;
  timezone: string;
  phoneNumber: string;
  isDmOn: boolean;
  hasWatchedTutorial: boolean;
  showCalendarModal: boolean;
}

export const useLogin = () => {
  const { login } = useAuth();

  return useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: async ({ email, password }) => {
      const response = await apiClient.post("/auth/login", {
        email,
        password,
      });

      if (!response.data) {
        throw new Error("Login failed");
      }

      return response.data;
    },
    onSuccess: (data: any) => {
      login(data?.data?.tokens, data?.data?.user);
    },
    onError: (error) => {
      console.log("error:", error.message);
    },
  });
};
