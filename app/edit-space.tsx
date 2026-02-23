import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../firebaseConfig';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';

export default function EditSpace() {
  const { id, name, light } = useLocalSearchParams();
  const router = useRouter();

  const [spaceName, setSpaceName] = useState(name as string);
  const [lightCondition, setLightCondition] = useState(light as string);

  const handleUpdate = async () => {
    if (!spaceName) return Alert.alert("Error", "Space name cannot be empty");

    try {
      const spaceRef = doc(db, "spaces", id as string);
      await updateDoc(spaceRef, {
        name: spaceName,
        lightCondition: lightCondition
      });
      router.back();
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Could not update space");
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Space",
      "Are you sure? This will not delete the plants inside, but they will lose their space connection.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
              // Delete the document from Firestore
              await deleteDoc(doc(db, "spaces", id as string));
              
              // FIX: Navigate directly back to the main tabs 
              // instead of dismissing the whole navigation stack
              router.replace("/(tabs)"); 
              
            } catch (error) {
              console.error("Delete failed:", error);
              Alert.alert("Error", "Could not delete space.");
            }
          } 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Space</Text>
        <TouchableOpacity onPress={handleUpdate} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>SPACE NAME</Text>
        <TextInput 
          style={styles.input}
          value={spaceName}
          onChangeText={setSpaceName}
          placeholder="e.g. Living Room"
        />

        <Text style={styles.label}>LIGHT CONDITION</Text>
        <View style={styles.lightOptions}>
          {['Bright Direct', 'Bright Indirect', 'Low Light'].map((option) => (
            <TouchableOpacity 
              key={option}
              style={[styles.option, lightCondition === option && styles.activeOption]}
              onPress={() => setLightCondition(option)}
            >
              <Text style={[styles.optionText, lightCondition === option && styles.activeOptionText]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color="#FF4444" />
          <Text style={styles.deleteText}>Delete Space</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FBF9' },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    padding: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE' 
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  saveButton: { backgroundColor: '#2D4B2D', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  saveButtonText: { color: '#FFF', fontWeight: 'bold' },
  form: { padding: 20 },
  label: { fontSize: 12, fontWeight: 'bold', color: '#888', marginBottom: 10 },
  input: { backgroundColor: '#FFF', padding: 15, borderRadius: 15, borderWidth: 1, borderColor: '#EEE', fontSize: 16, marginBottom: 25 },
  lightOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  option: { paddingHorizontal: 15, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: '#DDD' },
  activeOption: { backgroundColor: '#2D4B2D', borderColor: '#2D4B2D' },
  optionText: { color: '#666' },
  activeOptionText: { color: '#FFF', fontWeight: 'bold' },
  deleteButton: { marginTop: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15 },
  deleteText: { color: '#FF4444', marginLeft: 10, fontWeight: '600' }
});