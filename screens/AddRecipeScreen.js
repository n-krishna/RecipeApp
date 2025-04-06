import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const AddRecipeScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState(''); // ✅ New state

  const handleAddRecipe = async () => {
    if (!title || !ingredients || !instructions || !category) {
      Alert.alert("All fields are required (except image).");
      return;
    }

    try {
      await addDoc(collection(db, 'recipes'), {
        title,
        ingredients,
        instructions,
        imageUrl,
        category, // ✅ Included in Firestore
        userId: auth.currentUser.uid,
        createdAt: new Date()
      });

      Alert.alert("Recipe added successfully!");
      setTitle('');
      setIngredients('');
      setInstructions('');
      setImageUrl('');
      setCategory(''); // ✅ Clear field after submit
      navigation.goBack();
    } catch (error) {
      console.error("Error adding recipe: ", error);
      Alert.alert("Error adding recipe.");
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

      <Text style={styles.label}>Image URL (optional)</Text>
      <TextInput value={imageUrl} onChangeText={setImageUrl} style={styles.input} />

      <Text style={styles.label}>Category (e.g., Veg, Dessert, Main)</Text>
      <TextInput value={category} onChangeText={setCategory} style={styles.input} />

      <Button title="Add Recipe" onPress={handleAddRecipe} />
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

export default AddRecipeScreen;
