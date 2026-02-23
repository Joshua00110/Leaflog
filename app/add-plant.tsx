import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { db, auth } from '../firebaseConfig'; // Added auth import here
import { collection, addDoc } from 'firebase/firestore';

export default function AddPlant() {
  const { spaceId } = useLocalSearchParams(); // Passed from the Space screen
  const router = useRouter();
  
  // Form State
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [category, setCategory] = useState('Select a category');
  const [careActions, setCareActions] = useState(['Water']);
  const [notes, setNotes] = useState('');
  const [environment, setEnvironment] = useState('Indoor');

  const handleSave = async () => {
    if (!name) {
      alert("Plant name is required");
      return;
    }

    try {
      // Logic for each user having separated data
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in to add a plant.");
        return;
      }

      await addDoc(collection(db, "plants"), {
        name,
        species,
        category,
        spaceId,      // Links the plant to the specific room/space
        userId: user.uid, // CRITICAL: Links the plant to the specific user
        tasks: careActions,
        notes,
        environment,
        createdAt: new Date().toISOString()
      });
      
      router.back();
    } catch (e) {
      console.error("Error adding plant: ", e);
      alert("Failed to save plant.");
    }
  };

  const toggleAction = (action: string) => {
    setCareActions(prev => 
      prev.includes(action) ? prev.filter(a => a !== action) : [...prev, action]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={28} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add New Plant</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          {/* Section 1: Basic Info */}
          <View style={styles.section}>
            <Text style={styles.fieldLabel}>PLANT NAME *</Text>
            <TextInput 
              style={styles.textInput} 
              placeholder="e.g. Snake Plant" 
              value={name} 
              onChangeText={setName} 
            />
            
            <Text style={styles.fieldLabel}>SPECIES (OPTIONAL)</Text>
            <TextInput 
              style={styles.textInput} 
              placeholder="e.g. Ficus" 
              value={species} 
              onChangeText={setSpecies} 
            />

            <Text style={styles.fieldLabel}>Category</Text>
            <TouchableOpacity style={styles.categoryPicker}>
              <Ionicons name="leaf-outline" size={20} color="#6B8E6B" />
              <Text style={styles.categoryText}>{category}</Text>
              <Ionicons name="chevron-down" size={20} color="#999" />
            </TouchableOpacity>
          </View>

          {/* Section 2: Care Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Care actions</Text>
            <Text style={styles.subLabel}>Tap to choose which tasks you track for this plant.</Text>
            
            <View style={styles.chipGrid}>
              {['Water', 'Feed', 'Clean', 'Medicate', 'Mist', 'Prune', 'Repot', 'Rotate'].map(task => (
                <TouchableOpacity 
                  key={task} 
                  style={[styles.chip, careActions.includes(task) && styles.chipActive]}
                  onPress={() => toggleAction(task)}
                >
                  <Ionicons 
                    name={task === 'Water' ? 'water' : 'leaf'} 
                    size={14} 
                    color={careActions.includes(task) ? '#FFF' : '#666'} 
                  />
                  <Text style={[styles.chipText, careActions.includes(task) && styles.chipTextActive]}> {task}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {careActions.includes('Water') && (
              <View style={styles.taskDetailCard}>
                <View style={styles.taskDetailHeader}>
                  <Ionicons name="water" size={22} color="#2D4B2D" />
                  <Text style={styles.taskDetailTitle}>Water</Text>
                  <Text style={styles.freqLabel}>every</Text>
                  <View style={styles.numberBox}><Text style={styles.numberText}>7</Text></View>
                  <Text style={styles.freqLabel}>days</Text>
                  <Ionicons name="close-circle-outline" size={20} color="#CCC" />
                </View>
                <Text style={styles.lastLogged}>Last: Not recorded yet</Text>
              </View>
            )}
          </View>

          {/* Section 3: Notes */}
          <View style={styles.section}>
            <Text style={styles.fieldLabel}>SPECIAL NOTES</Text>
            <TextInput 
              style={[styles.textInput, { height: 100, textAlignVertical: 'top' }]} 
              placeholder="Optional notes about care, location, or special requirements..." 
              multiline
              value={notes}
              onChangeText={setNotes}
            />
          </View>

          {/* Section 4: Environment */}
          <View style={styles.section}>
            <Text style={styles.fieldLabel}>Environment</Text>
            <Text style={styles.subLabel}>Choose where this plant lives most of the time.</Text>
            <View style={styles.envRow}>
              <TouchableOpacity 
                style={[styles.envButton, environment === 'Indoor' && styles.envButtonActive]}
                onPress={() => setEnvironment('Indoor')}
              >
                <Ionicons name="home" size={18} color={environment === 'Indoor' ? '#FFF' : '#666'} />
                <Text style={[styles.envText, environment === 'Indoor' && styles.envTextActive]}> Indoor</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.envButton, environment === 'Outdoor' && styles.envButtonActive]}
                onPress={() => setEnvironment('Outdoor')}
              >
                <Ionicons name="sunny" size={18} color={environment === 'Outdoor' ? '#FFF' : '#666'} />
                <Text style={[styles.envText, environment === 'Outdoor' && styles.envTextActive]}> Outdoor</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FBF9' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE'
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A' },
  saveButton: { backgroundColor: '#F0F4F0', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  saveButtonText: { color: '#2D4B2D', fontWeight: 'bold', fontSize: 16 },
  form: { padding: 15 },
  section: { backgroundColor: '#FFF', padding: 20, borderRadius: 25, marginBottom: 20, elevation: 1 },
  fieldLabel: { fontSize: 12, fontWeight: 'bold', color: '#888', marginBottom: 10, letterSpacing: 0.5 },
  textInput: { 
    backgroundColor: '#FFF', 
    padding: 15, 
    borderRadius: 15, 
    borderWidth: 1, 
    borderColor: '#EEE', 
    fontSize: 16, 
    marginBottom: 15,
    color: '#1A1A1A'
  },
  categoryPicker: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 15, 
    borderRadius: 15, 
    borderWidth: 1, 
    borderColor: '#EEE' 
  },
  categoryText: { flex: 1, marginLeft: 10, color: '#666', fontSize: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 5 },
  subLabel: { fontSize: 14, color: '#666', marginBottom: 20 },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 15, 
    paddingVertical: 10, 
    borderRadius: 25, 
    borderWidth: 1, 
    borderColor: '#DDD', 
    marginRight: 10, 
    marginBottom: 10 
  },
  chipActive: { backgroundColor: '#2D4B2D', borderColor: '#2D4B2D' },
  chipText: { color: '#666', fontWeight: '600' },
  chipTextActive: { color: '#FFF' },
  taskDetailCard: { 
    marginTop: 15, 
    padding: 15, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#EEE',
    backgroundColor: '#FAFAFA'
  },
  taskDetailHeader: { flexDirection: 'row', alignItems: 'center' },
  taskDetailTitle: { flex: 1, fontSize: 18, fontWeight: '600', marginLeft: 10 },
  freqLabel: { color: '#666', marginHorizontal: 5 },
  numberBox: { backgroundColor: '#FFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: '#EEE' },
  numberText: { fontWeight: 'bold' },
  lastLogged: { fontSize: 13, color: '#999', marginTop: 15 },
  envRow: { flexDirection: 'row', marginTop: 10 },
  envButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 12, 
    borderRadius: 25, 
    borderWidth: 1, 
    borderColor: '#DDD', 
    marginRight: 15 
  },
  envButtonActive: { backgroundColor: '#2D4B2D', borderColor: '#2D4B2D' },
  envText: { color: '#666', fontWeight: 'bold' },
  envTextActive: { color: '#FFF' }
});