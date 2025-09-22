import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';

type Props = {
  children: React.ReactNode;
};

export const ProtectedRoute = ({ children }: Props) => {
  const { user, isLoading } = useAuth();
  const [isClient, setIsClient] = useState(false);

  // This effect ensures we're on the client-side before rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    // Redirect to the login page if the user is not authenticated
    return <Redirect href="/auth/login" />;
  }

  return <>{children}</>;
};

export const PublicRoute = ({ children }: Props) => {
  const { user, isLoading } = useAuth();
  const [isClient, setIsClient] = useState(false);

  // This effect ensures we're on the client-side before rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (user) {
    // Redirect to tabs if the user is already authenticated
    return <Redirect href="/(tabs)" />;
  }

  return <>{children}</>;
};
