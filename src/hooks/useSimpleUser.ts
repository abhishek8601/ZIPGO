import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';

export function useSimpleUser() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        // Check local storage first
        let saved = await AsyncStorage.getItem('simpleUserId');
        if (saved) {
          console.log('Loaded userId from storage:', saved);
          setUserId(saved);
          return;
        }

        // Get all users from Firestore
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const count = usersSnapshot.size;
        const newId = `user${count + 1}`;

        // Save new user to Firestore
        await setDoc(doc(db, 'users', newId), { createdAt: Date.now() });

        // Save locally
        await AsyncStorage.setItem('simpleUserId', newId);

        console.log('Created new userId:', newId);
        setUserId(newId);
      } catch (err) {
        console.error('Error creating/loading simple user:', err);
      }
    };

    loadUser();
  }, []);

  return userId;
}
