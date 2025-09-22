import { QueryClientProvider } from '@tanstack/react-query';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import 'react-native-reanimated';

import '@/app/global.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { queryClient } from '@/lib/queryClient';

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

// Main app layout with error boundary and providers
const RootLayout: React.FC = () => {
  return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Stack 
            screenOptions={{
              headerShown: false,
              contentStyle: styles.stackContent,
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="auth/login" />
          </Stack>
        </AuthProvider>
      </QueryClientProvider>
  );
};

const styles = StyleSheet.create({
  stackContent: {
    backgroundColor: 'white',
  },
});

export default RootLayout;
