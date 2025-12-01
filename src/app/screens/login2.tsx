// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useRouter } from "expo-router";
// import { collection, query, where, getDocs } from "firebase/firestore";
// import React, { useState } from "react";
// import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
// import { db } from "../../firebase/config";
// import { useUser } from "@/context/UserContext";

// export default function Login() {
//   const router = useRouter();
//   const { setUser } = useUser();
//   const [role, setRole] = useState<"driver" | "other">("driver");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [rememberMe, setRememberMe] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async () => {
//     if (!email.trim() || !password.trim()) {
//       Alert.alert("Error", "Please enter both email and password.");
//       return;
//     }

//     setLoading(true);

//     try {
//       // Query Firestore for user by email
//       const usersRef = collection(db, "Register-students-data");
//       const q = query(usersRef, where("email", "==", email));
//       const querySnapshot = await getDocs(q);

//       if (querySnapshot.empty) {
//         Alert.alert("Login Failed", "No account found with this email.");
//         setLoading(false);
//         return;
//       }

//       // Assuming emails are unique, take the first document
//       const userDoc = querySnapshot.docs[0];
//       const userData = userDoc.data();

//       // Check password
//       if (userData.password !== password) {
//         Alert.alert("Login Failed", "Incorrect password.");
//         setLoading(false);
//         return;
//       }

//       // Save token locally
//       await AsyncStorage.setItem("user_token", userDoc.id);

// //       if (rememberMe) {
// //   await AsyncStorage.setItem("user_token", userDoc.id);
// // } else {
// //   await AsyncStorage.removeItem("user_token"); // Ensure no leftover token
// // }
// // (document.activeElement as HTMLElement)?.blur();
//       // ✅ Save user data to context
//       setUser({
//         id: userDoc.id,
//         name: userData.fullName,
//         email: userData.email,
//         status: "active",
//       });

//       // Navigate to success screen
//       router.replace({
//         pathname: "/screens/LoginSuccessScreen",
//         params: {
//           id: userDoc.id,
//           email: userData.email,
//           name: userData.fullName,
//           status: "active",
//           role: userData.role || role,
//         },
//       });
//     } catch (error: any) {
//       console.error("Login Error:", error);
//       Alert.alert("Login Failed", error.message || "Invalid credentials.");
//     } finally {
//       setLoading(false);
//     }
//   };


//   return (
//     <View style={styles.container}>
//       <View>
//         <Text style={styles.title}>Hi, User 2</Text>
//         <Text style={styles.subtitle}>Sign In required</Text>
//       </View>

//       <View style={styles.formContainer}>
//          <View style={styles.tabIndicator} />
//         <View style={styles.radioGroup}>
//           <TouchableOpacity onPress={() => setRole("driver")} style={styles.radioOption}>
//             <View style={styles.radioCircle}>
//               {role === "driver" && <View style={styles.selected} />}
//             </View>
//             <Text style={styles.radioLabel}>Driver</Text>
//           </TouchableOpacity>

//           <TouchableOpacity onPress={() => setRole("other")} style={styles.radioOption}>
//             <View style={styles.radioCircle}>
//               {role === "other" && <View style={styles.selected} />}
//             </View>
//             <Text style={styles.radioLabel}>Others</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.form}>
//           <TextInput
//             placeholder="Email"
//             placeholderTextColor="#aaa"
//             style={styles.input}
//             value={email}
//             onChangeText={setEmail}
//             keyboardType="email-address"
//             autoCapitalize="none"
//           />
//           <TextInput
//             placeholder="Password"
//             placeholderTextColor="#aaa"
//             style={styles.input}
//             value={password}
//             onChangeText={setPassword}
//             secureTextEntry
//           />

//           {/* Checkbox + Forgot password */}
//                   <View style={styles.row}>
//                     <TouchableOpacity
//                       onPress={() => setRememberMe((prev) => !prev)}
//                       style={styles.checkboxContainer}
//                     >
//                       <Text style={styles.checkbox}>{rememberMe ? '✅' : '⬜️'}</Text>
//                       <Text style={styles.checkboxLabel}>Remember Me</Text>
//                     </TouchableOpacity>
          
//                     <TouchableOpacity onPress={() => router.push('/screens/ForgotPasswordScreen')}>
//                       <Text style={styles.forgotText}>Forgot Password?</Text>
//                     </TouchableOpacity>
//                   </View>

//           <TouchableOpacity
//             style={[styles.loginButton, loading && { opacity: 0.6 }]}
//             onPress={handleLogin}
//             disabled={loading}
//           >
//             <Text style={styles.loginButtonText}>{loading ? "Logging in..." : "Login →"}</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.registerContainer}>
//           <Text style={styles.registerText}>Don't have an account?</Text>
//           <TouchableOpacity onPress={() => router.push("/screens/SignupScreen")}>
//             <Text style={styles.registerLink}> Register</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   form: { marginTop: 10 },
//   selected: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#333" },
//     container: {
//     flex: 1,
//     backgroundColor: 'rgb(226, 168, 9)',
//   },
//   header: {
//     marginTop: 150,
//     marginLeft: 30,
//   },
//   title: {
//     marginTop: 250,
//     marginLeft: 30,
//     fontSize: 30,
//     fontWeight: '300',
//     marginBottom: 10,
//     color: '#000',
//   },
//   subtitle: {
//     marginLeft: 30,
//     fontSize: 18,
//     color: '#000',
//   },
//   formContainer: {
//     backgroundColor: '#fff',
//     flex: 1,
//     marginTop: 40,
//     borderTopLeftRadius: 40,
//     borderTopRightRadius: 40,
//     borderTopColor: 'rgba(251, 206, 82, 1)',
//     borderBottomColor: 'rgba(251, 206, 82, 1)',
//     borderTopWidth: 5,
//     borderBottomWidth: 5,
//     paddingHorizontal: 30,
//     paddingTop: 30,
//   },
//   tabIndicator: {
//     height: 4,
//     width: 100,
//     backgroundColor: '#000',
//     alignSelf: 'center',
//     borderRadius: 2,
//     marginBottom: 15,
//   },
//   radioGroup: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 20,
//     marginBottom: 10,
//   },
//   radioOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   radioCircle: {
//     width: 18,
//     height: 18,
//     borderRadius: 9,
//     borderWidth: 2,
//     borderColor: '#000',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 6,
//   },
//   radioSelected: {
//     width: 10,
//     height: 10,
//     backgroundColor: 'rgb(226, 168, 9)',
//     borderRadius: 5,
//   },
//   radioLabel: {
//     fontSize: 16,
//     color: '#000',
//   },
//   input: {
//     height: 55,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 30,
//     paddingHorizontal: 20,
//     marginBottom: 20,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 30,
//   },
//   checkboxContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   checkbox: {
//     marginRight: 6,
//   },
//   checkboxLabel: {
//     fontSize: 14,
//     color: '#000',
//   },
//   forgotText: {
//     fontSize: 14,
//     color: '#0066cc',
//   },
//   loginButton: {
//     backgroundColor: 'rgb(226, 168, 9)',
//     paddingVertical: 15,
//     borderRadius: 30,
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   loginButtonText: {
//     fontSize: 20,
//     fontWeight: '400',
//     color: '#000',
//   },
//   registerContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   registerText: {
//     fontSize: 14,
//     color: '#333',
//   },
//   registerLink: {
//     fontSize: 14,
//     color: '#ff9900',
//   },
// });
