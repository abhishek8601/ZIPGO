import Colors from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import {
  Platform,
  Keyboard,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Teacher {
  teacher_id: number;
  full_name: string;
  subject?: string;
  phone?: string;
  email?: string;
}

export default function TeachersList() {
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const API_URL = Constants.expoConfig.extra.apiUrl;

  const fetchTeachers = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_URL}/teacher-list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setTeachers(data.data);
      } else {
        setTeachers([]);
      }
    } catch (err) {
      console.error('Error fetching teachers:', err);
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  if (Platform.OS === 'web') (document.activeElement as HTMLElement)?.blur();
  else Keyboard.dismiss();

  const toggleSelectTeacher = (id: string) => {
    let updated = selectedTeachers.includes(id)
      ? selectedTeachers.filter(t => t !== id)
      : [...selectedTeachers, id];
    setSelectedTeachers(updated);
    setSelectAll(updated.length === teachers.length);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedTeachers([]);
      setSelectAll(false);
    } else {
      setSelectedTeachers(teachers.map(t => t.teacher_id.toString()));
      setSelectAll(true);
    }
  };

  const sendNotificationToSelected = () => {
    if (selectedTeachers.length === 0) {
      alert("No teachers selected!");
      return;
    }
    const selectedList = teachers.filter(t => selectedTeachers.includes(t.teacher_id.toString()));
    const names = selectedList.map(t => t.full_name).join(", ");
    alert(`Notifications sent to: ${names}`);
  };

  return (
    <SafeAreaView className="flex-1 mt-2 bg-gray-100">
      {/* Header */}
      <View className="flex-row items-center p-3 h-14 mb-2" style={{ backgroundColor: Colors.primary }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-white text-base font-normal ml-2">Teachers List</Text>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#dc961b" />
          <Text className="mt-2">Loading teachers...</Text>
        </View>
      ) : (
        <FlatList
          data={teachers}
          keyExtractor={item => item.teacher_id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
          ListHeaderComponent={
            <TouchableOpacity className="flex-row items-center px-5 mb-3 mt-2" onPress={toggleSelectAll}>
              <View className="w-4 h-4 rounded-full border border-yellow-600 mr-2 items-center justify-center">
                {selectAll && <View className="w-2 h-2 rounded-full bg-yellow-600" />}
              </View>
              <Text className="text-black text-sm">Select All</Text>
            </TouchableOpacity>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/profiles/teacherProfile',
                  params: {
                    teacher_id: item.teacher_id.toString(),
                    full_name: item.full_name,
                    subject: item.subject ?? '',
                    phone: item.phone ?? '',
                    email: item.email ?? '',
                  },
                })
              }
              activeOpacity={0.8}
            >
              <View className="flex-row items-center p-4 mb-3 mx-4 rounded-xl" style={{
                backgroundColor: '#FFF9E6',
                elevation: 2,
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 2 },
              }}>
                {/* Checkbox */}
                <TouchableOpacity onPress={() => toggleSelectTeacher(item.teacher_id.toString())}>
                  <View className="w-5 h-5 rounded-full border border-yellow-700 mr-3 items-center justify-center" style={{ borderWidth: 2 }}>
                    {selectedTeachers.includes(item.teacher_id.toString()) && (
                      <View className="w-3 h-3 rounded-full bg-yellow-700" />
                    )}
                  </View>
                </TouchableOpacity>

                {/* Teacher Image */}
                <Image source={require('@/assets/images/profile.png')} style={{ width: 55, height: 55, borderRadius: 30, marginRight: 12 }} />

                {/* Details */}
                <View className="flex-1">
                  <Text className="text-black text-sm font-semibold">{item.full_name}</Text>
                  {item.subject && <Text className="text-gray-700 text-[10px] italic">Designation: {item.subject}</Text>}
                  {item.phone && <Text className="text-black text-[10px] mt-1">{item.phone}</Text>}
                </View>

                {/* Send Notification */}
                <TouchableOpacity className="px-3 py-2 rounded-md" style={{ backgroundColor: '#F9D178' }}
                  onPress={() => alert(`Notification sent to ${item.full_name}`)}>
                  <Text className="text-black text-[10px]">Send Notification</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Bottom Button */}
      <View className="absolute bottom-32 left-5 right-5">
        <TouchableOpacity
          className="flex-row items-center justify-center p-4 rounded-xl"
          style={{ backgroundColor: '#000' }}
          onPress={sendNotificationToSelected}
        >
          <Ionicons name="mail-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text className="text-white text-[11px] font-semibold">SEND TO SELECTED</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
