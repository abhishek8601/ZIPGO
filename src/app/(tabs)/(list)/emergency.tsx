import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  Linking,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '@/firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import Colors from '@/constants/colors';

interface EmergencyContact {
  id: string;
  name: string;
  mobile?: string;
  imageUrl?: string;
}

export default function EmergencyList() {
  const router = useRouter();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch data
  const fetchEmergencyContacts = async () => {
    try {
      const contactsCollection = collection(db, 'emergency');
      const snapshot = await getDocs(contactsCollection);
      const contactList: EmergencyContact[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as EmergencyContact[];

      setContacts(contactList);
    } catch (error) {
      console.error('❌ Error fetching emergency contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Platform.OS === 'web') (document.activeElement as HTMLElement)?.blur();
    else Keyboard.dismiss();
  }, []);

  useEffect(() => {
    fetchEmergencyContacts();
  }, []);

  // 📞 Dial Contact
  const handleCall = async (phone: string) => {
    const url = `tel:${phone}`;
    if (await Linking.canOpenURL(url)) Linking.openURL(url);
    else alert('Unable to open dialer.');
  };

  // 📞 Dial 911
  const handleDial911 = () => handleCall("911");

  return (
    <SafeAreaView className="flex-1 mt-2 bg-[#f5f4f0]">
      {/* Header */}
      <View
        className="flex-row items-center h-[55px] pl-5 px-3"
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
        <Text className="text-[15px] font-normal text-white  ml-2">
          Emergency Contacts
        </Text>
      </View>

      {/* Loader */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#dc961b" />
          <Text className="mt-2">Fetching emergency contacts…</Text>
        </View>
      ) : contacts.length === 0 ? (
        <Text className="text-center mt-10 text-gray-500">
          No emergency contacts found.
        </Text>
      ) : (
        <View className="px-5 mt-5">

          {/* 🔥 Beautiful Emergency Card */}
          <View
            style={{
              backgroundColor: "#ffe5e5",
              borderRadius: 16,
              padding: 18,
              elevation: 3,
              shadowColor: "#2c1616ff",
              shadowOpacity: 0.3,
              shadowOffset: { width: 0, height: 3 },
              shadowRadius: 6,
            }}
          >
            <View className="items-center mb-3">
              <Image
                source={
                  contacts[0].imageUrl
                    ? { uri: contacts[0].imageUrl }
                    : require('@/assets/images/profile.png')
                }
                style={{
                  width: 185,
                  height: 185,
                  borderRadius: 42,
                  marginBottom: 10,
                }}
              />
              <Text className="text-xl font-bold text-red-100">
                {contacts[0].name}
              </Text>
              <Text className="text-red-700 text-sm mt-1">
                {contacts[0].mobile}
              </Text>
            </View>
            {/* 📞 Dial 911 Button */}
            <View className="absolute bottom-1 left-5 right-5">
              <TouchableOpacity
                onPress={handleDial911}
                className="flex-row items-center justify-center py-4 rounded-xl"
                style={{ backgroundColor: "#ff0202ff" }}
              >
                <Ionicons name="call" size={20} color="#fff" style={{ marginRight: 6 }} />
                <Text className="text-white font-semibold text-sm">
                  CALL NOW
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}


    </SafeAreaView>
  );
}
