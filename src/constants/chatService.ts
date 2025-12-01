import { db } from '@/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const sendMessage = async (chatId: string, userId: string, text: string) => {
  try {
    await addDoc(collection(db, `chats/${chatId}/messages`), {
      text,
      fromUserId: userId,
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    console.error(err);
  }
};
