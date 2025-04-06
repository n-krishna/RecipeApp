import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useRoute, useNavigation } from '@react-navigation/native';

const EditRecipeScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { recipe } = route.params;

  const [title, setTitle] = useState(recipe.title);
  const [ingredients, setIngredients] = useState(recipe.ingredients);
  const [instructions, setInstructions] = useState(recipe.instructions);
  const [imageUrl, setImageUrl] = useState(recipe.imageUrl || recipe.image || '');

  const [category, setCategory] = useState(recipe.category || '');

  const handleUpdate = async () => {
    try {
      const recipeRef = doc(db, 'recipes', recipe.id);
      await updateDoc(recipeRef, {
        title,
        ingredients,
        instructions,
        imageUrl,
        category
      });
      Alert.alert('Recipe updated!');
      navigation.goBack();
    } catch (error) {
      console.error("Error updating recipe:", error);
      Alert.alert('Failed to update recipe.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput value={title} onChangeText={setTitle} style={styles.input} />

      <Text style={styles.label}>Ingredients</Text>
      <TextInput value={ingredients} onChangeText={setIngredients} style={styles.input} multiline />

      <Text style={styles.label}>Instructions</Text>
      <TextInput value={instructions} onChangeText={setInstructions} style={styles.input} multiline />

      <Text style={styles.label}>Image URL</Text>
      <TextInput value={imageUrl} onChangeText={setImageUrl} style={styles.input} />

      <Text style={styles.label}>Category</Text>
      <TextInput value={category} onChangeText={setCategory} style={styles.input} />

      <Button title="Update Recipe" onPress={handleUpdate} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16
  },
  label: {
    marginBottom: 4,
    fontWeight: 'bold'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    padding: 8,
    borderRadius: 4
  }
});

export default EditRecipeScreen;
