import Colors from '@/constants/colors';
import { useUser } from '@/context/UserContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Keyboard, Platform, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { callProtectedApi } from '@/utils/api'; // adjust path if needed
import Constants from 'expo-constants';

export default function SuccessfulLogin() {
  const { user } = useUser();
  const API_URL = Constants.expoConfig.extra.apiUrl;

  // blur keyboard
  if (Platform.OS === 'web') {
    (document.activeElement as HTMLElement)?.blur();
  } else {
    Keyboard.dismiss();
  }

  // fetch protected API
  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log('Saved token:', token);

        const data = await callProtectedApi(`${API_URL}/user/profile`);
        console.log('Protected API response:', data);
      } catch (error) {
        console.error('Error calling protected API:', error);
      }
    };

    fetchProtectedData();
  }, []);

  // redirect after 3 seconds
  useEffect(() => {
    if (!user) return;

    const timeout = setTimeout(() => {
      router.replace('/dashboard');
    }, 3000);

    return () => clearTimeout(timeout);
  }, [user]);

  return (
    <View className="flex-1 bg-[#E2A809]">
      {/* Header */}
      <View className="flex-4">
        <Text className="mt-[200px] text-[30px] font-light text-left ml-[40px] text-black">
          Hello, {user?.name || 'User'}
        </Text>
        <Text className="text-[20px] text-left ml-[40px] text-black">Welcome</Text>
      </View>

      {/* Bottom Section */}
      <View
        className="flex-1 bg-white rounded-t-[40px] border border-t-[5px] border-b-[5px] items-center justify-center"
        style={{
          borderTopColor: Colors.borderTop,
          borderBottomColor: Colors.borderTop,
        }}
      >
        {/* Tick Icon */}
        <View
          className="w-[150px] h-[150px] rounded-full border-[4px] bg-white items-center justify-center"
          style={{ borderColor: Colors.tick }}
        >
          <MaterialCommunityIcons name="check" size={80} color="#E8B639" />
        </View>

        {/* Success Message */}
        <View className="mt-3 items-center px-5">
          <Text
            className="text-[14px] mb-5"
            style={{ color: Colors.subText }}
          >
            Login Successful
          </Text>
        </View>
      </View>
    </View>
  );
}
