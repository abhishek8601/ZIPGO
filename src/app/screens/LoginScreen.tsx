import { router } from 'expo-router';
import { useUser } from '../../context/UserContext';
import React, { useState } from 'react';
import Constants from 'expo-constants';
import {
  Alert,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '@/constants/colors';
import Sizes from '@/constants/sizes';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
  const [role, setRole] = useState<'driver' | 'other'>('driver');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const API_URL = Constants.expoConfig.extra.apiUrl;
  

  if (Platform.OS === 'web') {
    (document.activeElement as HTMLElement)?.blur();
  }

  const handleLogin = async () => {
    let isValid = true;
    if (!isValid) return;

    setLoading(true);

    try {
      if (!email?.trim()) {
        Alert.alert('Error', 'Please enter your email.');
        return;
      }
      if (!password?.trim()) {
        Alert.alert('Error', 'Please enter your password.');
        return;
      }

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();


if (data.success) {
      // ✅ Save full user in AsyncStorage and context
      const userData = {
        uid: data.user.uid,
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        token: data.token,
      };

      await AsyncStorage.setItem('user', JSON.stringify(userData)); // store full user
      await AsyncStorage.setItem('token', data.token); // ✅ save token separately
      
      setUser(userData); 



        router.replace('/screens/LoginSuccessScreen');
      } else {
        Alert.alert('Login Failed', data.message || 'Invalid credentials.');
        router.replace('/screens/VerifyScreen');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Something went wrong. Please try again.');
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Pressable className="flex-1 bg-[#E2A809]" onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled" 
        >
          {/* Top Section */}
          <View className="flex-3">
            <Text className="ml-8 mt-52 text-[36px] font-light text-black mb-2">
              Hi, User
            </Text>
            <Text className="ml-8 text-[18px] text-black">Sign in required</Text>
          </View>

          {/* Bottom Section */}
          <View
            className="bg-white flex-1 mt-6 rounded-t-[40px] border border-t-[5px] border-b-[5px] px-8 pt-8"
            style={{
              borderColor: Colors.primary,
              borderTopColor: Colors.borderTop,
            }}
          >
            <View className="h-1 w-24 bg-black self-center rounded-md mb-6" />

            {/* Role Selection */}
            <View className="flex-row justify-center space-x-5 mb-5">
              {['driver', 'other'].map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => setRole(option as 'driver' | 'other')}
                  className="flex-row items-center"
                >
                  <View
                    className="w-[22px] h-[22px] rounded-full border-[5px] justify-center items-center"
                    style={{ borderColor: Colors.black }}
                  >
                    {role === option && (
                      <View
                        className="w-[12px] h-[12px] rounded-[5px]"
                        style={{ backgroundColor: Colors.primary }}
                      />
                    )}
                  </View>
                  <Text className="text-[16px] pl-2 text-black">
                    {option === 'driver' ? 'Driver' : 'Others'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Email */}
            <TextInput
              placeholder="Email ID"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              className="h-[50px] w-[305px] border border-gray-400 rounded-full px-5 mb-5 self-center"
            />

            {/* Password */}
            <TextInput
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              className="h-[50px] w-[305px] border border-gray-400 rounded-full px-5 mb-5 self-center"
            />

            {/* Remember Me + Forgot Password */}
            <View className="flex-row justify-between mb-3 px-5">
              <TouchableOpacity
                onPress={() => setRememberMe(!rememberMe)}
                className="flex-row items-center"
              >
                <Text className="mr-1">{rememberMe ? '✅' : '⬜️'}</Text>
                <Text className="text-[10px] text-black">Remember Me</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push('/screens/ForgotPasswordScreen')}>
                <Text className="text-[10px] text-[#0066cc]">Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              className="h-[50px] w-[305px] bg-[#E2A809] rounded-full justify-center items-center mb-4 self-center"
            >
              <Text className="text-[20px] font-normal text-black flex-row items-center">
                Login <MaterialCommunityIcons name="login" size={20} color="black" />
              </Text>
            </TouchableOpacity>

            {/* Register Section */}
            <View className="flex-row justify-center">
              <Text className="text-[14px] text-black">Don't have an account?</Text>
              <TouchableOpacity onPress={() => router.push('/screens/SignupScreen')}>
                <Text className="text-[14px] text-[#E2A809] underline ml-1">
                  Register
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Pressable>
    </KeyboardAvoidingView>
  );
}
