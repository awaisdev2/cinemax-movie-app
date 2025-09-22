import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export interface UserModel {
  id: number;
  uuid: string;
  username: string;
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
  userType: 'customer' | 'sales' | 'admin' | 'lead';
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

type AuthTokens = {
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

type AuthContextType = {
  user: UserModel | null;
  tokens: AuthTokens | null;
  login: (tokens: AuthTokens, userData: UserModel) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  selectedCommunity: any;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'auth_data';

const saveAuthData = async (tokens: AuthTokens, userData: UserModel) => {
  try {
    const data = JSON.stringify({ tokens, user: userData });
    await AsyncStorage.setItem(STORAGE_KEY, data);
  } catch (error) {
    console.error('Error saving auth data:', error);
  }
};

const loadAuthData = async (): Promise<{ tokens: AuthTokens | null; user: UserModel | null }> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading auth data:', error);
  }
  return { tokens: null, user: null };
};

const clearAuthData = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserModel | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAuth = async () => {
      const { tokens: storedTokens, user: storedUser } = await loadAuthData();
      if (storedTokens && storedUser) {
        setTokens(storedTokens);
        setUser(storedUser);
        setSelectedCommunity(storedUser.userCommunities?.[0]);
      }
      setIsLoading(false);
    };

    loadAuth();
  }, []);

  const login = async (tokens: AuthTokens, userData: UserModel) => {
    setTokens(tokens);
    setUser(userData);
    setSelectedCommunity(userData.userCommunities?.[0]);
    await saveAuthData(tokens, userData);
    router.replace('/(tabs)');
  };

  const logout = async () => {
    setTokens(null);
    setUser(null);
    await clearAuthData();
    router.replace('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ user, tokens, login, logout, isLoading, selectedCommunity }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
