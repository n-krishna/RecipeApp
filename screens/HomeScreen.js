import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where
} from "firebase/firestore";
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

const categories = ["All", "Veg", "Non-Veg", "Starter", "Drinks", "Dessert"];

const HomeScreen = () => {
  const [recipes, setRecipes] = useState([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [userEmail, setUserEmail] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserEmail(currentUser.email);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    let recipeRef = collection(db, "recipes");
    if (category.trim() !== "") {
      recipeRef = query(recipeRef, where("category", "==", category));
    }

    const unsubscribe = onSnapshot(
      recipeRef,
      (querySnapshot) => {
        const recipesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setRecipes(recipesList);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching recipes:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [category]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setFavoriteIds(userSnap.data().favorites || []);
      } else {
        await setDoc(userRef, { favorites: [] });
      }
    };
    fetchFavorites();
  }, []);

  const toggleFavorite = async (recipeId) => {
    const userRef = doc(db, "users", auth.currentUser.uid);
    const isFav = favoriteIds.includes(recipeId);

    await updateDoc(userRef, {
      favorites: isFav ? arrayRemove(recipeId) : arrayUnion(recipeId)
    });

    setFavoriteIds((prev) =>
      isFav ? prev.filter((id) => id !== recipeId) : [...prev, recipeId]
    );
  };

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
  };

  const filteredRecipes = recipes.filter((recipe) => {
    const search = searchTerm.trim().toLowerCase();
    const title = recipe?.title?.toLowerCase() || "";
    const category = recipe?.category?.toLowerCase() || "";
    return title.includes(search) || category.includes(search);
  });

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {userEmail !== "" && (
        <View style={styles.userBox}>
          <Ionicons name="person-circle-outline" size={20} color="#3C3C3C" />
          <Text style={styles.userBoxText}>Logged in as: {userEmail}</Text>
        </View>
      )}

      <Text style={styles.heading}>
        🍽️ <Text style={styles.bold}>Recipe List</Text>
      </Text>

      <View style={styles.navGrid}>
        <TouchableOpacity onPress={handleAddRecipe} style={styles.navButton}>
          <Text style={styles.navButtonText}>Add Recipe</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNavigateToProfile} style={styles.navButton}>
          <Text style={styles.navButtonText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("MyRecipes")} style={styles.navButton}>
          <Text style={styles.navButtonText}>My Recipes</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("MyFavorites")} style={styles.navButton}>
          <Text style={styles.navButtonText}>Favorites</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Dish Name or Category "
          placeholderTextColor="#777"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      {/* Inline Filter Pills */}
      <View style={styles.inlineCategoryContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.inlinePill,
              category === (cat === "All" ? "" : cat) && styles.inlinePillSelected
            ]}
            onPress={() => setCategory(cat === "All" ? "" : cat)}
          >
            <Text
              style={[
                styles.inlinePillText,
                category === (cat === "All" ? "" : cat) && styles.inlinePillTextSelected
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
              onPress={() =>
                navigation.navigate("RecipeDetailScreen", { recipe: item })
              }
              activeOpacity={0.85}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.recipeImage} />
              <View style={styles.recipeText}>
                <Text style={styles.recipeTitle}>{item.title}</Text>
                <Text style={styles.recipeCategory}>
                  {item.category || "Uncategorized"}
                </Text>
              </View>
              <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                <Ionicons
                  name={favoriteIds.includes(item.id) ? "heart" : "heart-outline"}
                  size={24}
                  color="tomato"
                />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F1E4", padding: 20 },
  topBar: { flexDirection: "row", justifyContent: "flex-end", marginBottom: 10 },
  logoutButton: { backgroundColor: "#FAD4D4", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  logoutText: { color: "#800000", fontWeight: "bold", fontSize: 14 },
  userBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF1D6",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    justifyContent: "center",
    gap: 6,
    alignSelf: "stretch",
    borderWidth: 1,
    borderColor: "#FFD28F"
  },
  userBoxText: { fontSize: 14, color: "#3C3C3C", fontWeight: "600" },
  heading: { fontSize: 28, fontWeight: "bold", color: "#3C3C3C", textAlign: "center", marginBottom: 20 },
  bold: { color: "#FFB84D" },
  navGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 10
  },
  navButton: {
    backgroundColor: "#F0EAD2",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    flexBasis: "48%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3
  },
  navButtonText: { color: "#1B4217", fontSize: 16, fontWeight: "bold", textAlign: "center" },
  searchContainer: { marginBottom: 15 },
  searchLabel: { fontSize: 16, fontWeight: "bold", marginBottom: 5, color: "#1B4217" },
  searchInput: {
    borderWidth: 1,
    borderColor: "#F0EAD2",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    color: "#000"
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0EAD2",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10
  },
  searchIcon: {
    marginRight: 6
  },
  searchInputWithIcon: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    color: "#000"
  },

  inlineCategoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 18,
    gap: 8
  },
  inlinePill: {
    backgroundColor: "#FFF5E0",
    borderColor: "#FFB84D",
    borderWidth: 1,
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 12
  },
  inlinePillSelected: { backgroundColor: "#FFB84D" },
  inlinePillText: { color: "#1B4217", fontWeight: "bold", fontSize: 14 },
  inlinePillTextSelected: { color: "#1B4217" },
  loader: { marginTop: 20 },
  emptyMessage: { textAlign: "center", fontSize: 18, color: "#EEE", marginTop: 20 },
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
    flex: 1
  },
  recipeImage: { width: 100, height: 100, borderRadius: 10, marginRight: 15 },
  recipeText: { flex: 1, justifyContent: "center" },
  recipeTitle: { fontSize: 18, fontWeight: "bold", color: "#1B4217" },
  recipeCategory: { fontSize: 14, color: "#555", marginTop: 4 }
});

export default HomeScreen;