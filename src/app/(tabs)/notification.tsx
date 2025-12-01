import { Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import {
  Image,
  Keyboard,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import Colors from '@/constants/colors';
import Header from '@/components/PrimaryHeader';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '@/firebase/config';
import { query, collection, orderBy, onSnapshot } from 'firebase/firestore';

interface Teacher {
  teacher_id: number;
  full_name: string;
  subject?: string;
  phone?: string;
  email?: string;
  last_message?: string;
  last_message_time?: string;  // example: "2 min ago"
}

export default function NotificationScreen() {
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const API_URL = Constants.expoConfig.extra.apiUrl;
  const [lastMessages, setLastMessages] = useState<{ [key: string]: any }>({});
  const [coordinatorMessages, setCoordinatorMessages] = useState<{ [key: string]: any }>({});
  const { user } = useUser();

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

      const json = await res.json();
      if (json.success && Array.isArray(json.data)) setTeachers(json.data);
      else setTeachers([]);
    } catch (err) {
      console.error('Error fetching teachers:', err);
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    if (teachers.length === 0) return;

    teachers.forEach((teacher) => {
      const chatId = `teacher_${teacher.teacher_id}`;

      const q = query(
        collection(db, "chats", chatId, "messages"),
        orderBy("timestamp", "desc")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const msg = snapshot.docs[0].data();

          setLastMessages((prev) => ({
            ...prev,
            [chatId]: {
              text: msg.text,
              time: msg.timestamp
                ? new Date(msg.timestamp.toDate()).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
                : "",
            },
          }));
        } else {
          // No messages for this chat
          setLastMessages((prev) => ({
            ...prev,
            [chatId]: null,
          }));
        }
      });

      return () => unsubscribe();
    });
  }, [teachers]);



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

  useEffect(() => {
    fetchTeachers();
  }, []);


  if (Platform.OS === 'web') (document.activeElement as HTMLElement)?.blur();
  else Keyboard.dismiss();

  // Open chat
  const openChat = (teacher: Teacher) => {
    const chatId = `teacher_${teacher.teacher_id}`;

    router.push({
      pathname: '../screens/ChatScreen',
      params: {
        chat: encodeURIComponent(
          JSON.stringify({
            id: chatId,
            name: teacher.full_name,
            image: '/teacher.png',
          })
        ),
      },
    });
  };




  return (
    <View
      className="flex-1 bg-white border-b-[3px]"
      style={{ borderBottomColor: Colors.primary }}
    >
      <Header user={user} onViewProfile={handleViewProfile} />

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {loading ? (
          <Text className="text-center mt-10">Loading Teachers...</Text>
        ) : teachers.length === 0 ? (
          <Text className="text-center mt-10">No users found.</Text>
        ) : (
          teachers.map((teacher) => (
            <TouchableOpacity
              key={teacher.teacher_id}
              className="m-2 rounded-xl p-4 shadow-sm"
              style={{ backgroundColor: '#FFF9E6' }}
              onPress={() => openChat(teacher)}
            >
              <View className="flex-row gap-3">
                <Image
                  source={require('@/assets/images/profile.png')}
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 65,
                    borderWidth: 3,
                    borderColor: '#f7f5f7ff',
                    marginLeft: 5,
                    marginRight: 10,
                  }}
                />

                <View className="flex-1 flex-row justify-between items-start">

                  {/* LEFT SIDE: Name + Last Message */}
                  <View style={{ flex: 1 }}>
                    <Text className="font-bold text-[16px]">{teacher.full_name}</Text>

                    <Text className="text-[11px] text-gray-500 italic mt-1">
                      {lastMessages[`teacher_${teacher.teacher_id}`]?.text || ""}
                    </Text>
                  </View>

                  {/* RIGHT SIDE: Check Circle */}
                  <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <FontAwesome name="check-circle" size={22} color="green" />
                  </View>

                </View>

              </View>

            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}
