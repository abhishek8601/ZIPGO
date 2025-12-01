import Colors from '@/constants/colors';
import Sizes from '@/constants/sizes';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { replace } from 'expo-router/build/global-state/routing';
import React, { useEffect } from 'react';
import { Image, Keyboard, Platform, Text, View } from 'react-native';

export default function SuccessfulLogin() {
  // Blur keyboard on web or mobile
  if (Platform.OS === 'web') {
    (document.activeElement as HTMLElement)?.blur();
  } else {
    Keyboard.dismiss();
  }

  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      replace('/screens/LoginScreen');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1" style={{ backgroundColor: Colors.primary }}>
      {/* First Section */}
      <View className="flex-[4]">
        <Text className="text-[48px] font-light mb-5 text-left ml-10 mt-44 text-black">
          Hello,
        </Text>
        <Text className="text-[28px] mb-3 text-left ml-10 text-black">
          Welcome User
        </Text>
      </View>

      {/* Second Section */}
      <View
        className="flex-[6] items-center justify-center rounded-t-[40px] pb-5"
        style={{
          backgroundColor: Colors.white,
          borderTopColor: Colors.borderTop,
          borderTopWidth: Sizes.topBorder,
          borderBottomColor: Colors.primary,
          borderBottomWidth: Sizes.bottomBorder,
        }}
      >
        <View
          className="w-[150px] h-[150px] rounded-full items-center justify-center bg-white border-4"
          style={{ borderColor: Colors.primary }}
        >
          <MaterialCommunityIcons name="check" size={80} color="#dda013fa" />
        </View>

        <View className="mt-3 items-center px-5">
          <Text className="text-[14px]" style={{ color: Colors.subText }}>
            Register Successfully!
          </Text>
        </View>
      </View>
    </View>
  );
}
