import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import React, { createContext, useContext, useState, useEffect } from 'react';

// ----------- Types -----------
interface User {
  uid: string;  
  id?: string;
  name?: string;
  email?: string;
  status?: string;
  token?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

// ----------- Context -----------
const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

// ----------- Provider -----------
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
   const API_URL = Constants.expoConfig.extra.apiUrl;

  // useEffect(() => {
  //   const checkUser = async () => {
  //     try {
  //       const storedUser = await AsyncStorage.getItem('user');
  //       if (storedUser) {
  //         const parsedUser = JSON.parse(storedUser);
  //         console.log('✅ User found:', parsedUser);
  //         setUser(parsedUser);
  //         router.replace('/dashboard');
  //       } else {
  //         console.log('❌ No user found');
  //          router.replace('/screens/SplashScreen');
  //         // router.replace('/dashboard');
  //       }
  //     } catch (error) {
  //       console.error('Error checking user', error);
  //       router.replace('/screens/SplashScreen');
  //     }
  //   };

  //   checkUser();
  // }, []);

  useEffect(() => {
  const checkUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');

      if (!storedUser) {
        console.log('❌ No user found');
        router.replace('/screens/SplashScreen');
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      const token = parsedUser?.token;

      if (!token) {
        console.log('❌ No token found');
        await AsyncStorage.removeItem('user');
        setUser(null);
        router.replace('/screens/SplashScreen');
        return;
      }

      // ✅ Optional: call backend to validate token
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (data.error === 'Invalid token') {
        console.log('⛔ Token expired or invalid');
        await AsyncStorage.removeItem('user');
        setUser(null);
        router.replace('/screens/SplashScreen');
        return;
      }

      // Token valid → set user and navigate to dashboard
      console.log('✅ User valid:', parsedUser);
      setUser(parsedUser);
      router.replace('/dashboard');

    } catch (error) {
      console.error('Error checking user:', error);
      router.replace('/screens/SplashScreen');
    }
  };

  checkUser();
}, []);


  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// ----------- Hook -----------
export const useUser = () => useContext(UserContext);
