import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Alert, Image, Keyboard, Platform, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import Colors from '@/constants/colors';
import Header from '@/components/PrimaryHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';



type AlertCardProps = {
  label: string;
  role: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
  iconColor: string;
};

function AlertCard({ label, role, icon, color, iconColor }: AlertCardProps) {
  return (
    <View className="flex-row items-center justify-between rounded-lg border border-gray-100 m-2" style={{ backgroundColor: color, width: 150, height: 75 }}>
      <View className="w-10 h-10 bg-white rounded-full justify-center items-center m-1">
        <MaterialIcons name={icon} size={25} color={iconColor} />
      </View>

      <View className="flex-1 justify-center ml-2">
        <Text className="text-[7px] text-gray-500">{label}</Text>
        <Text className="text-[9px] font-medium pl-0.5">{role}</Text>
      </View>

      <View className="absolute bottom-0 right-0 bg-white rounded-lg p-1 shadow">
        <Ionicons name="mail-outline" size={18} color="#333" />
      </View>
    </View>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const { user } = useUser();
  const [locationGranted, setLocationGranted] = useState<boolean | null>(null);
  const { user: userParam } = useLocalSearchParams();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { setUser } = useUser();

  // const handleLogout = async () => {
  //   await AsyncStorage.removeItem('user'); // remove token
  //   setUser(null);                           // clear user context
  //   router.replace('/screens/LoginScreen');  // navigate to login
  // };

  if (Platform.OS === 'web') {
    (document.activeElement as HTMLElement)?.blur();
  } else {
    Keyboard.dismiss();
  }

  useEffect(() => {
    const requestPermission = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        setLocationGranted(status === 'granted');
      } catch (error) {
        console.error('Error requesting location permission:', error);
      }
    };
    requestPermission();
  }, []);

  const handleViewProfile = () => {
    if (!user) return Alert.alert('No user data', 'User information not found.');
    router.push({
      pathname: '../profiles/UserProfileScreen',
      params: { user: encodeURIComponent(JSON.stringify(user)) },
    });
  };

  const handleSendAlertbutton = () => {
    alert('🚨 Alert sent to all!');
    setSelectedImage(null);
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
      alert('📎 Image attached successfully!');
    }
  };

  return (
    <View className="flex-1 bg-white border-b-4 border-yellow-400">
      <Header user={user} onViewProfile={handleViewProfile} />
      <StatusBar barStyle="dark-content" />

      <View className="mx-2 flex-1">
        {/* Profile */}
        <View className="items-center mt-6">
          <View className="w-48 h-48 rounded-full justify-center items-center"
            style={{ borderWidth: 1, borderColor: Colors.lighttertiary }}>

            <View className="w-40 h-40 rounded-full justify-center items-center"
              style={{ borderWidth: 2, borderColor: Colors.lighttertiary }}>
              <View className="w-32 h-32 rounded-full justify-center items-center"
                style={{ borderWidth: 1, borderColor: Colors.gray }}>
                <View className="w-30 h-30 rounded-full justify-center items-center"
                  style={{ borderWidth: 4, borderColor: Colors.secondrycolor }}>
                  <Image
                    source={require('@/assets/images/profile1.jpg')}
                    style={{ width: 100, height: 100, borderRadius: 100 }}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>

        <View className="items-center mt-4">
          <Text className="text-base font-semibold text-gray-800">Hi, {user?.name || 'User'}</Text>
          <Text className="text-xs italic text-gray-500">Next, the stop is yours.</Text>
          <Text className="text-xs italic text-gray-500">So, being prepared to go home.</Text>
          <TouchableOpacity onPress={handleViewProfile}>
            <Text className="text-blue-500 font-normal text-sm mt-1">
              More info about <Text>{user?.name || 'User'} ➤</Text>
            </Text>
          </TouchableOpacity>
          {/* Add Logout Button Here */}
          {/* <TouchableOpacity
            onPress={handleLogout}
            style={{
              backgroundColor: 'red',
              paddingVertical: 10,
              paddingHorizontal: 25,
              borderRadius: 20,
              marginTop: 15,
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>
              Logout
            </Text>
          </TouchableOpacity> */}

        </View>

        {/* Alert Cards */}
        <View className="mt-4">
          <View className="flex-row justify-center mb-4">
            <TouchableOpacity onPress={() => router.push('/teacherslist')}>
              <AlertCard label="Send alert to class" role="Teacher" icon="person" color="#FBF9D1" iconColor="#28a745" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/parents')}>
              <AlertCard label="Send alert to kid's" role="Parents" icon="people" color="#F8EDED" iconColor="#6c757d" />
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center mb-4">
            <TouchableOpacity onPress={() => router.push('/coordinator')}>
              <AlertCard label="Send alert to school’s" role="Coordinator" icon="laptop" color="#FFE5CA" iconColor="#fd7e14" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/emergency')}>
              <AlertCard label="In an emergency?" role="Dial 911" icon="warning" color="#A8F1FF" iconColor="#ffc107" />
            </TouchableOpacity>
          </View>
        </View>

      
        <View className="flex-row justify-center mt-2">
          <TouchableOpacity className="flex-row items-center bg-black rounded-xl w-80 h-10 justify-center">
            {/* Attach Image */}
            <TouchableOpacity onPress={pickImage} className="bg-black h-10 justify-center items-center rounded-l-xl px-3">
              <Ionicons name="attach" size={24} color="#fff" />
            </TouchableOpacity>

            {/* Navigate to People List */}
            <Text
              onPress={() => router.push({
                pathname: '/profiles/allPeopleList',  // New screen
                params: { image: selectedImage || null }
              })}
              className="text-white text-xs font-normal ml-2"
            >
              SEND ALERTS TO EVERYONE
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
