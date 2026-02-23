import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../../../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function EditPlantScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Form State
  const [name, setName] = useState('');
  const [space, setSpace] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 1. Fetch existing plant data
  useEffect(() => {
    const fetchPlant = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "plants", id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || '');
          setSpace(data.space || '');
        } else {
          Alert.alert("Error", "Plant not found.");
          router.back();
        }
      } catch (error) {
        console.error("Error fetching plant:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlant();
  }, [id]);

  // 2. Handle Update
  const handleUpdate = async () => {
    if (!name.trim()) {
      Alert.alert("Wait", "Please give your plant a name.");
      return;
    }

    setSaving(true);
    try {
      const docRef = doc(db, "plants", id as string);
      await updateDoc(docRef, {
        name: name.trim(),
        space: space.trim(),
      });
      
      Alert.alert("Success", "Plant updated!", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error("Error updating plant:", error);
      Alert.alert("Error", "Could not save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2D4B2D" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Plant</Text>
        <View style={{ width: 40 }} /> {/* Spacer to center title */}
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Plant Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Monstera Deliciosa"
        />

        <Text style={styles.label}>Space / Room</Text>
        <TextInput
          style={styles.input}
          value={space}
          onChangeText={setSpace}
          placeholder="e.g. Living Room"
        />

        <TouchableOpacity 
          style={[styles.saveButton, saving && { opacity: 0.7 }]} 
          onPress={handleUpdate}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FBF9' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingVertical: 15,
    backgroundColor: '#FFF'
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A' },
  backButton: { padding: 8, backgroundColor: '#F0F0F0', borderRadius: 12 },
  form: { padding: 25 },
  label: { fontSize: 16, fontWeight: '600', color: '#666', marginBottom: 8 },
  input: { 
    backgroundColor: '#FFF', 
    borderWidth: 1, 
    borderColor: '#EEE', 
    borderRadius: 15, 
    padding: 15, 
    fontSize: 16, 
    marginBottom: 25 
  },
  saveButton: { 
    backgroundColor: '#2D4B2D', 
    padding: 18, 
    borderRadius: 15, 
    alignItems: 'center',
    marginTop: 10 
  },
  saveButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});