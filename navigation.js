import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import AddRecipeScreen from "./screens/AddRecipeScreen"; // Adding navigation for Recipe  : Faraz
import EditRecipeScreen from './screens/EditRecipeScreen';
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import ProfileScreen from './screens/ProfileScreen';
import RecipeDetailScreen from "./screens/RecipeDetailScreen";
import SignupScreen from "./screens/SignupScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddRecipe" component={AddRecipeScreen} />
        <Stack.Screen name="RecipeDetailScreen" component={RecipeDetailScreen} />
        <Stack.Screen name="EditRecipe" component={EditRecipeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

