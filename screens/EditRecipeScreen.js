import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { db } from '../firebaseConfig';

const EditRecipeScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { recipe } = route.params;

  const [title, setTitle] = useState(recipe.title || '');
  const [ingredients, setIngredients] = useState(recipe.ingredients || '');
  const [instructions, setInstructions] = useState(recipe.instructions || '');
  const [imageUrl, setImageUrl] = useState(recipe.imageUrl || recipe.image || '');
  const [category, setCategory] = useState(recipe.category || '');

  const handleUpdate = async () => {
    if (!title || !ingredients || !instructions) {
      Alert.alert("Please fill all required fields.");
      return;
    }

    try {
      const recipeRef = doc(db, 'recipes', recipe.id);
      await updateDoc(recipeRef, {
        title: title || '',
        ingredients: ingredients || '',
        instructions: instructions || '',
        imageUrl: imageUrl || '',
        category: category || ''
      });
      Alert.alert('Recipe updated!');
      navigation.navigate("Home"); // Navigate to HomeScreen after update
    } catch (error) {
      console.error("Error updating recipe:", error);
      Alert.alert('Failed to update recipe.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Title</Text>
        <TextInput value={title} onChangeText={setTitle} style={styles.input} placeholder="Enter title" placeholderTextColor="#777" />

        <Text style={styles.label}>Ingredients</Text>
        <TextInput value={ingredients} onChangeText={setIngredients} style={styles.input} multiline placeholder="Enter ingredients" placeholderTextColor="#777" />

        <Text style={styles.label}>Instructions</Text>
        <TextInput value={instructions} onChangeText={setInstructions} style={styles.input} multiline placeholder="Enter instructions" placeholderTextColor="#777" />

        <Text style={styles.label}>Image URL</Text>
        <TextInput value={imageUrl} onChangeText={setImageUrl} style={styles.input} placeholder="Enter image URL" placeholderTextColor="#777" />

        <Text style={styles.label}>Category</Text>
        <TextInput value={category} onChangeText={setCategory} style={styles.input} placeholder="e.g. Dessert, Veg" placeholderTextColor="#777" />

        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Update Recipe</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F8F1E4',
    padding: 20,
    justifyContent: 'center'
  },
  card: {
    backgroundColor: '#FFF9E8',
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#3C3C3C',
    fontSize: 16
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000'
  },
  button: {
    backgroundColor: '#FFB84D',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    color: '#1B4217',
    fontSize: 16,
    fontWeight: '600'
  }
});

export default EditRecipeScreen;
