import { addDoc, collection } from 'firebase/firestore';
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
import { auth, db } from '../firebaseConfig';

const AddRecipeScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');

  const handleAddRecipe = async () => {
    if (!title || !ingredients || !instructions || !category) {
      Alert.alert("All fields are required (except image).");
      return;
    }

    try {
      await addDoc(collection(db, "recipes"), {
        title,
        ingredients,
        instructions,
        category,
        imageUrl,
        userId: auth.currentUser.uid, 
        createdAt: new Date()
      });

      Alert.alert("Recipe added successfully!");
      setTitle('');
      setIngredients('');
      setInstructions('');
      setImageUrl('');
      setCategory('');
      navigation.goBack();
    } catch (error) {
      console.error("Error adding recipe: ", error);
      Alert.alert("Error adding recipe.");
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

        <Text style={styles.label}>Image URL (optional)</Text>
        <TextInput value={imageUrl} onChangeText={setImageUrl} style={styles.input} placeholder="Enter image URL" placeholderTextColor="#777" />

        <Text style={styles.label}>Category (e.g., Veg, Dessert, Main)</Text>
        <TextInput value={category} onChangeText={setCategory} style={styles.input} placeholder="Enter category" placeholderTextColor="#777" />

        <TouchableOpacity style={styles.button} onPress={handleAddRecipe}>
          <Text style={styles.buttonText}>Add Recipe</Text>
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
    borderColor: '#C2B280',
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

export default AddRecipeScreen;
