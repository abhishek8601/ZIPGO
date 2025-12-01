import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '@/constants/colors';
import Sizes from '@/constants/sizes';
import Constants from 'expo-constants';

export default function Signup() {
  const router = useRouter();
  const [role, setRole] = useState<'driver' | 'other' | null>('driver');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const API_URL = Constants.expoConfig.extra.apiUrl;

  if (Platform.OS === 'web') {
    (document.activeElement as HTMLElement)?.blur();
  }

  const handleSignup = async () => {
    setLoading(true);
    try {
      if (!name.trim() || !email.trim() || !password.trim() || !phoneNumber.trim()) {
        Alert.alert('Error', 'Please fill all required fields.');
        setLoading(false);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Alert.alert('Error', 'Please enter a valid email address.');
        setLoading(false);
        return;
      }

      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(phoneNumber)) {
        Alert.alert('Error', 'Please enter a valid 10-digit phone number.');
        setLoading(false);
        return;
      }

      // Prepare request body
      const payload = {
        name,
        email,
        password,
        phoneNumber,
        vehicleNumber,
        licenseNumber,
        role,
      };

      // API call
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });


      const data = await response.json();
      console.log('API Response:', data);

      if (!response.ok) {
        Alert.alert('Registration Failed', data?.message || `Status: ${response.status} ${response.statusText}`);
        setLoading(false);
        return;
      }

      // Save token (if API returns one)
      if (data?.token) {
        await AsyncStorage.setItem('user_token', data.token);
      }

      Alert.alert('Success', `Account created as ${role}`);
      setName('');
      setEmail('');
      setPassword('');
      setPhoneNumber('');
      setVehicleNumber('');
      setLicenseNumber('');
      setRole('driver');

      router.push('/screens/SignupSuccessScreen');
    } catch (error) {
      console.error('Signup failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Pressable
        className="flex-1 bg-[#F2C94C]" // secondary color
        onPress={Keyboard.dismiss}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top section */}
          <View className="h-[250px] bg-[#F2C94C]" />

          {/* Form Container */}
          <View
            className="flex-1 bg-white rounded-t-[40px] border border-t-[5px] border-b-[5px]"
            style={{
              borderColor: Colors.secondrycolor,
              borderTopWidth: Sizes.topBorder,
              borderBottomWidth: Sizes.bottomBorder,
            }}
          >
            <Text className="text-center text-[20px] font-medium mt-2 mb-3 text-black">
              Register
            </Text>
            <View className="h-[3px] w-[120px] bg-black self-center rounded mb-4" />

            {/* Radio buttons */}
            <View className="flex-row justify-around mb-2">
              <TouchableOpacity
                onPress={() => setRole('driver')}
                className="flex-row items-center m-5"
              >
                <View
                  className="h-[22px] w-[22px] rounded-full border-[5px] border-black items-center justify-center mr-2"
                >
                  {role === 'driver' && (
                    <View
                      className="w-[12px] h-[12px] rounded-md"
                      style={{ backgroundColor: Colors.primary }}
                    />
                  )}
                </View>
                <Text className="text-[13px] text-black">Driver</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setRole('other')}
                className="flex-row items-center m-5"
              >
                <View
                  className="h-[22px] w-[22px] rounded-full border-[5px] border-black items-center justify-center mr-2"
                >
                  {role === 'other' && (
                    <View
                      className="w-[12px] h-[12px] rounded-md"
                      style={{ backgroundColor: Colors.primary }}
                    />
                  )}
                </View>
                <Text className="text-[13px] text-black">Others</Text>
              </TouchableOpacity>
            </View>

            {/* Inputs */}
            <View className="px-10">
              <TextInput
                className="h-[50px] border border-gray-300 rounded-full px-4 mb-3 bg-white"
                placeholder="Name"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                className="h-[50px] border border-gray-300 rounded-full px-4 mb-3 bg-white"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
              <TextInput
                className="h-[50px] border border-gray-300 rounded-full px-4 mb-3 bg-white"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <TextInput
                className="h-[50px] border border-gray-300 rounded-full px-4 mb-3 bg-white"
                placeholder="Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
              <TextInput
                className="h-[50px] border border-gray-300 rounded-full px-4 mb-3 bg-white"
                placeholder="Vehicle Number"
                value={vehicleNumber}
                onChangeText={setVehicleNumber}
              />
              <TextInput
                className="h-[50px] border border-gray-300 rounded-full px-4 mb-3 bg-white"
                placeholder="Driving Licence Number"
                value={licenseNumber}
                onChangeText={setLicenseNumber}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              className="bg-[#E2A809] h-[50px] rounded-full mx-10 mt-2 items-center justify-center flex-row"
              onPress={handleSignup}
              disabled={loading}
            >
              <Text className="text-[20px] font-normal text-black">
                {loading ? 'Please wait...' : 'Sign Up'}
              </Text>
              <MaterialCommunityIcons
                name="account-plus"
                size={20}
                color="black"
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>

            {/* Login link */}
            <View className="flex-row justify-center mt-5 mb-10">
              <Text className="text-[14px] text-black">Already have an account?</Text>
              <Link href="/screens/LoginScreen">
                <Text className="text-[14px] underline text-[#E2A809] ml-1">
                  Login
                </Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </Pressable>
    </KeyboardAvoidingView>
  );
}
