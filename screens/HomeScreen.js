import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { auth, db } from "../firebaseConfig";

const categories = ["All", "Veg", "Non-Veg", "Starter", "Drinks","Dessert"];
const HomeScreen = () => {
  const [recipes, setRecipes] = useState([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    setLoading(true);

    let recipeRef = collection(db, "recipes");
    if (category.trim() !== "") {
      recipeRef = query(recipeRef, where("category", "==", category));
    }

    const unsubscribe = onSnapshot(recipeRef, (querySnapshot) => {
      const recipesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRecipes(recipesList);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching recipes:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [category]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login");
    } catch (error) {
      console.error("Logout Failed", error);
    }
  };

  const handleAddRecipe = () => {
    navigation.navigate("AddRecipe");
  };

  const handleNavigateToProfile = () => {
    navigation.navigate("Profile");
  }

  const filteredRecipes = recipes.filter(recipe => {
    const search = searchTerm.trim().toLowerCase();
    const title = recipe?.title?.toLowerCase() || "";
    const category = recipe?.category?.toLowerCase() || "";
    return title.includes(search) || category.includes(search);
  });
  
  

  return (
    <View style={styles.container}>
      {/* Heading */}
      <Text style={styles.heading}>🍽️ <Text style={styles.bold}>Recipe List</Text></Text>

      {/* Button Row */}
      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={handleLogout} style={styles.cardButton}>
          <Text style={styles.cardButtonText}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleAddRecipe} style={styles.cardButton}>
          <Text style={styles.cardButtonText}>Add New Recipe</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNavigateToProfile} style={styles.cardButton}>
          <Text style={styles.cardButtonText}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchLabel}>Search by Category or Dish Name:</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="e.g., Veg or Biriyani"
          placeholderTextColor="#777"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      <View style={styles.categoryGrid}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryCard,
              category === (cat === "All" ? "" : cat) && styles.categoryCardSelected
            ]}
            onPress={() => setCategory(cat === "All" ? "" : cat)}
          >
            <Text
              style={[
                styles.categoryText,
                category === (cat === "All" ? "" : cat) && styles.categoryTextSelected
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FFB84D" style={styles.loader} />
        ) : filteredRecipes.length === 0 ? (
          <Text style={styles.emptyMessage}>No recipes found!</Text>
        ) : (
        <FlatList
          data={filteredRecipes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.recipeCard}
              onPress={() => navigation.navigate("RecipeDetailScreen", { recipe: item })}
              activeOpacity={0.85}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.recipeImage} />
              <View style={styles.recipeText}>
                <Text style={styles.recipeTitle}>{item.title}</Text>
                <Text style={styles.recipeCategory}>{item.category || "Uncategorized"}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F1E4",
    padding: 20
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#3C3C3C",
    textAlign: "center",
    marginBottom: 20
  },
  bold: {
    color: "#FFB84D"
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15
  },
  cardButton: {
    backgroundColor: "#F0EAD2",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center"
  },
  cardButtonText: {
    color: "#1B4217",
    fontSize: 16,
    fontWeight: "600"
  },
  loader: {
    marginTop: 20
  },
  emptyMessage: {
    textAlign: "center",
    fontSize: 18,
    color: "#EEE",
    marginTop: 20
  },
  searchContainer: {
    marginBottom: 15
  },
  searchLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#1B4217"
  },
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
    alignItems: "center",
    flex: 1, 
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
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 12,
  },
  categoryCard: {
    backgroundColor: "#FFF5E0",
    width: "30%",
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#FFB84D",
  },
  categoryCardSelected: {
    backgroundColor: "#FFB84D",
  },
  categoryText: {
    color: "#1B4217",
    fontWeight: "bold",
    fontSize: 15
  },
  categoryTextSelected: {
    color: "#1B4217"
  }
});

export default HomeScreen;
