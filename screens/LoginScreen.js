import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
  Alert,
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

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Logged in successfully!");
      navigation.replace("Home");
    } catch (error) {
      Alert.alert("Login Failed", error.message);
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
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
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

      <TextInput
        placeholder="Enter your password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={styles.input}
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.signupText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>

      {/* Password Reset Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Reset Password</Text>
            <Text style={styles.modalSubtitle}>Enter your email to receive a password reset link</Text>
            
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
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#7f8c8d",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#bdc3c7",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#ecf0f1",
  },
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
  },
  loginButtonText: {
    color: "#fff",
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
    color: "#3498db",
    fontSize: 16,
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
    backgroundColor: "#fff",
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
});

