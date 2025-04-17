import { useNavigation } from "@react-navigation/native";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth, db } from "../firebaseConfig";

export default function MyFavoritesScreen() {
  const [favorites, setFavorites] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchFavorites = async () => {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      const favIds = userSnap.exists() ? userSnap.data().favorites || [] : [];

      const recipeDocs = await getDocs(collection(db, "recipes"));
      const favoriteRecipes = recipeDocs.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(recipe => favIds.includes(recipe.id));
      setFavorites(favoriteRecipes);
    };

    fetchFavorites();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>❤️ My Favorites</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.recipeCard}
            onPress={() => navigation.navigate("RecipeDetailScreen", { recipe: item })}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <View>
              <Text style={styles.title}>{item.title}</Text>
              <Text>{item.category}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FFF8F1" },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  recipeCard: {
    flexDirection: "row",
    marginBottom: 12,
    backgroundColor: "#F0EAD2",
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  image: { width: 80, height: 80, borderRadius: 10, marginRight: 10 },
  title: { fontSize: 18, fontWeight: "bold" },
});
