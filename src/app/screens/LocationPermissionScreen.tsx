import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import Colors from '@/constants/colors';
import {
  Alert,
  Image,
  Keyboard,
  Linking,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LocationPermissionScreen() {
  const router = useRouter();

  // Check permission on mount
  useEffect(() => {
    checkPermission();
  }, []);

  if (Platform.OS === 'web') {
    (document.activeElement as HTMLElement)?.blur();
  } else {
    Keyboard.dismiss();
  }

  const checkPermission = async () => {
    try {
      const { status, canAskAgain } = await Location.getForegroundPermissionsAsync();

      if (status === 'granted') {
        router.replace('/screens/LoginScreen');
      } else if (status === 'denied' && !canAskAgain) {
        Alert.alert(
          'Permission Blocked',
          'Location permission is blocked. Please enable it from settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
      }
    } catch (err) {
      console.error('Error checking location permission:', err);
    }
  };

  const requestPermission = async () => {
    try {
      const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        router.replace('./src/screens/LoginScreen');
      } else {
        if (canAskAgain) {
          Alert.alert(
            'Location Permission Required',
            'We need your location to continue. Please allow location access.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Try again', onPress: () => requestPermission() },
            ]
          );
        } else {
          Alert.alert(
            'Permission Blocked',
            'Location permission is blocked. Please enable it from settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ]
          );
        }
      }
    } catch (err) {
      console.error('Error requesting location permission:', err);
      Alert.alert('Error', 'An error occurred while requesting permission');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black border-b-[5px]" style={{ borderBottomColor: Colors.primary }}>
      {/* Top Yellow Bar */}
      <View className="flex-[2] bg-[#E2A809]" />

      <View className="flex-[8] -mt-12 bg-black rounded-t-[50px] items-center pt-16 px-1">
        <MaterialIcons name="location-on" size={32} color="rgb(226, 168, 9)" />
        <Text className="text-white text-[15px] font-semibold mb-6">Allow your location</Text>

        <View className="flex-row justify-evenly w-full mb-6">
          <TouchableOpacity className="items-center">
            <Image
              source={require('@/assets/images/map2.jpg')}
              style={{
                marginTop: 210,
                width: 130,
                height: 130,
                borderRadius: 70,
                borderWidth: 2,
                borderColor: Colors.mapBorder,
              }}
            />
            <Text className="text-white mt-2 text-xs">Precise</Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center">
            <Image
              source={require('@/assets/images/map1.jpg')}
              style={{
                marginTop: 210,
                width: 130,
                height: 130,
                borderRadius: 70,
                borderWidth: 2,
                borderColor: Colors.mapBorder,
              }}
            />
            <Text className="text-white mt-2 text-xs">Approximate</Text>
          </TouchableOpacity>
        </View>

        <View className="w-4/5 items-center">
          <TouchableOpacity
            className="bg-transparent rounded-[10px] my-2 w-4/5 py-3 items-center border-t-[1.5px] border-l border-r"
            style={{ borderColor: Colors.primary }}
            onPress={requestPermission}
          >
            <Text className="text-white text-[13px] font-medium">While using the app</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-transparent rounded-[10px] my-2 w-4/5 py-3 items-center border-t-[1.5px] border-l border-r"
            style={{ borderColor: Colors.primary }}
            onPress={requestPermission}
          >
            <Text className="text-white text-[13px] font-medium">Only this time</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-transparent rounded-[10px] my-2 w-4/5 py-3 items-center border-t-[1.5px] border-l border-r"
            style={{ borderColor: Colors.primary }}
            onPress={() =>
              Alert.alert('Permission Denied', 'You chose not to allow location access.')
            }
          >
            <Text className="text-white text-[13px] font-medium">Don’t allow</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
