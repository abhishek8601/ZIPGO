import Colors from '@/constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  city?: string;
  country?: string;
}

export default function ProfileEditScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const API_URL = Constants.expoConfig.extra.apiUrl;

  const existingData = params.userData ? JSON.parse(params.userData as string) : null;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserProfile>(existingData || {
    name: '',
    email: '',
    phone: '',
    city: '',
    country: '',
  });

  // Fetch profile if not passed from params
  useEffect(() => {
    const fetchProfile = async () => {
      if (existingData) {
        setLoading(false);
        return;
      }

      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('No token found.');

        const res = await fetch(`${API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to fetch profile');
        const profileData = await res.json();
        setFormData(profileData.user || profileData);
      } catch (err) {
        setError('Could not load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    router.replace('/screens/LoginScreen');
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission denied!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token found.');

      const form = new FormData();
      form.append('name', formData.name);
      form.append('phone', formData.phone || '');
      form.append('city', formData.city || '');
      form.append('country', formData.country || '');
      if (profileImage) {
        form.append('image', {
          uri: profileImage,
          type: 'image/jpeg',
          name: 'profile.jpg',
        } as any);
      }

      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const resData = await response.json();
      if (!response.ok) throw new Error(resData.message || 'Profile update failed');

      alert('Profile updated successfully!');
      router.back();
    } catch (err: any) {
      alert(err.message || 'Something went wrong.');
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color={Colors.primary || '#e3b026'} />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-red-600 text-lg text-center">{error}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-gray-50"
    >
      <ScrollView className="flex-1">
        {/* Top Header */}
        <View className="bg-white h-[80px] px-4 pt-4 flex-row items-center justify-between shadow-md">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <Text className="text-black font-semibold text-lg">Cancel</Text>
          </TouchableOpacity>
          <Text className="text-black font-bold text-lg">Edit Profile</Text>
          <TouchableOpacity onPress={handleSave} className="p-2">
            <Text className="text-black font-semibold text-lg">Save</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Image */}
        <View className="items-center mt mb">
          <TouchableOpacity onPress={pickImage}>
            <Image
              source={
                profileImage
                  ? { uri: profileImage }
                  : require('@/assets/images/profile.png')
              }
              className="w-[120px] h-[120px] rounded-full border-4 border-white shadow-lg"
            />
            <View className="absolute bottom-0 right-0 bg-yellow-500 p-2 rounded-full">
              <Ionicons name="camera" size={20} color="black" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Form Section */}
        <View className="px-6">
          {[
            { label: 'Name', key: 'name' },
            { label: 'Email', key: 'email' },
            { label: 'Phone', key: 'phone' },
            { label: 'City, State', key: 'city' },
            { label: 'Country', key: 'country' },
          ].map((field) => (
            <View key={field.key} className="mb-4">
              <Text className="text-[12px] text-yellow-600 mb-1">{field.label}</Text>
              <TextInput
                className="bg-white px-4 py-3 rounded-xl border border-gray-300 shadow-sm"
                value={formData[field.key as keyof UserProfile] || ''}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, [field.key]: text }))
                }
              />
            </View>
          ))}

          <TouchableOpacity
            className="bg-yellow-500 py-4 rounded-xl shadow-md mt-2 mb-8"
            onPress={handleSave}
          >
            <Text className="text-center text-black font-bold text-lg">
              Save & Continue
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-500 py-2 rounded shadow mb-12"
          >
            <Text className="text-center text-white font-bold text-lg">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
