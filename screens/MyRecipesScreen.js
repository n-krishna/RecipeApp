import { useNavigation } from "@react-navigation/native";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { auth, db } from "../firebaseConfig";

export default function MyRecipesScreen() {
  const [myRecipes, setMyRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const userId = auth.currentUser.uid;
    const myRecipeQuery = query(
      collection(db, "recipes"),
      where("userId", "==", userId)
    );

    const unsubscribe = onSnapshot(myRecipeQuery, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMyRecipes(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📋 My Recipes</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#FFB84D" />
      ) : myRecipes.length === 0 ? (
        <Text style={styles.empty}>No recipes created yet.</Text>
      ) : (
        <FlatList
          data={myRecipes}
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF9F2", padding: 20 },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  empty: { textAlign: "center", marginTop: 30, color: "#777" },
  recipeCard: {
    flexDirection: "row",
    marginBottom: 12,
    padding: 10,
    backgroundColor: "#F0EAD2",
    borderRadius: 12,
    alignItems: "center"
  },
  image: { width: 80, height: 80, borderRadius: 10, marginRight: 10 },
  title: { fontSize: 18, fontWeight: "bold" }
});
