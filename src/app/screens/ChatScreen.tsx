import { db } from "@/firebase/config";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";
import React, { useState, useRef, useEffect } from "react";
import EmojiSelector from "react-native-emoji-selector";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Keyboard,
  Animated,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ChatScreen() {
  const params = useLocalSearchParams();
  const chatParam = Array.isArray(params.chat) ? params.chat[0] : params.chat;
  const chat = chatParam ? JSON.parse(decodeURIComponent(chatParam)) : null;

  if (!chat)
    return <Text>No chat found</Text>;

  const chatId = chat.id; // Use the consistent chatId from NotificationScreen

  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const emojiHeight = useRef(new Animated.Value(0)).current;

  // Fetch messages
  useEffect(() => {
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        list.push({
          id: d.id,
          ...data,
          timestamp: data.timestamp
            ? new Date(data.timestamp.toDate()).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
            : "",
        });
      });
      setMessages(list);
    });

    return () => unsubscribe();
  }, []);

  // Send message
  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const msg = {
      text: inputText.trim(),
      timestamp: serverTimestamp(),
      fromUser: true,
    };

    await addDoc(collection(db, "chats", chatId, "messages"), msg);
    setInputText("");
    setShowEmoji(false);
  };

  // Toggle Emoji
  const toggleEmoji = () => {
    if (showEmoji) Keyboard.dismiss();

    setShowEmoji(!showEmoji);

    Animated.timing(emojiHeight, {
      toValue: !showEmoji ? 280 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#e5ddd5" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        {/* <Image source={{ uri: chat.image }} style={styles.avatar} /> */}
        {/* Dummy Profile Image */}
        <Image
          source={require('@/assets/images/profile.png')}  // <-- your dummy avatar
          style={{ width: 34, height: 34, borderRadius: 17, marginLeft: 14 }}
        />
        <Text style={styles.headerText}>{chat.name}</Text>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 10, paddingBottom: 100 }}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        renderItem={({ item }) => {
          const isUser = item.fromUser;
          return (
            <View
              style={[
                styles.messageContainer,
                isUser ? styles.right : styles.left,
              ]}
            >
              {!isUser && (
                <Image
                  source={{ uri: chat.image }}
                  style={styles.messageAvatar}
                />
              )}
              <View
                style={[
                  styles.messageBubble,
                  isUser ? styles.userBubble : styles.otherBubble,
                ]}
              >
                <Text style={styles.messageText}>{item.text}</Text>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
              </View>
            </View>
          );
        }}
      />

      {/* Emoji Picker */}
      <Animated.View style={{ height: emojiHeight }}>
        {showEmoji && (
          <EmojiSelector
            onEmojiSelected={(emoji) => setInputText((prev) => prev + emoji)}
            showSearchBar={false}
            showTabs
            columns={8}
          />
        )}
      </Animated.View>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={toggleEmoji} style={styles.iconBtn}>
          <Text style={{ fontSize: 26 }}>
            {showEmoji ? "⌨️" : "😊"}
          </Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
          multiline
          onFocus={() => setShowEmoji(false)}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <FontAwesome name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d4aa1eff",
    padding: 12,
    paddingTop: 40,
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  messageContainer: {
    flexDirection: "row",
    marginVertical: 6,
    alignItems: "flex-end",
  },
  left: { justifyContent: "flex-start" },
  right: { justifyContent: "flex-end" },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    maxWidth: "80%",
  },
  userBubble: { 
    backgroundColor: "#dcf8c6", 
    borderTopRightRadius: 4 
  },
  otherBubble: { 
    backgroundColor: "#fff", 
    borderTopLeftRadius: 4 },
  messageText: { fontSize: 15 },
  timestamp: { fontSize: 11, color: "#666", alignSelf: "flex-end" },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#f0f0f0",
    alignItems: "flex-end",
    marginBottom: 50,
  },
  iconBtn: { padding: 8 },
  input: {
    flex: 1,
    backgroundColor: "#fff",     
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    marginHorizontal: 8,
  },
  sendButton: {
    backgroundColor: "#e1af3aff",
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
  },
});