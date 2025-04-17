import { Ionicons } from '@expo/vector-icons'; // Import icon for the eye toggle
import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
  Alert,
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { auth } from "../firebaseConfig";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [secureText, setSecureText] = useState(true); 

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Logged in successfully!");
      navigation.replace("Home");
    } catch (error) {
      if (
        error.code === "auth/user-not-found" || 
        error.code === "auth/wrong-password" || 
        error.code === "auth/invalid-credential" ||
        error.code === "auth/invalid-email"
      ) {
        Alert.alert("Invalid username or password", "Please check your credentials and try again.");
      } else {
        Alert.alert("Login Failed", "Something went wrong. Please try again later.");
      }
    }
  };

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      Alert.alert("Error", "Please enter your email to reset password.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      Alert.alert("Success", "Password reset email sent! Check your inbox.");
      setModalVisible(false); // Close modal after success
      setResetEmail(""); // Clear the email input
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please check your email and try again.");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require("../assets/Image.avif")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <View style={styles.overlay}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login to your account</Text>

        <TextInput
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Enter your password"
            value={password}
            secureTextEntry={secureText}
            onChangeText={setPassword}
            style={styles.passwordInput}
          />
          <TouchableOpacity onPress={() => setSecureText(!secureText)} style={styles.eyeIcon}>
            <Ionicons name={secureText ? "eye-off" : "eye"} size={24} color="#7f8c8d" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.signupText}>Don't have an account? Sign up</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Reset Password</Text>
            <Text style={styles.modalSubtitle}>
              Enter your email to receive a password reset link
            </Text>

            <TextInput
              placeholder="Enter your email"
              value={resetEmail}
              onChangeText={setResetEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TouchableOpacity style={styles.modalButton} onPress={handlePasswordReset}>
              <Text style={styles.modalButtonText}>Send Reset Link</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeModalText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1B4217",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1B4217", // changed from #2c3e50
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#1B4217", // changed from #7f8c8d
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 50,
    borderWidth: 2,
    borderColor: "#1B4217",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#F0EAD2",
    color: "#1B4217", // optional: explicit for contrast
  },
  passwordContainer: {
    width: "80%",
    height: 50,
    borderWidth: 2,
    borderColor: "#1B4217",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    backgroundColor: "#F0EAD2",
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    height: "100%",
    color: "#1B4217", // optional
  },
  eyeIcon: {
    padding: 10,
  },
  loginButton: {
    width: "60%",
    height: 50,
    backgroundColor: "#F0EAD2", // match app theme
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    marginTop: 10,
    shadowColor: "#1B4217",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    borderColor: "#1B4217"
  },
  loginButtonText: {
    color: "1B4217",
    fontSize: 18,
    fontWeight: "bold",
  },
  forgotPasswordText: {
    marginTop: 10,
    color: "#e74c3c",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  signupText: {
    marginTop: 15,
    color: "#1B4217", 
    fontSize: 16,
    fontWeight: 'bold'
  },
  /* Modal Styling */
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "90%",
    backgroundColor: "#F0EAD2",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
    marginBottom: 15,
  },
  modalButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  closeModalText: {
    marginTop: 15,
    color: "#e74c3c",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.3)", // lighter overlay to show more of the image
  },
});