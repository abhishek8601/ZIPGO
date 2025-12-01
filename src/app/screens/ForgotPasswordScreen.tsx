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
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { FirebaseError } from 'firebase/app';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '@/constants/colors';

export default function Forgot() {
  const [email, setEmail] = useState('');

  if (Platform.OS === 'web') {
    (document.activeElement as HTMLElement)?.blur();
  }

  const handleRecover = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        'Recovery Email Sent',
        `A password reset link has been sent to ${email}. Please check your inbox.`
      );
      setEmail('');
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/user-not-found') {
          Alert.alert('Error', 'No user found with this email.');
        } else {
          Alert.alert('Error', error.message);
        }
      } else if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'Something went wrong.');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Pressable className="flex-1 bg-[#E2A809]" onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Section */}
          <View className="mt-[200px] h-[140px]">
            <Text className="text-[40px] font-light text-left ml-10 text-black">
              Recover
            </Text>
            <Text className="text-[25px] text-left ml-10 text-black">
              Password
            </Text>
          </View>

          {/* Form Section */}
          <View
            className="flex-1 bg-white rounded-t-[40px] border border-t-[5px] border-b-[5px]"
            style={{ borderColor: Colors.borderTop }}
          >
            <View className="mt-[160px] items-center px-5">
              <Text
                className="text-[14px] mb-5"
                style={{ color: Colors.subText }}
              >
                Enter your registered email address
              </Text>

              <TextInput
                className="w-3/4 border border-gray-300 rounded-full bg-white py-3 px-4 mb-5"
                placeholder="Email ID"
                placeholderTextColor="#aaa"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />

              <TouchableOpacity
                className="bg-[#E2A809] py-4 px-16 rounded-full flex-row items-center justify-center"
                onPress={handleRecover}
              >
                <Text className="text-black text-[16px] font-light">
                  Send Recovery Link
                </Text>
                <MaterialCommunityIcons
                  name="link"
                  size={20}
                  color="black"
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>

              <Text className="text-[14px] text-center mt-3 text-black">
                We will send a recovery link to your registered email address.
              </Text>
            </View>
          </View>
        </ScrollView>
      </Pressable>
    </KeyboardAvoidingView>
  );
}
