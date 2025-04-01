import { signOut } from "firebase/auth";
import React from "react";
import { Button, Text, View } from "react-native";
import { auth } from "../firebaseConfig";

export default function HomeScreen({ navigation }) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login");
    } catch (error) {
      console.error("Logout Failed", error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Welcome to the Recipe App!</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}