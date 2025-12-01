import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { UserProvider } from '@/context/UserContext';
import { LogBox } from 'react-native';
import "../global.css";



// 🔇 Filter console warnings on web
if (typeof window !== 'undefined') {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('props.pointerEvents is deprecated')
    ) {
      return;
    }
    originalWarn(...args);
  };
}

if (typeof window !== 'undefined') {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('props.pointerEvents is deprecated')
    ) {
      return;
    }
    originalWarn(...args);
  };
}


const RootLayout = () => {
  return (
    <UserProvider>
      <>
        <Stack screenOptions={{ headerShown: false }} >
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name='AddListUI' />
          {/* <Stack.Screen name='(tabs)/profiles' /> */}
        </Stack>
        <StatusBar backgroundColor="white" style="dark" />
      </>
    </UserProvider>
  );
}

export default RootLayout;
