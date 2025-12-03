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

interface Person {
  id: string;
  name: string;
  role?: string; // Teacher / Coordinator / Parent
  relation?: string; // For parents
  mobile?: string;
  qualification?: string;
  imageUrl?: string;
}

export default function AllPeopleList() {
  const router = useRouter();
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const API_URL = Constants.expoConfig.extra.apiUrl;

  useEffect(() => {
    if (Platform.OS === 'web') (document.activeElement as HTMLElement)?.blur();
    else Keyboard.dismiss();

    fetchPeople();
  }, []);

  const fetchPeople = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('❌ Token not found');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log('AllPeople API Response:', data);

      if (data.success && Array.isArray(data.data)) {
        const list: Person[] = data.data.map((p: any, index: number) => ({
          id: p.id?.toString() ?? index.toString(),
          name: p.name || p.full_name,
          role: p.role || p.type, // Teacher / Coordinator / Parent
          mobile: p.mobile || p.phone,
          qualification: p.qualification,
          relation: p.relation,
          imageUrl: p.imageUrl || 'https://i.pravatar.cc/150?img=13',
        }));

        setPeople(list);

        if (selectAll) setSelectedPeople(list.map((p) => p.id));
      } else {
        setPeople([]);
      }
    } catch (error) {
      console.error('❌ Error fetching people:', error);
      setPeople([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectAll(false);
      setSelectedPeople([]);
    } else {
      setSelectAll(true);
      setSelectedPeople(people.map((p) => p.id));
    }
  };

  const toggleSelectPerson = (id: string) => {
    let updated = [];
    if (selectedPeople.includes(id)) {
      updated = selectedPeople.filter((x) => x !== id);
    } else {
      updated = [...selectedPeople, id];
    }
    setSelectedPeople(updated);
    setSelectAll(updated.length === people.length);
  };

  const sendToSelected = () => {
    if (selectedPeople.length === 0) {
      alert('No people selected!');
      return;
    }
    const selectedNames = people
      .filter((p) => selectedPeople.includes(p.id))
      .map((p) => p.name)
      .join(', ');

    alert(`Notifications sent to: ${selectedNames}`);
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
          All People List
        </Text>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#dc961b" />
          <Text className="mt-2">Loading...</Text>
        </View>
      ) : (
        <View className="flex-1">
          <FlatList
            data={people}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 150 }}
            ListHeaderComponent={
              <TouchableOpacity
                className="flex-row items-center px-5 mb-3 mt-2"
                onPress={toggleSelectAll}
              >
                <View
                  className="w-4 h-4 rounded-full border border-yellow-600 mr-2 items-center justify-center"
                >
                  {selectAll && <View className="w-2 h-2 rounded-full bg-yellow-600" />}
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
                <TouchableOpacity onPress={() => toggleSelectPerson(item.id)}>
                  <View
                    className="w-5 h-5 rounded-full border border-yellow-700 mr-3 items-center justify-center"
                    style={{ borderWidth: 2 }}
                  >
                    {selectedPeople.includes(item.id) && (
                      <View className="w-3 h-3 rounded-full bg-yellow-700" />
                    )}
                  </View>
                </TouchableOpacity>

                {/* Image */}
                <Image
                  source={{ uri: item.imageUrl }}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    marginRight: 12,
                  }}
                />

                {/* Details */}
                <View className="flex-1">
                  <Text className="text-black text-sm font-semibold">{item.name}</Text>
                  {item.role && (
                    <Text className="text-gray-700 text-[10px] italic">
                      {item.role}
                    </Text>
                  )}
                  {item.relation && (
                    <Text className="text-gray-700 text-[10px] italic">
                      Relation: {item.relation}
                    </Text>
                  )}
                  {item.mobile && (
                    <Text className="text-black text-[10px] mt-1">Ph: {item.mobile}</Text>
                  )}
                  {item.qualification && (
                    <Text className="text-black text-[10px] mt-1">
                      Education: {item.qualification}
                    </Text>
                  )}
                </View>

                {/* Notification button */}
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

          {/* Bottom BUTTON - SEND SELECTED */}
          <View className="absolute bottom-32 left-5 right-5">
            <TouchableOpacity
              className="flex-row items-center justify-center p-4 rounded-xl"
              style={{ backgroundColor: '#000' }}
              onPress={sendToSelected}
            >
              <Ionicons name="mail-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text className="text-white text-[11px] font-semibold">
                SEND TO SELECTED
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
