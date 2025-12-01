import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  Keyboard,
  Platform,
} from 'react-native';

export default function StudentProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  if (Platform.OS === 'web') {
    (document.activeElement as HTMLElement)?.blur();
  } else {
    Keyboard.dismiss();
  }

  const {
    id,
    fullName,
    imageUrl,
    father,
    mother,
    mobile,
    class: studentClass,
  } = params;

  // Fallback UI if no student data
  if (!fullName) {
    return (
      <View className="flex-1 items-center justify-center bg-[#fff8e1]">
        <Text className="text-[16px] text-red-600 text-center mt-12">
          No student data available.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-grow bg-[#fff8e1] pb-10"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      {/* ---------- Header ---------- */}
      <View
        className="mt-[50px] flex-row items-center justify-between bg-[#FFD54F] rounded-2xl pt-5 pb-4 px-5 mx-4"
        style={{
          shadowColor: '#000',
          shadowOpacity: 0.3,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 3,
          elevation: 4,
        }}
      >
        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-[#fcb900] items-center justify-center"
          style={{
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 3,
          }}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View className="w-10" />
      </View>

      {/* ---------- Profile Card ---------- */}
      <View
        className="items-center bg-[#FFD54F] rounded-2xl py-8 px-5 mt-6 mx-5"
        style={{
          shadowColor: '#000',
          shadowOpacity: 0.3,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 3,
          elevation: 5,
        }}
      >
        <Image
          source={
            imageUrl
              ? { uri: imageUrl.toString() }
              : require('@/assets/images/profile.png')
          }
          className="w-[110px] h-[110px] rounded-full mb-4 bg-white"
        />
        <Text className="text-[26px] font-bold text-[#2f2f2f] mb-2">
          {fullName}
        </Text>
        <Text className="text-[16px] text-[#333] mb-1">ID: {id}</Text>
        <Text className="text-[16px] text-[#333] mb-1">
          Class: {studentClass}
        </Text>
        <Text className="text-[16px] text-[#333] mb-1">Father: {father}</Text>
        <Text className="text-[16px] text-[#333] mb-1">Mother: {mother}</Text>
        <Text className="text-[16px] text-[#333] mb-1">Mobile: {mobile}</Text>
      </View>
    </ScrollView>
  );
}
