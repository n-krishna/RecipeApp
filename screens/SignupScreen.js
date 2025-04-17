import { Ionicons } from "@expo/vector-icons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import {
  Alert,
  Animated,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { auth, db } from "../firebaseConfig";

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [buttonScale] = useState(new Animated.Value(1));

  // 🔹 Real-time validation errors
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // 🔹 Validation Functions
  const validateEmail = (text) => {
    setEmail(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(emailRegex.test(text) ? "" : "Enter a valid email address.");
  };

  const validatePhoneNumber = (text) => {
    setPhoneNumber(text);
    const phoneRegex = /^[0-9]{7,15}$/;
    setPhoneError(phoneRegex.test(text) ? "" : "Enter a valid phone number (7-15 digits).");
  };

  const validateFields = () => {
    if (!name.trim()) return "Full Name is required.";
    if (emailError) return emailError;
    if (phoneError) return phoneError;
    if (password !== confirmPassword) return "Passwords do not match.";
    if (!address.trim()) return "Address is required.";
    if (!country.trim()) return "Country is required.";
    return null;
  };

  // 🔹 Handle Signup
  const handleSignup = async () => {
    const validationError = validateFields();
    if (validationError) {
      Alert.alert("Error", validationError);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store additional details in Firestore
      await setDoc(doc(collection(db, "users"), user.uid), {
        uid: user.uid,
        name,
        email,
        phoneNumber: `${countryCode} ${phoneNumber}`,
        address,
        country,
      });

      // ✅ Success Alert and navigate only after user presses OK
      Alert.alert("Success", "Account created successfully!", [
        {
          text: "OK",
          onPress: () => navigation.replace("Home"),
        },
      ]);
    } catch (error) {
      let message = "Something went wrong. Please try again.";

      if (error.code === "auth/email-already-in-use") {
        message = "This email is already registered. Please use a different one or log in.";
      } else if (error.code === "auth/invalid-email") {
        message = "Invalid email address.";
      } else if (error.code === "auth/weak-password") {
        message = "Password should be at least 6 characters.";
      }

      Alert.alert("Signup Failed", message);
    }
  };

  // 🔹 Button Animation
  const handlePressIn = () => {
    Animated.spring(buttonScale, { toValue: 0.95, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(buttonScale, { toValue: 1, friction: 3, useNativeDriver: true }).start();
  };

  return (
    <ImageBackground
      source={require("../assets/Signup.webp")} // make sure this image exists in the assets folder
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.overlay}> {/* Optional: if you want semi-transparent overlay */}
            <Text style={styles.title}>Create an Account</Text>
  
            {/* Full Name */}
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={22} color="#3498db" style={styles.icon} />
              <TextInput
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                style={styles.input}
              />
            </View>
  
            {/* Email */}
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={22} color="#3498db" style={styles.icon} />
              <TextInput
                placeholder="Email Address"
                value={email}
                onChangeText={validateEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
  
            {/* Phone Number */}
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={22} color="#3498db" style={styles.icon} />
              <TextInput
                placeholder="+1"
                value={countryCode}
                onChangeText={setCountryCode}
                style={styles.countryCodeInput}
                keyboardType="phone-pad"
              />
              <TextInput
                placeholder="Phone Number"
                value={phoneNumber}
                onChangeText={validatePhoneNumber}
                keyboardType="phone-pad"
                style={styles.phoneInput}
              />
            </View>
            {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
  
            {/* Address */}
            <View style={styles.inputContainer}>
              <Ionicons name="location-outline" size={22} color="#3498db" style={styles.icon} />
              <TextInput
                placeholder="Address"
                value={address}
                onChangeText={setAddress}
                autoCapitalize="words"
                style={styles.input}
              />
            </View>
  
            {/* Country */}
            <View style={styles.inputContainer}>
              <Ionicons name="earth-outline" size={22} color="#3498db" style={styles.icon} />
              <TextInput
                placeholder="Country"
                value={country}
                onChangeText={setCountry}
                autoCapitalize="words"
                style={styles.input}
              />
            </View>
  
            {/* Password */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={22} color="#3498db" style={styles.icon} />
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={styles.input}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={22} color="#3498db" />
              </TouchableOpacity>
            </View>
  
            {/* Confirm Password */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={22} color="#3498db" style={styles.icon} />
              <TextInput
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                style={styles.input}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} size={22} color="#3498db" />
              </TouchableOpacity>
            </View>
  
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity
                style={styles.signupButton}
                onPress={handleSignup}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
              >
                <Text style={styles.signupButtonText}>Sign Up</Text>
              </TouchableOpacity>
            </Animated.View>
  
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.loginText}>Already have an account? Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

// // 🔹 Styling
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#1B4217",
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 20,
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: "bold",
//     color: "#ffffff", 
//     marginBottom: 20,
//   },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     width: "100%",
//     backgroundColor: "#F0EAD2",
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: "#3498db",
//   },
//   icon: {
//     marginRight: 10,
//   },
//   input: {
//     flex: 1,
//     height: 50,
//     color: "#1B4217",
//   },
//   countryCodeInput: {
//     width: 50,
//     textAlign: "center",
//     borderRightWidth: 1,
//     borderRightColor: "#ccc",
//     marginRight: 10,
//     color: "#1B4217",
//   },
//   phoneInput: {
//     flex: 1,
//     height: 50,
//     color: "#1B4217",
//   },
//   errorText: {
//     color: "red",
//     fontSize: 14,
//     alignSelf: "flex-start",
//     marginBottom: 5,
//     marginLeft: 5,
//   },
//   signupButton: {
//     width: 200,
//     height: 50,
//     backgroundColor: "#F0EAD2",
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "#3498db",
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 15,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//   },

// signupButtonText: {
//   color: "#1B4217", // green text color (same as input text)
//   fontSize: 18,
//   fontWeight: "bold",
// },
//   loginText: {
//     marginTop: 15,
//     color: "#ffffff", 
//     fontSize: 16,
//     fontWeight: 'bold'
//   },
 
//   overlay: {
//     backgroundColor: "rgba(0, 0, 0, 0.5)", // transparent dark overlay over background image
//     borderRadius: 16,
//     padding: 20,
//     marginVertical: 30,
//   },
// });


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Dark semi-transparent overlay
    borderRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0EAD2", // Updated color
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    width: "90%",
    marginLeft: 25,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333",
  },
  countryCodeInput: {
    width: 50,
    height: 50,
    fontSize: 16,
    color: "#333",
    marginRight: 10,
  },
  phoneInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333",
  },
  errorText: {
    color: "#ff4d4d",
    fontSize: 14,
    marginBottom: 10,
    marginLeft: 10,
  },
  signupButton: {
    backgroundColor: "#F0EAD2",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  signupButtonText: {
    color: "#1B4217",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginText: {
    marginTop: 15,
    color: "#ffffff",
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: "center",
  }
});