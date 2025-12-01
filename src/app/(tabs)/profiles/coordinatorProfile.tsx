import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";

export default function CoordinatorProfile() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const { id, name, subject, mobile, imageUrl } = params;

  return (
    <ScrollView className="flex-1 bg-[#FFF8E0]">
      
      {/* Header */}
      <View className="flex-row items-center bg-[#FFC928] h-16 mt-12 px-4 shadow-md">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-black text-lg font-semibold ml-3">
          Profile
        </Text>
      </View>

      {/* Profile Card */}
      <View
        className="flex-row items-center bg-[#FFD54F] mx-5 mt-6 p-5 rounded-2xl"
        style={{
          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 3,
          elevation: 4,
        }}
      >
        {/* Coordinator Image */}
        <Image
          source={
            imageUrl
              ? { uri: imageUrl.toString() }
              : require("@/assets/images/profile.png")
          }
          className="w-28 h-28 rounded-full bg-white"
        />

        {/* Details */}
        <View className="ml-5 flex-1">
          <Text className="text-[22px] font-bold text-black">{name}</Text>

          {subject && (
            <Text className="text-[14px] text-gray-700 mt-1">
              Designation: {subject}
            </Text>
          )}

          {mobile && (
            <Text className="text-[14px] text-gray-700 mt-1">
              Mobile: {mobile}
            </Text>
          )}

          <Text className="text-[14px] text-gray-700 mt-1">
            ID: {id}
          </Text>
        </View>
      </View>

      {/* Additional Details */}
      <View className="bg-white mx-5 mt-5 p-5 rounded-2xl shadow-sm">
        <Text className="text-[16px] font-semibold text-black mb-3">
          Additional Details
        </Text>

        <Text className="text-[13px] text-gray-600 leading-5">
          This coordinator profile can be expanded later with more information
          like qualifications, responsibilities, experience, attendance,
          achievements, and school-related details.
        </Text>
      </View>
    </ScrollView>
  );
}
