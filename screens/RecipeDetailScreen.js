import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  Alert
} from "react-native";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const RecipeDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { recipe } = route.params;

  const handleEdit = () => {
    navigation.navigate("EditRecipe", { recipe });
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Recipe",
      "Are you sure you want to delete this recipe?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "recipes", recipe.id));
              Alert.alert("Recipe deleted!");
              navigation.goBack();
            } catch (error) {
              console.error("Error deleting recipe:", error);
              Alert.alert("Error deleting recipe.");
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        {recipe.imageUrl || recipe.image ? (
          <Image
            source={{ uri: recipe.imageUrl || recipe.image }}
            style={styles.image}
          />
        ) : null}

        <Text style={styles.title}>{recipe.title}</Text>

        <Text style={styles.sectionTitle}>Ingredients:</Text>
        <Text style={styles.ingredients}>{recipe.ingredients}</Text>

        <View style={{ marginTop: 30 }}>
          <Button title="Edit Recipe" onPress={handleEdit} />
          <View style={{ marginVertical: 10 }} />
          <Button title="Delete Recipe" onPress={handleDelete} color="red" />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#1B4217",
    padding: 20
  },
  card: {
    backgroundColor: "#F0EAD2",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6
  },
  image: {
    width: "100%",
    height: 240,
    borderRadius: 15,
    marginBottom: 20
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1B4217",
    marginBottom: 15,
    textAlign: "center"
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFB84D",
    marginBottom: 10
  },
  ingredients: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333"
  }
});

export default RecipeDetailScreen;
