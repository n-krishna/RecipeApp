import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { auth, db } from "../firebaseConfig";

const HomeScreen = () => {
  const [recipes, setRecipes] = useState([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        let recipeRef = collection(db, "recipes");

        if (category.trim() !== "") {
          recipeRef = query(recipeRef, where("category", "==", category));
        }

        const querySnapshot = await getDocs(recipeRef);
        const recipesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setRecipes(recipesList);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [category]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login");
    } catch (error) {
      console.error("Logout Failed", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.heading}>🍽️ <Text style={styles.bold}>Recipe List</Text></Text>
        <Button title="Logout" onPress={handleLogout} color="#FF6B6B" />
      </View>

      <View style={styles.searchContainer}>
        <Text style={styles.searchLabel}>Search Category:</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Type category (e.g., Veg, Dessert)..."
          placeholderTextColor="#777"
          value={category}
          onChangeText={setCategory}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FFB84D" style={styles.loader} />
      ) : recipes.length === 0 ? (
        <Text style={styles.emptyMessage}>No recipes found!</Text>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.recipeCard}
              onPress={() => navigation.navigate("RecipeDetail", { recipe: item })}
              activeOpacity={0.85}
            >
              <Image source={{ uri: item.image }} style={styles.recipeImage} />
              <View style={styles.recipeText}>
                <Text style={styles.recipeTitle}>{item.title}</Text>
                <Text style={styles.recipeCategory}>{item.category}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1B4217", padding: 20 },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#F0EAD2"
  },
  bold: { fontWeight: "900", color: "#FFB84D" },
  loader: { marginTop: 20 },
  emptyMessage: { textAlign: "center", fontSize: 18, color: "#EEE", marginTop: 20 },

  searchContainer: { marginBottom: 15 },
  searchLabel: { fontSize: 16, fontWeight: "bold", marginBottom: 5, color: "#F0EAD2" },
  searchInput: {
    borderWidth: 1,
    borderColor: "#F0EAD2",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    color: "#000"
  },

  recipeCard: {
    flexDirection: "row",
    backgroundColor: "#F0EAD2",
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    padding: 10,
    alignItems: "center"
  },
  recipeImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15
  },
  recipeText: {
    flex: 1,
    justifyContent: "center"
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1B4217"
  },
  recipeCategory: {
    fontSize: 14,
    color: "#555",
    marginTop: 4
  }
});

export default HomeScreen;