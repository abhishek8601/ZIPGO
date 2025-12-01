import Colors from '@/constants/colors';
import Sizes from '@/constants/sizes';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

export default function VerifyScreen() {
  return (
    <View className="flex-1" style={{ backgroundColor: Colors.primary }}>
      {/* ---------- Top Section ---------- */}
      <View className="flex-[4]">
        <Text className="text-[30px] font-light mb-5 text-left ml-10 mt-[200px] text-black">
          Hi, User
        </Text>
        <Text className="text-[20px] mb-2 text-left ml-10 text-black">
          Verifying...
        </Text>
      </View>

      {/* ---------- Bottom Section ---------- */}
      <View
        className="flex-[6] items-center justify-center rounded-t-[20px] pb-5"
        style={{
          backgroundColor: Colors.white,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderTopColor: Colors.borderTop,
          borderTopWidth: 7,
          borderBottomWidth: Sizes.bottomBorder,
          borderBottomColor: Colors.primary,
        }}
      >
        {/* Error Icon */}
        <View className="items-center my-5">
          <View
            className="w-[135px] h-[135px] rounded-full bg-white items-center justify-center mt-8 border-4"
            style={{ borderColor: Colors.cross }}
          >
            <MaterialCommunityIcons name="close" size={80} color="#CB4040" />
          </View>
        </View>

        {/* Message & Links */}
        <View className="items-center px-5">
          <Text className="text-[16px] font-normal mb-2 text-black">
            Something went wrong!
          </Text>
          <Text className="text-[14px] text-[#555] mb-5">
            Please try again.
          </Text>

          <Link href="/screens/LoginScreen">
            <Text className="text-[15px] text-black underline my-1">
              ← Back to Login
            </Text>
          </Link>

          <Text className="text-[14px] font-bold my-2">OR</Text>

          <Link href="/screens/ForgotPasswordScreen">
            <Text className="text-[15px] text-black underline my-1">
              Forgot Password?
            </Text>
          </Link>
        </View>
      </View>
    </View>
  );
}
