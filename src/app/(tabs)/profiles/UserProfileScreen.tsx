import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import {
  ScrollView,
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Profile() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const API_URL = Constants.expoConfig.extra.apiUrl;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          setError('No token found. Please log in again.');
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/auth/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const profileData = await response.json();
        setData(profileData.user || profileData);
      } catch (err) {
        setError('Could not load profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#fcb900" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-red-600 text-lg">{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View style={{ backgroundColor: '#e3b026' }} className="h-[90px] px-6 pt-10 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-bold ml-4 text-black">Profile</Text>
      </View>

      <View style={{ backgroundColor: '#ffe291ff' }} className="flex-row items-center p-2 rounded-lg pl-6">
        <Image
          source={require('@/assets/images/profile1.jpg')}
          className="w-[110px] h-[110px] -mb-2 rounded-full bg-white"
        />
        <View className="ml-4 flex-1">
          <Text className="text-[20px] font-bold">{data.name}</Text>
          <Text className="text-[10px] text-gray-600">{`Last visit: 18/11/2025`}</Text>
        </View>
      </View>

      <View className="mt-8 px-6">

        <Text className="text-[12px] text-yellow-600 mb-1">Your Email</Text>
        <Text className="border-b border-gray-300 mb-4 pb-2">{data.email}</Text>

        <Text className="text-[12px] text-yellow-600 mb-1">Phone</Text>
        <Text className="border-b border-gray-300 mb-4 pb-2">{data.phone || 'Not available'}</Text>

        <Text className="text-[12px] text-yellow-600 mb-1">License Number</Text>
        <Text className="border-b border-gray-300 mb-4 pb-2">{data.license_number || 'Not available'}</Text>

        <Text className="text-[12px] text-yellow-600 mb-1">Vehicle</Text>
        <Text className="border-b border-gray-300 mb-4 pb-2">{data.vehicle || 'Not available'}</Text>

        <Text className="text-[12px] text-yellow-600 mb-1">User ID</Text>
        <Text className="border-b border-gray-300 mb-4 pb-2">{data.id}</Text>

        <Text className="text-[12px] text-yellow-600 mb-1">Status</Text>
        <Text className="border-b border-gray-300 mb-6 pb-2">{data.status || 'N/A'}</Text>

        <TouchableOpacity
          className="rounded-xl py-4"
          style={{ backgroundColor: '#e3b026' }}
          onPress={() =>
            router.push({
              pathname: '../profiles/ProfileEditScreen',
              params: { userData: JSON.stringify(data) },
            })
          }
        >
          <Text className="text-center text-black font-bold text-lg">Edit & Save</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}
