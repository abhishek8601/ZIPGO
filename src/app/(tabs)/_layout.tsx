

import Colors from '@/constants/colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import React from 'react';
import { View, StyleSheet } from 'react-native';

const TabsRoot = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          position: 'absolute',
          bottom: 50,
          marginLeft: 30,
          marginRight: 30,
          height: 50,
          backgroundColor: '#f3f1ec',
          borderRadius: 60,
          borderColor: '#d7d6d2',
          borderWidth: 1,
          elevation: 10, // Android shadow
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
        tabBarItemStyle: {
          borderRadius: 13,
          height: 60,
          justifyContent: 'center',
        },
        tabBarLabelStyle: {
          fontSize: 8,
          fontWeight: '600',
        },
        tabBarActiveTintColor: Colors.white,
        tabBarInactiveTintColor: Colors.black,
        headerShown: false,
      }}
    >
      {/* Dashboard Tab */}
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="dashboard" focused={focused} />,
        }}
      />

      {/* Event Tab */}
      <Tabs.Screen
        name="event"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="calendar" focused={focused} />,
        }}
      />

      {/* Location Tab */}
      <Tabs.Screen
        name="location"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="map-marker" focused={focused} />,
        }}
      />

      {/* Notification Tab */}
      <Tabs.Screen
        name="notification"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="bell" focused={focused} />,
        }}
      />

      {/* Hidden Screens */}
      <Tabs.Screen name="(list)/teacherslist" options={{ href: null }} />
      <Tabs.Screen name="(list)/coordinator" options={{ href: null }} />
      <Tabs.Screen name="(list)/parents" options={{ href: null }} />
      <Tabs.Screen name="(list)/emergency" options={{ href: null }} />
      <Tabs.Screen name="(list)/studentslist" options={{ href: null }} />

      <Tabs.Screen name="profiles/UserProfileScreen" options={{ href: null }} />
      <Tabs.Screen name="profiles/coordinatorProfile" options={{ href: null }} />
      <Tabs.Screen name="profiles/teacherProfile" options={{ href: null }} />
      <Tabs.Screen name="profiles/allPeopleList" options={{ href: null }} />
      <Tabs.Screen name="profiles/parentsProfile" options={{ href: null }} />
      <Tabs.Screen name="profiles/ProfileEditScreen" options={{ href: null }} />
      <Tabs.Screen name="profiles/StudentProfileScreen" options={{ href: null }} />
    
    </Tabs>
  );
};

// Tab Icon Component with Active Curve
const TabIcon = ({ icon, focused }: { icon: string; focused: boolean }) => {
  return (
    <View
      style={
        focused
          ? {
            marginTop: 8,
            width: 90,
            height: 52,
            borderRadius: 60,
            backgroundColor: Colors.secondrycolor,
            justifyContent: 'center',
            alignItems: 'center',
          }
          : { width: 24, height: 24, justifyContent: 'center', alignItems: 'center' }
      }
    >
      <FontAwesome
        name={icon}
        size={24}
        color={focused ? Colors.white : Colors.black}
      />
    </View>
  );
};

export default TabsRoot;
