import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import Sizes from '@/constants/sizes';

const Header = ({ user, onViewProfile }) => {
  const router = useRouter();

  const handleGoBack = () => {
    router.push('/dashboard');
  };

  const handleCalendar = () => {
    router.push('/event');
  };

  const handleNotification = () => {
    router.push({
      pathname: '/notification',
      params: { user: encodeURIComponent(JSON.stringify(user)) },
    });
  };

  return (
    <View
      className="flex-row items-center mt-12 px-6"
      style={{ height: Sizes.header, backgroundColor: Colors.secondrycolor }}
    >
      <TouchableOpacity onPress={handleGoBack}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity onPress={onViewProfile} className="ml-1 mr-2">
        <Image
          source={require('@/assets/images/userprofile.png')}
          className="w-8 h-8 rounded-full border-3"
          style={{ borderColor: Colors.white }}
        />
      </TouchableOpacity>

      <Text
        className="text-xs font-normal flex-1 text-black ml-1"
        style={{ color: Colors.textPrimary }}
      >
        Hi, {user?.name || 'User'}
      </Text>

      <TouchableOpacity
        onPress={handleCalendar}
        className="w-8 h-8 mr-2 bg-white rounded-full p-1 flex items-center justify-center"
      >
        <Image
          source={require('@/assets/images/calendar.png')}
          className="w-5 h-5"
        />
      </TouchableOpacity>
      {/* Notification Icon */}
      <TouchableOpacity
        onPress={handleNotification}
        className="w-8 h-8 mr-6 bg-white rounded-full p-1 flex items-center justify-center"
      >
        <Image
          source={require('@/assets/images/bell.png')}
          className="w-5 h-5"
        />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
