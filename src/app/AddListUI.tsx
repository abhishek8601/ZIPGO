import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { saveStudentInfoForList } from '../firebase/firestoreService';
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { db } from '@/firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';

export default function AddListUI() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [father, setFather] = useState('');
  const [mother, setMother] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [loading, setLoading] = useState(false);

  const classes = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

  const handleSignup = async () => {
    setLoading(true);
    try {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(phoneNumber)) {
        Alert.alert('Error', 'Please enter a valid 10-digit phone number.');
        setLoading(false);
        return;
      }

      const usersRef = collection(db, 'studentslist');
      const q = query(usersRef, where('phoneNumber', '==', phoneNumber));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        Alert.alert('Error', 'An account with this phone number already exists.');
        setLoading(false);
        return;
      }

      const student = {
        fullName,
        father,
        mother,
        phoneNumber,
        class: studentClass,
      };

      await saveStudentInfoForList(student);

      const fakeToken = 'abc123-example-token';
      await AsyncStorage.setItem('user_token', fakeToken);
      Alert.alert('Success', 'Student added successfully.');

      setFullName('');
      setFather('');
      setMother('');
      setPhoneNumber('');
      setStudentClass('');
    } catch (error) {
      console.error('Add list failed', error);
      Alert.alert('Error', 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      className="flex-grow justify-center"
      style={{ backgroundColor: 'rgb(226, 168, 9)' }}
    >
      {/* Spacer / Top Container */}
      <View className="h-[250px] w-full" />

      {/* Form Container */}
      <View
        className="rounded-t-[20px] bg-[#fcfbf8] pt-5 pb-8 min-h-[645px]"
        style={{
          borderTopWidth: 7,
          borderTopColor: '#fbce52',
          borderBottomWidth: 5,
          borderBottomColor: '#fbce52',
        }}
      >
        {/* Tab Indicator */}
        <View className="h-[3px] w-[120px] bg-black self-center rounded mb-4" />

        {/* Full Name */}
        <TextInput
          placeholder="Full Name"
          className="border border-[#ccc] p-3 mb-3 rounded-[20px] text-[16px] mx-10 bg-white"
          value={fullName}
          onChangeText={setFullName}
        />

        {/* Father */}
        <TextInput
          placeholder="Father"
          className="border border-[#ccc] p-3 mb-3 rounded-[20px] text-[16px] mx-10 bg-white"
          value={father}
          onChangeText={setFather}
        />

        {/* Mother */}
        <TextInput
          placeholder="Mother"
          className="border border-[#ccc] p-3 mb-3 rounded-[20px] text-[16px] mx-10 bg-white"
          value={mother}
          onChangeText={setMother}
        />

        {/* Phone Number */}
        <TextInput
          placeholder="Phone Number"
          className="border border-[#ccc] p-3 mb-3 rounded-[20px] text-[16px] mx-10 bg-white"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />

        {/* Class Picker */}
        <View
          className="border border-[#ccc] rounded-[20px] mb-3 mx-10 bg-white overflow-hidden"
          style={{ padding: 10 }}
        >
          <Picker
            selectedValue={studentClass}
            onValueChange={(itemValue) => setStudentClass(itemValue)}
          >
            <Picker.Item label="Select Class" value="" />
            {classes.map((cls) => (
              <Picker.Item key={cls} label={cls} value={cls} />
            ))}
          </Picker>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          className="rounded-[20px] py-5 items-center mx-10 mt-2"
          style={{ backgroundColor: 'rgb(226, 168, 9)' }}
          onPress={handleSignup}
          disabled={loading}
        >
          <Text className="text-[20px] font-normal text-black">
            {loading ? 'Adding...' : 'Add'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
