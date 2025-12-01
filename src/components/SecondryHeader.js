// import React from 'react';
// import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import Colors from '@/src/constants/colors';
// import Sizes from '@/src/constants/sizes';

// const Header = ({ user, onViewProfile }) => {
//   const router = useRouter();

//   const handleGoBack = () => {
//     router.push('/dashboard');
//   };

//   const handleCalendar = () => {
//     router.push('/event');
//   };

//   const handleNotification = () => {
//     router.push({
//       pathname: '/notification',
//       params: { user: encodeURIComponent(JSON.stringify(user)) },
//     });
//   };

//   return (
//     <View style={styles.header}>
//       <TouchableOpacity onPress={handleGoBack}>
//         <Ionicons name="arrow-back" size={24} color="#000000" />
//       </TouchableOpacity>

//       <TouchableOpacity onPress={onViewProfile}>
//         <Image
//           source={require('@/assets/images/userprofile.png')}
//           style={styles.avatar}
//         />
//       </TouchableOpacity>

//       <Text style={styles.headerText}>Hi, {user?.name || 'User'}</Text>

//       <TouchableOpacity style={styles.bellIcon} onPress={handleCalendar}>
//         <Image
//           source={require('@/assets/images/calender.png')}
//           style={styles.bell}
//         />
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.bellIcon} onPress={handleNotification}>
//         <Image
//           source={require('@/assets/images/bell.png')}
//           style={styles.bell}
//         />
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingLeft: 15,
//     marginTop: 30,
//     height: Sizes.header,
//     backgroundColor: Colors.primary,
//   },
//   avatar: {
//     width: 35,
//     height: 35,
//     borderRadius: 65,
//     borderWidth: 3,
//     borderColor: Colors.white,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginLeft: 5,
//     marginRight: 10,
//   },
//   headerText: {
//     fontSize: 12,
//     fontWeight: '400',
//     color: Colors.textPrimary,
//     flex: 1,
//   },
//   bellIcon: {
//     width: 35,
//     height: 35,
//     marginRight: 5,
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 4,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   bell: {
//     width: 20,
//     height: 20,
//   },
// });

// export default Header;
