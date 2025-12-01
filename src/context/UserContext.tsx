import AsyncStorage from '@react-native-async-storage/async-storage';
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

  useEffect(() => {
    const checkUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log('✅ User found:', parsedUser);
          setUser(parsedUser);
          router.replace('/dashboard');
        } else {
          console.log('❌ No user found');
           router.replace('/screens/SplashScreen');
          // router.replace('/dashboard');
        }
      } catch (error) {
        console.error('Error checking user', error);
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
