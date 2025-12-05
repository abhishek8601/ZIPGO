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
import { useUser } from '@/context/UserContext';

// ---------------- INTERFACE ---------------- //
interface UserProfile {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  country?: string;
  image?: string;
  license_number?: string;
  vehicle?: string;
}

// ---------------- COMPONENT ---------------- //
export default function ProfileEditScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const API_URL = Constants.expoConfig.extra.apiUrl;
  const { setUser } = useUser();

  console.log("🔍 Received params:", params);

  const existingData = params.userData
    ? JSON.parse(params.userData as string)
    : null;

  console.log("📝 Parsed existing userData:", existingData);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [formData, setFormData] = useState<UserProfile>({
    id: '',
    name: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    image: '',
    license_number: '',
    vehicle: '',
  });

  // ---------------- FETCH PROFILE ---------------- //
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log("📦 Starting to load profile...");

        if (existingData) {
          console.log("Using existingData from params.");

          setFormData({
            id: existingData.id || existingData._id,
            ...existingData,
          });

          setProfileImage(existingData.image || null);
          setLoading(false);
          return;
        }

        const token = await AsyncStorage.getItem('token');
        console.log("🔑 Token found:", token);

        if (!token) throw new Error('No token found.');

        const res = await fetch(`${API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("🌐 Profile fetch status:", res.status);

        if (!res.ok) throw new Error('Failed to fetch profile');

        const profileData = await res.json();
        console.log("📥 Profile data received:", profileData);

        const user = profileData.user || profileData;

        setFormData({
          id: user.id,
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          city: user.city || '',
          country: user.country || '',
          image: user.image || '',
          license_number: user.license_number || '',
          vehicle: user.vehicle || '',
        });

        setProfileImage(user.image || null);
      } catch (err: any) {
        console.log("❌ Error loading profile:", err.message);
        setError('Could not load profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ---------------- PICK IMAGE ---------------- //
  const pickImage = async () => {
    console.log("📸 Opening image picker...");

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission denied!');
      console.log("❌ Permission denied for image picker");
      return;
    }

    const result: any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    console.log("📷 Image picker result:", result);

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      console.log("✅ Image selected:", result.assets[0].uri);
    }
  };

  // ---------------- SAVE PROFILE ---------------- //
  const handleSave = async () => {
  console.log("💾 Saving profile...", formData);

  try {
    const token = await AsyncStorage.getItem('token');

    if (!token) throw new Error('No token found.');
    if (!formData.id) throw new Error('User ID missing.');

    const payload = {
      name: formData.name,
      phone: formData.phone,
      city: formData.city,
      country: formData.country,
      license_number: formData.license_number,
      vehicle: formData.vehicle
    };

    const response = await fetch(
      `${API_URL}/auth/profile-update/${formData.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    console.log("🌐 Update status:", response.status);

    const resData = await response.json();
    console.log("📥 Update response:", resData);

    if (!response.ok) throw new Error(resData.message);

    alert('Profile updated successfully!');
    router.back();
  } catch (err: any) {
    console.log("❌ Error updating profile:", err.message);
    alert(err.message);
  }
};


  // ---------------- LOGOUT ---------------- //
  const handleLogout = async () => {
    console.log("🚪 Logging out...");

    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');

    setUser(null);
    router.replace('/screens/LoginScreen');
  };

  // ---------------- LOADING ---------------- //
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // ---------------- ERROR ---------------- //
  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-red-600 text-lg text-center">{error}</Text>
      </View>
    );
  }

  // ---------------- MAIN UI ---------------- //
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-gray-50"
    >
      <ScrollView className="flex-1">

        {/* Header */}
        <View className="bg-white h-[80px] px-4 pt-4 flex-row items-center justify-between shadow-md">
          <TouchableOpacity onPress={() => router.replace('/profiles/UserProfileScreen')} className="p-2">
            <Text className="text-black font-semibold text-lg">Cancel</Text>
          </TouchableOpacity>
          <Text className="text-black font-bold text-lg">Edit Profile</Text>
          <TouchableOpacity onPress={handleSave} className="p-2">
            <Text className="text-black font-semibold text-lg">Save</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Image */}
        <View className="items-center mt-6 mb-4">
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

        {/* Form */}
        <View className="px-6">
          {[
            { label: 'Name', key: 'name' },
            { label: 'Phone', key: 'phone' },
            { label: 'License Number', key: 'license_number' },
            { label: 'Vehicle', key: 'vehicle' },
          ].map((field) => (
            <View key={field.key} className="mb-4">
              <Text className="text-[12px] text-yellow-600 mb-1">
                {field.label}
              </Text>

              <TextInput
                value={formData[field.key] || ''}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, [field.key]: text }))
                }
                className="border border-gray-300 rounded-md px-3 py-2 bg-white"
                placeholder={`Enter ${field.label}`}
              />
            </View>
          ))}

          <TouchableOpacity
            className="bg-yellow-500 py-4 rounded-xl shadow-md mt-2 mb-8"
            onPress={handleSave}
          >
            <Text className="text-center text-black font-bold text-lg">
              Save
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-500 py-2 rounded shadow mb-12"
          >
            <Text className="text-center text-white font-bold text-lg">
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
