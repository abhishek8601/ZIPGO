import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';

import {
  FlatList,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Keyboard,
} from 'react-native';
import Colors from '@/constants/colors';
import Header from '@/components/PrimaryHeader';

// ❌ Removed react-native-maps import
// import MapView, { Marker } from 'react-native-maps';

const kids = [
  {
    id: '1',
    name: 'Josephine Phillips',
    image: require('@/assets/images/christmas.png'),
    address: '3065 Bungalow Road, Omaha, NE 68124',
    phone: '402-885-8310',
    dob: 'September 18, 2004',
    distance: '450 meters',
  },
  {
    id: '2',
    name: 'Ryan Bell',
    image: 'https://randomuser.me/api/portraits/men/44.jpg',
    address: '4505 Elm Street, Lincoln, NE 68506',
    phone: '402-999-1234',
    dob: 'May 12, 2005',
    distance: '1.5 km',
  },
];

export default function LiveTracker() {
  const [isLive, setIsLive] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const { user } = useUser();

  // Load react-native-maps ONLY on mobile
  let MapView: any, Marker: any;
  if (Platform.OS !== 'web') {
    const Maps = require('react-native-maps');
    MapView = Maps.default;
    Marker = Maps.Marker;
  }

  const toggleLive = () => setIsLive((prev) => !prev);
  const handlePrev = () =>
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : kids.length - 1));
  const handleNext = () =>
    setActiveIndex((prev) => (prev < kids.length - 1 ? prev + 1 : 0));

  const handleSendAlert = () =>
    Alert.alert('Alert Sent', 'Your alert has been successfully sent!');

  const handleMoreInfo = () => {
    router.push({
      pathname: '../profiles/UserProfileScreen',
      params: { user: encodeURIComponent(JSON.stringify(user)) },
    });
  };

  const handleViewProfile = () => {
    if (!user) {
      Alert.alert('No user data', 'User information not found.');
      return;
    }
    router.push({
      pathname: '../profiles/UserProfileScreen',
      params: { user: encodeURIComponent(JSON.stringify(user)) },
    });
  };

  if (Platform.OS === 'web') {
    (document.activeElement as HTMLElement)?.blur();
  } else {
    Keyboard.dismiss();
  }

  return (
    <View className="bg-white border-b-2 border-yellow-500 w-full h-full">
      <Header user={user} onViewProfile={handleViewProfile} />

      {/* Map Section */}
      <View className="bg-white border-b-4 border-[#042945] w-full">
        {Platform.OS === 'web' ? (
          <div style={{ width: '100%', height: 300 }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.009974397597!2d77.37672378048914!3d28.62075529253369!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce56a33b4ae11%3A0x469d5f902777b62e!2sYour%20Location!5e0!3m2!1sen!2sin!4v1699900000000!5m2!1sen!2sin"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
          </div>
        ) : (
          <MapView
            style={{ width: '100%', height: 300 }}
            initialRegion={{
              latitude: 28.620755,
              longitude: 77.376724,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{ latitude: 28.620755, longitude: 77.376724 }}
              title="Your Location"
              description="Live tracking location"
            />
          </MapView>
        )}
      </View>

      {/* Live Status Section */}
      <View className="p-1">
        <View className="flex-row items-center justify-between mb-1">
          <TouchableOpacity
            className={`flex-row items-center px-3 py-1 rounded-full ${
              isLive ? 'bg-green-600' : 'bg-gray-400'
            }`}
            onPress={toggleLive}
          >
            <Image
              source={require('@/assets/images/play.png')}
              style={{ width: 32, height: 32 }}
            />
            <Text className="text-white font-bold ml-2">
              {isLive ? 'Live' : 'Offline'}
            </Text>
          </TouchableOpacity>

          <Text className="text-[10px] text-center font-normal ml-2">
            The next destination is 500 meters ahead
          </Text>
        </View>

        {/* Carousel */}
        <View className="mb-0 flex-2 bg-white rounded-2xl border border-gray-300">
          <View className="flex-row items-center justify-around h-24 w-[350px] mx-5 my-2">
            <TouchableOpacity onPress={handlePrev}>
              <MaterialIcons name="arrow-back-ios" size={30} color="#F4A300" />
            </TouchableOpacity>

            <View className="flex-row space-x-5">
              <Image
                source={require('@/assets/images/kid1.jpeg')}
                style={{
                  width: 75,
                  height: 75,
                  borderRadius: 65,
                  borderWidth: 3,
                  borderColor: Colors.borderTop,
                  marginHorizontal: 5,
                }}
              />
              <Image
                source={require('@/assets/images/kid2.png')}
                style={{
                  width: 75,
                  height: 75,
                  borderRadius: 65,
                  borderWidth: 3,
                  borderColor: Colors.borderTop,
                  marginHorizontal: 5,
                }}
              />
            </View>

            <TouchableOpacity onPress={handleNext}>
              <MaterialIcons
                name="arrow-forward-ios"
                size={30}
                color="#F4A300"
              />
            </TouchableOpacity>
          </View>

          <View className="items-center px-5">
            <Text className="text-[15px] font-bold mb-1">
              {kids[activeIndex].name}
            </Text>
            <Text className="text-[10px] text-center mb-1">
              Address: {kids[activeIndex].address}
            </Text>
            <Text className="text-[10px] text-center mb-1">
              Phone: {kids[activeIndex].phone}
            </Text>
            <Text className="text-[10px] text-center mb-2">
              DOB: {kids[activeIndex].dob}
            </Text>
          </View>
        </View>

        {/* Destination List */}
        <FlatList
          data={kids}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="mt-5 flex-row items-center bg-red rounded-xl h-12 mx-1 my-1 p-2">
              <Image
                source={require('@/assets/images/kid1.jpeg')}
                style={{ width: 40, height: 40, borderRadius: 8 }}
              />
              <Text className="flex-1 text-[10px] ml-2">
                📍 Destination {item.distance} ahead
              </Text>

              <TouchableOpacity
                className="bg-[#042945] px-2 py-1 rounded-lg mr-2"
                onPress={handleMoreInfo}
              >
                <Text className="text-white text-[10px]">More Info</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-black px-2 py-1 rounded-lg"
                onPress={handleSendAlert}
              >
                <Text className="text-white text-[10px]">Send Alert</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        {/* Student List Link */}
        <TouchableOpacity onPress={() => router.push('/studentslist')}>
          <Text className="text-blue-500 underline text-[10px] text-center">
            See full student list
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
