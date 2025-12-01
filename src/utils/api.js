import AsyncStorage from '@react-native-async-storage/async-storage';

export const callProtectedApi = async (url, method = 'GET', body = null) => {
  try {
    // ✅ Get saved token
    const token = await AsyncStorage.getItem('token');
    console.log('Using token:', token);

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // attach token
    };

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });
    const text = await response.text(); // read raw response
   let parsedData;

    try {
      parsedData = JSON.parse(text);
    } catch {
      console.warn('Response is not JSON:', text);
       parsedData = text;
    }

    // const data = await response.json();
    // console.log('Protected API response:', parsedData);

    // return { ok: response.ok, status: response.status, data: parsedData };
  } catch (error) {
    // console.error('Protected API error:', error);
    throw error;
  }
};
