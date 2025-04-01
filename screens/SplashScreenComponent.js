import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

// Prevent Expo from auto-hiding the splash screen
SplashScreen.preventAutoHideAsync();

export default function SplashScreenComponent({ onFinish }) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current; // Start small
  const opacityAnim = useRef(new Animated.Value(0)).current; // Logo fade-in
  const textOpacityAnim = useRef(new Animated.Value(0)).current; // Text fade-in
  const textTranslateY = useRef(new Animated.Value(10)).current; // Text slides up

  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  useEffect(() => {
    const startAnimation = () => {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.2, // Enlarge logo slightly
            duration: 1200, // Reduced duration (was 2000ms)
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 1200, // Reduced duration (was 2000ms)
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(textOpacityAnim, {
            toValue: 1,
            duration: 1000, // Reduced duration (was 1500ms)
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(textTranslateY, {
            toValue: 0, // Moves text into place
            duration: 1000, // Reduced duration (was 1500ms)
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        setTimeout(async () => {
          await SplashScreen.hideAsync(); // Hide splash screen AFTER animation
          setIsAnimationComplete(true); // Mark animation as complete
          onFinish(); // Navigate to main app
        }, 1000); // Reduced delay (was 2000ms)
      });
    };

    setTimeout(startAnimation, 100); // Reduced delay before animation starts
  }, []);

  // If animation is complete, return null to prevent rendering blank screen
  if (isAnimationComplete) return null;

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../assets/Recipe.png")} // Updated file name
        style={[
          styles.logo,
          { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
        ]}
      />
      <Animated.Text
        style={[
          styles.appName,
          { opacity: textOpacityAnim, transform: [{ translateY: textTranslateY }] },
        ]}
      >
        HomeChef
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#e67e22", // Warm orange tone
    marginTop: 20,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
});
