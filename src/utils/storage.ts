import AsyncStorage from '@react-native-async-storage/async-storage';
import STORAGE_KEYS from '@/src/constants/storageKeys';

// Save any data
export const saveData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
    console.log(`${key} saved!`);
  } catch (error) {
    console.error(`Failed to save ${key}`, error);
  }
};

// Read any data
export const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    console.log(`${key} retrieved:`, value);
    return value;
  } catch (error) {
    console.error(`Failed to get ${key}`, error);
  }
};

// Remove any data
export const removeData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log(`${key} removed!`);
  } catch (error) {
    console.error(`Failed to remove ${key}`, error);
  }
};
