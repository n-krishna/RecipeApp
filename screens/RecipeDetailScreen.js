import { useRoute } from "@react-navigation/native";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";


const RecipeDetailScreen = () => {
  const route = useRoute();
  const { recipe } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
  <View style={styles.card}>
    {recipe.image && (
      <Image source={{ uri: recipe.image }} style={styles.image} />
    )}

    <Text style={styles.title}>{recipe.title}</Text>

    <Text style={styles.sectionTitle}>Ingredients:</Text>
    <Text style={styles.ingredients}>{recipe.ingredients}</Text>
  </View>
</ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#1B4217", // Dark background for full screen
    padding: 20,
  },
  card: {
    backgroundColor: "#F0EAD2", // Light card
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  image: {
    width: "100%",
    height: 240,
    borderRadius: 15,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1B4217",
    marginBottom: 15,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFB84D",
    marginBottom: 10,
  },
  ingredients: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333"
  },
});

export default RecipeDetailScreen;