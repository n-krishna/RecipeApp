import { useNavigation } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../firebaseConfig';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#FFB84D" style={{ marginTop: 20 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>👤 <Text style={styles.bold}>Profile Details</Text></Text>

      {userData ? (
        <View style={styles.card}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{userData.name}</Text>

          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{userData.email}</Text>

          <Text style={styles.label}>Phone Number:</Text>
          <Text style={styles.value}>{userData.phoneNumber}</Text>

          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>{userData.address}</Text>

          <Text style={styles.label}>Country:</Text>
          <Text style={styles.value}>{userData.country}</Text>
        </View>
      ) : (
        <Text style={styles.emptyMessage}>No profile data found.</Text>
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back to Home</Text>
      </TouchableOpacity>
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
  card: {
    backgroundColor: "#F0EAD2",
    padding: 20,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 20
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#1B4217",
    marginTop: 10
  },
  value: {
    fontSize: 16,
    color: "#333"
  },
  emptyMessage: {
    textAlign: "center",
    color: "#999",
    fontSize: 18
  },
  backButton: {
    backgroundColor: "#FFB84D",
    padding: 12,
    borderRadius: 10,
    alignItems: "center"
  },
  backButtonText: {
    color: "#1B4217",
    fontSize: 16,
    fontWeight: "bold"
  }
});

export default ProfileScreen;
