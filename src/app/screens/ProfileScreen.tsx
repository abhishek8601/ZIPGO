// import Colors from '@/constants/colors';
// import { useUser } from '@/context/UserContext';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import React, { useEffect, useState } from 'react';
// import Constants from 'expo-constants';
// import {
//   Keyboard,
//   Platform,
//   ScrollView,
//   Text,
//   View,
//   Image,
//   ActivityIndicator,
//   TouchableOpacity,
// } from 'react-native';

// export default function Profile() {
//   const { user } = useLocalSearchParams();
//   const [data, setData] = useState<any>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const { setUser } = useUser();
//   const router = useRouter();
//   const API_URL = Constants.expoConfig.extra.apiUrl;

//   const handleLogout = async () => {
//     await AsyncStorage.removeItem('token'); // remove token
//     setUser(null);                           // clear user context
//     router.replace('/screens/LoginScreen');  // navigate to login
//   };

//   if (Platform.OS === 'web') {
//     (document.activeElement as HTMLElement)?.blur();
//   } else {
//     Keyboard.dismiss();
//   }

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = await AsyncStorage.getItem('token');
//         if (!token) {
//           setError('No token found. Please log in again.');
//           setLoading(false);
//           return;
//         }

//         // ✅ Protected API call
//         const response = await fetch(`${API_URL}/auth/profile`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`, // send token
//           },
//         });

//         if (!response.ok) {
//           const text = await response.text();
//           console.error('Response text:', text);
//           throw new Error(`Failed to fetch profile. Status: ${response.status}`);
//         }

//         const profileData = await response.json();
//         setData(profileData.user || profileData); // depends on API shape
//       } catch (err: any) {
//         console.error('Profile fetch error:', err);
//         setError('Could not load profile. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);
//   if (loading) {
//     return (
//       <View className="flex-1 items-center justify-center bg-[#fff8e1]">
//         <ActivityIndicator size="large" color="#fcb900" />
//         <Text className="text-[16px] text-[#555] text-center mt-3">
//           Loading profile...
//         </Text>
//       </View>
//     );
//   }
//   // Error state
//   if (error) {
//     return (
//       <View className="flex-1 items-center justify-center bg-[#fff8e1]">
//         <Text className="text-[16px] text-red-600 text-center mt-12">
//           {error}
//         </Text>
//       </View>
//     );
//   }
//   // Data available
//   if (!data) {
//     return (
//       <View className="flex-1 items-center justify-center bg-[#fff8e1]">
//         <Text className="text-[16px] text-red-600 text-center mt-12">
//           User data not available.
//         </Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView
//       className="flex-grow py-10 px-6"
//       style={{ backgroundColor: Colors.primary }}
//     >
//       {/* Header Section */}
//       <View
//         className="items-center mb-8 rounded-2xl py-8 px-5"
//         style={{
//           backgroundColor: Colors.primary,
//           elevation: 5,
//           shadowColor: '#000',
//           shadowOpacity: 0.15,
//           shadowOffset: { width: 0, height: 4 },
//           shadowRadius: 8,
//         }}
//       >
//         <Image
//           source={require('@/assets/images/profile.png')}
//           className="w-[100px] h-[100px] rounded-full mb-3 bg-white"
//         />
//         <Text className="text-[24px] font-bold text-[#2f2f2f]">
//           {data.name}
//         </Text>
//         <Text className="text-[14px] text-[#555] mt-1">
//           {data.email || 'No email provided'}
//         </Text>
//       </View>

//       {/* Info Card */}
//       <View
//         className="bg-white rounded-2xl p-5"
//         style={{
//           elevation: 3,
//           shadowColor: '#000',
//           shadowOpacity: 0.1,
//           shadowOffset: { width: 0, height: 3 },
//           shadowRadius: 10,
//         }}
//       >
//         <Text className="text-[18px] font-bold text-[#444] mb-4 border-b border-[#eee] pb-2">
//           Account Details
//         </Text>

//         {[
//           { label: 'ID', value: data.id },
//           { label: 'Status', value: data.status || 'N/A' },
//           { label: 'License Number', value: data.license_number || 'N/A' },
//           { label: 'Vehicle', value: data.vehicle || 'N/A' },
//           {
//             label: 'Created At',
//             value: data.created_at
//               ? new Date(data.created_at).toLocaleDateString()
//               : 'N/A',
//           },
//         ].map((item, index) => (
//           <View key={index} className="mb-4">
//             <Text className="text-[14px] text-[#888] mb-1 font-medium">
//               {item.label}
//             </Text>
//             <Text className="text-[16px] text-[#333] font-semibold">
//               {item.value}
//             </Text>
//           </View>
//         ))}
//       </View>
//       <TouchableOpacity
//         onPress={handleLogout}
//         style={{
//           marginTop: 20,
//           padding: 15,
//           backgroundColor: 'red',
//           borderRadius: 10,
//           alignItems: 'center',
//         }}
//       >
//         <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
//           Logout
//         </Text>
//       </TouchableOpacity>

//     </ScrollView>
//   );
// }
