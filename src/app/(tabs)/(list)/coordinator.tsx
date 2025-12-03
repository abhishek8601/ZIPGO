import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import Colors from '@/constants/colors';

interface Coordinator {
  id: string;
  name: string;
  role?: string;
  mobile?: string;
  imageUrl?: string;
  qualification?: string;
}

export default function CoordinatorsList() {
  const router = useRouter();

  const [coordinators, setCoordinators] = useState<Coordinator[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCoordinators, setSelectedCoordinators] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const API_URL = Constants.expoConfig.extra.apiUrl; // Your API base URL

  useEffect(() => {
    if (Platform.OS === 'web') (document.activeElement as HTMLElement)?.blur();
    else Keyboard.dismiss();

    fetchCoordinators();
  }, []);

  const fetchCoordinators = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('❌ Token not found');
        setLoading(false);
        return;
      }

      // Fetch coordinators via GET
      const response = await fetch(`${API_URL}/coordinator-list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log('Coordinator API Response:', data);

      if (data.success && Array.isArray(data.data)) {
        const coordinatorList = data.data.map((c: any, index: number) => ({
          id: c.id?.toString() ?? index.toString(),
          name: c.full_name,
          role: c.role || '',
          mobile: c.phone || '',
          qualification: c.qualification || '',
          imageUrl: c.imageUrl || 'https://i.pravatar.cc/150?img=4', // fallback dummy image
        }));

        setCoordinators(coordinatorList);

        if (selectAll) {
          setSelectedCoordinators(coordinatorList.map((c) => c.id));
        }
      } else {
        console.error('❌ Invalid data format', data);
        setCoordinators([]);
      }
    } catch (error) {
      console.error('❌ Error fetching coordinators:', error);
      setCoordinators([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectAll(false);
      setSelectedCoordinators([]);
    } else {
      setSelectAll(true);
      setSelectedCoordinators(coordinators.map((c) => c.id));
    }
  };

  const toggleSelectCoordinator = (id: string) => {
    let updatedList = [];
    if (selectedCoordinators.includes(id)) {
      updatedList = selectedCoordinators.filter((x) => x !== id);
    } else {
      updatedList = [...selectedCoordinators, id];
    }
    setSelectedCoordinators(updatedList);

    if (updatedList.length === coordinators.length) setSelectAll(true);
    else setSelectAll(false);
  };

  const sendToSelected = () => {
    if (selectedCoordinators.length === 0) {
      alert("No coordinators selected!");
      return;
    }
    const list = coordinators.filter((c) => selectedCoordinators.includes(c.id));
    const names = list.map((c) => c.name).join(", ");
    alert(`Notifications sent to: ${names}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">

      {/* Header */}
      <View
        className="flex-row items-center mt-2 h-[55px] mb-2 pl-5 px-3"
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

        <Text className="text-[15px] font-normal text-white ml-4">
          Coordinators List
        </Text>
      </View>

      {/* Loader */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#dc961b" />
          <Text className="mt-2">Loading coordinators...</Text>
        </View>
      ) : (
        <View className="flex-1">
          <FlatList
            data={coordinators}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 150 }}

            ListHeaderComponent={
              <TouchableOpacity
                className="flex-row items-center px-5 mb-3 mt-2"
                onPress={toggleSelectAll}
              >
                <View
                  className="w-4 h-4 rounded-xl border border-yellow-600 mr-2 items-center justify-center"
                >
                  {selectAll && (
                    <View className="w-2 h-2 rounded-full bg-yellow-600" />
                  )}
                </View>
                <Text className="text-black text-sm">Select all</Text>
              </TouchableOpacity>
            }

            renderItem={({ item }) => (
              <View
                className="flex-row items-center p-4 mb-3 mx-4 rounded-xl"
                style={{
                  backgroundColor: '#FFF9E6',
                  elevation: 2,
                  shadowColor: '#000',
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  shadowOffset: { width: 0, height: 2 },
                }}
              >
                {/* Checkbox */}
                <TouchableOpacity onPress={() => toggleSelectCoordinator(item.id)}>
                  <View
                    className="w-5 h-5 rounded-full border border-yellow-700 mr-3 items-center justify-center"
                    style={{ borderWidth: 2 }}
                  >
                    {selectedCoordinators.includes(item.id) && (
                      <View className="w-3 h-3 rounded-full bg-yellow-700" />
                    )}
                  </View>
                </TouchableOpacity>

                {/* Image */}
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: '/profiles/coordinatorProfile',
                      params: {
                        id: item.id,
                        name: item.name,
                        mobile: item.mobile,
                        role: item.role,
                        qualification: item.qualification,
                        imageUrl: item.imageUrl,
                      },
                    })
                  }
                >
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={{
                      width: 55,
                      height: 55,
                      borderRadius: 28,
                      marginRight: 12,
                    }}
                  />
                </TouchableOpacity>

                {/* Details */}
                <View className="flex-1">
                  <Text className="text-black text-sm font-semibold">{item.name}</Text>
                  {item.role && (
                    <Text className="text-gray-700 text-[10px] italic">Role: {item.role}</Text>
                  )}
                  {item.mobile && (
                    <Text className="text-black text-[10px] mt-1">Ph: {item.mobile}</Text>
                  )}
                   {item.qualification && (
                    <Text className="text-black text-[10px] mt-1">Ql: {item.qualification}</Text>
                  )}
                </View>

                {/* Notification Button */}
                <TouchableOpacity
                  className="px-3 py-2 rounded-md"
                  style={{ backgroundColor: '#F9D178' }}
                  onPress={() => alert(`Notification sent to ${item.name}`)}
                >
                  <Text className="text-black text-[10px]">Send Notification</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          {/* Bottom SEND SELECTED Button */}
          <View className="absolute bottom-32 left-5 right-5">
            <TouchableOpacity
              className="flex-row items-center justify-center p-4 rounded-xl"
              style={{ backgroundColor: '#000' }}
              onPress={sendToSelected}
            >
              <Ionicons name="mail-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text className="text-white text-[11px] font-semibold">SEND TO SELECTED</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
