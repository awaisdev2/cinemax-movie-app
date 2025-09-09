import { Stack } from "expo-router";
import "react-native-reanimated";
import "./global.css";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="auth/login" options={{ headerShown: false }} />
    </Stack>
  );
}
