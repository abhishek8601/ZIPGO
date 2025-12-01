import { Alert } from "react-native";

export const handleError = (error: any, customMessage?: string) => {
  console.error("Global Error:", error);

  const message =
    customMessage || error?.message || "Something went wrong. Please try again.";

  Alert.alert("Error", message);
};
