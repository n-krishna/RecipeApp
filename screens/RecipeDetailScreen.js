import { useNavigation, useRoute } from "@react-navigation/native";
import { deleteDoc, doc } from "firebase/firestore";
import React from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
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

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleEdit}>
            <Text style={styles.buttonText}>Edit Recipe</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleDelete}>
            <Text style={styles.buttonText}>Delete Recipe</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F8F1E4",
    padding: 20
  },
  card: {
    backgroundColor: "#FFF9E8",
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
    color: "#3C3C3C",
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
  },
  buttonContainer: {
    marginTop: 30,
    gap: 15
  },
  button: {
    backgroundColor: "#FFB84D",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center"
  },
  buttonText: {
    color: "#1B4217",
    fontSize: 16,
    fontWeight: "600"
  }
});

export default RecipeDetailScreen;