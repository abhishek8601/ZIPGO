import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';

interface ParentProfileParams {
  id: string;
  name: string;
  relation?: string;
  mobile?: string;
  qualification?: string;
  imageUrl?: string;
}

export default function ParentsProfile() {
  const router = useRouter();
  const params = useLocalSearchParams() as ParentProfileParams;

  const { name, relation, mobile, qualification, imageUrl } = params;

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header */}
      <View
        className="flex-row items-center h-[55px] pl-5 mb-4 px-3"
        style={{ backgroundColor: Colors.primary }}
      >
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) router.back();
            else router.push('/dashboard');
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text className="text-[15px] font-normal text-white ml-4">Parent Profile</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Parent Image */}
        <View className="items-center mb-6">
          <Image
            source={{
              uri: imageUrl || 'https://i.pravatar.cc/150?img=3',
            }}
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
            }}
          />
        </View>

        {/* Parent Details */}
        <View className="bg-white p-4 rounded-xl shadow-md">
          <Text className="text-black text-lg font-semibold mb-2">{name}</Text>

          {relation && (
            <Text className="text-gray-700 text-sm mb-1">
              Relation: {relation}
            </Text>
          )}

          {mobile && (
            <Text className="text-gray-700 text-sm mb-1">
              Phone: {mobile}
            </Text>
          )}

          {qualification && (
            <Text className="text-gray-700 text-sm mb-1">
              Education: {qualification}
            </Text>
          )}
        </View>

        {/* Example Buttons */}
        <View className="mt-6">
          <TouchableOpacity
            className="bg-yellow-500 p-4 rounded-xl mb-3 items-center"
            onPress={() => alert(`Calling ${name}...`)}
          >
            <Text className="text-white font-semibold">Call Parent</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-green-500 p-4 rounded-xl items-center"
            onPress={() => alert(`Message sent to ${name}...`)}
          >
            <Text className="text-white font-semibold">Send Message</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
