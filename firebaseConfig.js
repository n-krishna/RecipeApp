import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDRHRt2-pD2BK3V-vtqdftokG-TvwfrVS4",
  authDomain: "recipe-app-93dfa.firebaseapp.com",
  projectId: "recipe-app-93dfa",
  storageBucket: "recipe-app-93dfa.firebasestorage.app",
  messagingSenderId: "246284294011",
  appId: "1:246284294011:web:3227d2b5fa7dd2bb3b0fde",
  measurementId: "G-S66ZB83TCG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Use AsyncStorage to persist authentication state
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  popupRedirectResolver: undefined, // Fix possible error related to auth resolver
});

const db = getFirestore(app);

export { auth, db };

