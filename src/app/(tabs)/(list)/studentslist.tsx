import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '@/firebase/config';
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
import { collection, getDocs } from 'firebase/firestore';
import Colors from '@/constants/colors';

interface StudentsList {
  studentId: string;
  fullName: string;
  class: string;
  father?: string;
  mother?: string;
  imageUrl?: string;
  phoneNumber?: string;
}

export default function StudentsList() {
  const router = useRouter();
  const [students, setStudents] = useState<StudentsList[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  if (Platform.OS === 'web') {
    (document.activeElement as HTMLElement)?.blur();
  } else {
    Keyboard.dismiss();
  }

  const handleImagePress = (item: StudentsList) => {
    router.push({
      pathname: '/profiles/StudentProfileScreen',
      params: {
        id: item.studentId,
        fullName: item.fullName,
        imageUrl: item.imageUrl,
        father: item.father || '',
        mother: item.mother || '',
        class: item.class || '',
        mobile: item.phoneNumber || '',
      },
    });
  };

  const handleSendAlert = () => {
    alert('📩 Alert sent to all students!');
  };

  // 🔹 Fetch students
  const fetchStudents = async () => {
    try {
      const studentsCollection = collection(db, 'studentslist');
      const snapshot = await getDocs(studentsCollection);
      const studentsList: StudentsList[] = snapshot.docs.map((doc) => ({
        studentId: doc.id,
        ...doc.data(),
      })) as StudentsList[];
      setStudents(studentsList);
    } catch (error) {
      console.error('❌ Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <SafeAreaView className="flex-1 mt-2 bg-gray-100">
      {/* Header */}
      <View
        className="flex-row items-center h-[55px] mb-2 px-3"
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
        <Text className="text-[15px] text-white ml-2">Students List</Text>
      </View>

      {/* Loader */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#dc961bff" />
          <Text className="mt-2">Loading students...</Text>
        </View>
      ) : (
        <View className="flex-1">
          <FlatList
            data={students}
            keyExtractor={(item) => item.studentId}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
            ListHeaderComponent={
              <View className="flex-row items-center px-5 mb-3 mt-2">
                <View className="w-4 h-4 rounded-full border border-yellow-600 mr-2" />
                <Text className="text-black text-sm">Select all</Text>
              </View>
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
                <View
                  className="w-5 h-5 rounded-full border border-yellow-700 mr-3"
                  style={{ borderWidth: 2 }}
                />

                {/* Student Image */}
                <TouchableOpacity onPress={() => handleImagePress(item)}>
                  <Image
                    source={
                      item.imageUrl
                        ? { uri: item.imageUrl }
                        : require('@/assets/images/profile.png')
                    }
                    style={{
                      width: 55,
                      height: 55,
                      borderRadius: 30,
                      marginRight: 12,
                    }}
                  />
                </TouchableOpacity>

                {/* Name + class */}
                <View className="flex-1">
                  <Text className="text-black text-sm font-semibold">
                    {item.fullName}
                  </Text>

                  {item.class && (
                    <Text className="text-gray-700 text-[10px] italic">
                      Class: {item.class}
                    </Text>
                  )}

                  {item.phoneNumber && (
                    <Text className="text-black text-[10px] mt-1">
                      Ph: {item.phoneNumber}
                    </Text>
                  )}
                </View>

                {/* Send Notification Button */}
                <TouchableOpacity
                  className="px-3 py-2 rounded-md"
                  style={{ backgroundColor: '#F9D178' }}
                  onPress={() =>
                    alert(`Notification sent to ${item.fullName}`)
                  }
                >
                  <Text className="text-black text-[10px]">
                    Send Notification
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <Text className="text-center text-gray-500 mt-12">
                No students found
              </Text>
            }
          />

          {/* Bottom Button */}
          <View className="absolute bottom-32 left-5 right-5">
            <TouchableOpacity
              className="flex-row items-center justify-center p-4 rounded-xl"
              style={{ backgroundColor: '#000' }}
              onPress={handleSendAlert}
            >
              <Ionicons
                name="mail-outline"
                size={20}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text className="text-white text-[11px] font-semibold">
                SEND NOTIFICATION TO ALL
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
