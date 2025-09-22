import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { PublicRoute } from '../../components/ProtectedRoute';
import { useLogin } from '../../hooks/useAuthMutation';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showWebView, setShowWebView] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState('');
  
  const { mutate: login, isPending: isLoading } = useLogin();

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    login(
      { email, password },
      {
        onError: (error) => {
          console.error('Login error:', error);
          Alert.alert(
            'Login Failed',
            error instanceof Error ? error.message : 'An error occurred during login'
          );
        },
      }
    );
  };

  const handleRegister = (url = "https://app.govacha.com/auth/register") => {
    setWebViewUrl(url);
    setShowWebView(true);
  };

  const handleForgotPassword = () => {
    Alert.alert("Info", "Redirect to password reset");
  };

  const handleCloseWebView = () => {
    setShowWebView(false);
    setWebViewUrl("");
  };

  return (
    <PublicRoute>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-gray-50"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-row items-center justify-center mb-8">
            <Image
              source={{
                uri: "https://app.govacha.com/media/icons/Govacha.png",
              }}
              resizeMode="contain"
              className="w-12 h-12"
            />
            <Text className="text-black text-2xl font-bold ml-2">GovAcha</Text>
          </View>

          <View className="bg-white p-6 mx-4 rounded-lg shadow-md">
            <Text className="text-center text-lg font-semibold mb-2">
              Not a GovAcha Member?
            </Text>
            <View className="flex-row items-center justify-center mb-6">
              <TouchableOpacity
                onPress={() => handleRegister()}
                className="bg-primary px-4 py-3 rounded-lg mr-2"
              >
                <Text className="text-center text-white font-semibold">
                  Register For Free{" "}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleRegister()}
                className="border-primary border px-4 py-3 rounded-lg"
              >
                <Text className="text-primary font-semibold">
                  Click To Learn More
                </Text>
              </TouchableOpacity>
            </View>

            <Text className="text-xl font-bold text-center mb-6">Log In</Text>

            <View
              className="border-3 border-gray-300 rounded p-3 flex-row items-center mb-3"
              style={{ borderWidth: 1 }}
            >
              <FontAwesome6 name="envelope" size={22} color="#15498B" />
              <TextInput
                className="border-0 bg-transparent outline-none w-full font-medium text-base mx-2"
                style={{
                  fontSize: 14,
                  padding: 0,
                  marginHorizontal: 8,
                }}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View
              className="border-3 border-gray-300 rounded p-3 flex-row items-center mb-3"
              style={{ borderWidth: 1 }}
            >
              <MaterialIcons name="lock-outline" size={22} color="#15498B" />
              <TextInput
                className="border-0 bg-transparent outline-none w-full font-medium text-base mx-2"
                style={{
                  fontSize: 14,
                  padding: 0,
                  marginHorizontal: 8,
                }}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity onPress={handleForgotPassword}>
              <Text className="text-primary mb-6">Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              className="bg-primary py-4 rounded-2xl items-center mb-5"
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-lg">Login</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleRegister()}>
              <Text className="text-center text-gray-700">
                Don&apos;t have an account?{" "}
                <Text className="text-primary font-medium">Start For Free</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-8 items-center">
            <Text className="text-gray-600 text-sm"> 2025 GovAcha</Text>
            <View className="flex-row mt-2">
              <TouchableOpacity>
                <Text className="text-gray-600 text-sm mr-4">
                  Terms of Service
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text className="text-gray-600 text-sm">Privacy Policy</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-gray-500 text-xs mt-4 text-center">
              GovAcha is a Web-based Sales CRM.
            </Text>
          </View>
        </ScrollView>
        <Modal
          visible={showWebView}
          animationType="slide"
          onRequestClose={handleCloseWebView}
        >
          <View className="flex-1">
            <View className="py-4 px-4 flex-row justify-between items-center">
              <TouchableOpacity onPress={handleCloseWebView}>
                <View className="flex-row items-center">
                  <Ionicons name="arrow-back" size={20} color="black" />
                  <Text className="text-black font-semibold ml-2 text-lg">
                    Back
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={{ width: 50 }} />
            </View>
            <WebView
              source={{ uri: webViewUrl }}
              style={{ flex: 1 }}
              startInLoadingState={true}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </PublicRoute>
  );
};

export default Login;
