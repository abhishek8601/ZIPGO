import React, { ReactNode, useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
  Image,
  ImageSourcePropType,
  Keyboard,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Colors from '@/constants/colors';
import { router } from 'expo-router';
import Constants from 'expo-constants';

interface Event {
  image: ImageSourcePropType;
  description: ReactNode;
  deletable: React.JSX.Element;
  id: number;
  title: string;
  date: string;
  type: string;
  created_at: string;
}


export default function CalendarScreen() {
  if (Platform.OS === 'web') (document.activeElement as HTMLElement)?.blur();
  else Keyboard.dismiss();

  const navigation = useNavigation();
  const [eventList, setEventList] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const API_URL = Constants.expoConfig.extra.apiUrl;

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_URL}/events`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data: Event[] = await response.json();
      setEventList(data); // set API data
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchEvents();
  }, []);
  // const deleteEvent = (id: string) => {
  //   setEventList((prev) => prev.filter((event) => event.id !== id));
  // };

  // 🟡 Generate markedDates dynamically
  const today = new Date().toISOString().split('T')[0];
  const markedDates = eventList.reduce((acc: any, event) => {
    acc[event.date] = {
      marked: true,
      customStyles: {
        container: {
          backgroundColor: '#f1ac0bff',
          borderRadius: 50,
        },
        text: {
          color: '#f8f8f8ff',
          fontWeight: 'bold',
        },
      },
      selected: selectedDate === event.date,
      selectedColor: selectedDate === event.date ? Colors.secondrycolor : undefined,
      selectedTextColor: selectedDate === event.date ? '#fff' : undefined,
    };
    return acc;
  }, {} as Record<string, any>);

  // Highlight today's date
  if (!markedDates[today]) {
    markedDates[today] = {
      customStyles: {
        container: { backgroundColor: '#042945ff' },
        text: { color: '#f8f8f8ff', fontWeight: 'bold' },
      },
    };
  } else {
    markedDates[today] = {
      ...markedDates[today],
      customStyles: {
        container: { backgroundColor: '#e8210bff', borderRadius: 50 },
        text: { color: '#030202ff', fontWeight: 'bold' },
      },
    };
  }

  function deleteEvent(id: number): void {
    throw new Error('Function not implemented.');
  }

  return (
    <SafeAreaView className="flex-1 bg-white mt-12 border-b border-[#042945]">
      {/* Header */}
      <View className="flex-row items-baseline justify-between h-24 px-6 bg-[#042945]">
        <TouchableOpacity onPress={() => router.push('/dashboard')}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-base font-medium mt-2 flex-1 ml-3">
          Upcoming Events
        </Text>
        <View className="w-6" />
      </View>

      {/* Calendar */}
      <View className="absolute bg-white rounded-t-[60px] overflow-hidden w-full mt-12 h-[400px]">
        <Calendar
          current={today}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          enableSwipeMonths
          markingType="custom"
          theme={{
            calendarBackground: '#fff',
            arrowColor: '#000',
            monthTextColor: '#000',
            textSectionTitleColor: '#000',
            todayTextColor: '#010101ff',
            selectedDayBackgroundColor: Colors.secondrycolor,
            selectedDayTextColor: '#fff',
          }}
          markedDates={markedDates}
        />
      </View>

      {/* Event List */}
      <ScrollView className="bg-[#eaca9a] rounded-t-3xl mt-[350px] border-b-4 border-[#f1ac0b]">
        {eventList.map((event) => (
          <View
            key={event.id}
            className="bg-[#083b66] rounded-2xl mx-5 mt-4 flex-row items-center h-[120px] p-3 relative"
          >
            <Image
              source={event.image}
              style={{
                width: 75,
                height: 75,
                borderRadius: 12,
                borderColor: 'white',
                borderWidth: 2,
                marginRight: 12,
              }}
            />
            <View className="flex-1">
              <Text className="text-white text-xs">{event.date}</Text>
              <Text className="text-[#F4A300] font-light text-sm mt-1">{event.title}</Text>
              <Text className="text-white text-[10px] mt-1">{event.type}</Text>
              <Text className="text-white text-[10px] mt-1">{event.description}</Text>
            </View>
            {event.deletable && (
              <TouchableOpacity
                onPress={() => deleteEvent(event.id)}
                className="bg-black p-2 rounded-xl absolute right-2 top-1/2 -translate-y-2"
              >
                <Ionicons name="trash-outline" size={20} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
