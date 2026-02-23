import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { db, auth } from '../firebaseConfig'; 
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AddSpace() {
  const [spaceName, setSpaceName] = useState('');
  const [light, setLight] = useState('Partial Sun');
  const router = useRouter();

  const handleSave = async () => {
    if (!spaceName) return alert("Please name your space");

    try {
      // Save the new space to Firestore
      await addDoc(collection(db, "spaces"), {
        name: spaceName,
        lightCondition: light,
        userId: auth.currentUser?.uid, // Links the space to the logged-in user
        createdAt: new Date().toISOString(),
      });
      router.back(); // Go back to the dashboard to see the new card
    } catch (error) {
      console.error("Error adding space: ", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#2D4B2D" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Space</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>What should we call this area?</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. Living Room, Balcony" 
          value={spaceName}
          onChangeText={setSpaceName}
        />

        <Text style={styles.label}>Light Conditions</Text>
        <View style={styles.lightOptions}>
          {['Full Sun', 'Partial Sun', 'Shade'].map((option) => (
            <TouchableOpacity 
              key={option} 
              style={[styles.chip, light === option && styles.activeChip]}
              onPress={() => setLight(option)}
            >
              <Text style={[styles.chipText, light === option && styles.activeChipText]}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#2D4B2D' },
  saveText: { fontSize: 18, fontWeight: 'bold', color: '#2D4B2D' },
  form: { padding: 25 },
  label: { fontSize: 16, color: '#666', marginBottom: 10, marginTop: 20 },
  input: { backgroundColor: '#F0F4F0', padding: 15, borderRadius: 12, fontSize: 16 },
  lightOptions: { flexDirection: 'row', marginTop: 10 },
  chip: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#ADC2AD', marginRight: 10 },
  activeChip: { backgroundColor: '#2D4B2D', borderColor: '#2D4B2D' },
  chipText: { color: '#2D4B2D' },
  activeChipText: { color: '#FFF' }
});