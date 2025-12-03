import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Platform,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import Colors from '@/constants/colors';

interface Parent {
  id: string;
  name: string;
  relation?: string;
  mobile?: string;
  qualification?: string;
  imageUrl?: string;
}

export default function ParentsList() {
  const router = useRouter();
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedParents, setSelectedParents] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const API_URL = Constants.expoConfig.extra.apiUrl;

  useEffect(() => {
    if (Platform.OS === 'web') (document.activeElement as HTMLElement)?.blur();
    else Keyboard.dismiss();

    fetchParents();
  }, []);

  const fetchParents = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const school_id = 1;
      const response = await fetch(`${API_URL}/parent-list?school_id=${school_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        const parentList = data.data.map((p: any, index: number) => ({
          id: p.id?.toString() ?? index.toString(),
          name: p.full_name,
          mobile: p.phone,
          qualification: p.qualification,
          relation: p.relation || '',
          imageUrl: p.imageUrl || 'https://i.pravatar.cc/150?img=8',
        }));

        setParents(parentList);

        if (selectAll) {
          setSelectedParents(parentList.map((p) => p.id));
        }
      } else {
        setParents([]);
      }
    } catch (error) {
      setParents([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectAll(false);
      setSelectedParents([]);
    } else {
      setSelectAll(true);
      setSelectedParents(parents.map((p) => p.id));
    }
  };

  const toggleSelectParent = (id: string) => {
    const updated = selectedParents.includes(id)
      ? selectedParents.filter((x) => x !== id)
      : [...selectedParents, id];

    setSelectedParents(updated);
    setSelectAll(updated.length === parents.length);
  };

  const sendToSelected = () => {
    if (selectedParents.length === 0) {
      alert('No parents selected!');
      return;
    }

    const selectedNames = parents
      .filter((p) => selectedParents.includes(p.id))
      .map((p) => p.name)
      .join(', ');

    alert(`Notifications sent to: ${selectedNames}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">

      {/* HEADER */}
      <View
        className="flex-row items-center h-[60px] px-5"
        style={{ backgroundColor: Colors.primary }}
      >
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) router.back();
            else router.push('/dashboard');
          }}
        >
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text className="text-white text-lg font-semibold ml-4">Parents List</Text>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text className="mt-2 text-gray-600">Loading parents...</Text>
        </View>
      ) : (
        <View className="flex-1">

          <FlatList
            data={parents}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}

            ListHeaderComponent={
              <TouchableOpacity
                className="flex-row items-center px-6 mt-3 mb-2"
                onPress={toggleSelectAll}
              >
                <View
                  className={`w-5 h-5 rounded-xl border-2 mr-3 flex items-center justify-center 
                  ${selectAll ? 'border-yellow-600 bg-yellow-600' : 'border-gray-400 bg-white'}`}
                >
                  {selectAll && (
                    <Ionicons name="checkmark" size={15} color="#fff" />
                  )}
                </View>

                <Text className="text-gray-800 font-medium text-sm">Select All</Text>
              </TouchableOpacity>
            }

            renderItem={({ item }) => (
              <View
                className="flex-row items-center mx-4 mb-4 p-4 rounded-xl bg-white"
                style={{
                  elevation: 2,
                  shadowColor: '#000',
                  shadowOpacity: 0.08,
                  shadowRadius: 4,
                }}
              >
                {/* Checkbox */}
                <TouchableOpacity onPress={() => toggleSelectParent(item.id)}>
                  <View
                    className={`w-5 h-5 rounded-xl border-2 mr-4 flex items-center justify-center
                    ${selectedParents.includes(item.id) ? 'border-yellow-600 bg-yellow-600' : 'border-gray-400 bg-white'}`}
                  >
                    {selectedParents.includes(item.id) && (
                      <Ionicons name="checkmark" size={15} color="#fff" />
                    )}
                  </View>
                </TouchableOpacity>

                {/* Parent Image */}
                <Image
                  source={{ uri: item.imageUrl }}
                  className="w-14 h-14 rounded-full mr-4"
                />

                {/* Parent Details */}
                <TouchableOpacity
                  className="flex-1"
                  onPress={() =>
                    router.push({
                      pathname: '/profiles/parentsProfile',
                      params: { ...item },
                    })
                  }
                >
                  <Text className="text-black text-base font-semibold">{item.name}</Text>

                  {item.relation ? (
                    <Text className="text-gray-500 text-xs mt-1">
                      Relation: {item.relation}
                    </Text>
                  ) : null}

                  {item.mobile ? (
                    <Text className="text-gray-700 text-xs mt-1">
                      📞 {item.mobile}
                    </Text>
                  ) : null}

                  {item.qualification ? (
                    <Text className="text-gray-700 text-xs mt-1">
                      🎓 {item.qualification}
                    </Text>
                  ) : null}
                </TouchableOpacity>

                {/* Send Button */}
                <TouchableOpacity
                  className="px-3 py-2 rounded-md"
                  style={{ backgroundColor: '#FFE29A' }}
                  onPress={() => alert(`Notification sent to ${item.name}`)}
                >
                  <Text className="text-xs font-medium text-black">Send Notification</Text>
                </TouchableOpacity>
              </View>
            )}

            ListEmptyComponent={
              <Text className="text-center text-gray-500 mt-10">
                No parents found
              </Text>
            }
          />

          {/* SEND TO SELECTED BUTTON */}
          <View className="absolute bottom-32 left-5 right-5">
            <TouchableOpacity
              className="flex-row items-center justify-center py-4 rounded-xl"
              style={{ backgroundColor: Colors.black }}
              onPress={sendToSelected}
            >
              <Ionicons name="send" size={18} color="#fff" className="mr-2" />
              <Text className="text-white text-sm font-semibold">
                SEND TO SELECTED
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
