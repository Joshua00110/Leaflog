import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db, auth } from '../../firebaseConfig'; 
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { Link, useRouter } from 'expo-router';

interface Plant {
  id: string;
  name: string;
  space: string;
  nextWater: string;
}

export default function PlantsScreen() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [activeTab, setActiveTab] = useState('Today');
  const router = useRouter();

  // --- MENU STATE ---
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    // Filter plants by current user
    const q = query(collection(db, "plants"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const plantList = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Plant));
      setPlants(plantList);
    });
    
    return () => unsubscribe();
  }, []);

  const handleOpenMenu = (plant: Plant) => {
    setSelectedPlant(plant);
    setMenuVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header Section */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>My Plants</Text>
          <TouchableOpacity style={styles.retiredButton}>
            <Ionicons name="archive-outline" size={18} color="#444" />
            <Text style={styles.retiredText}>Retired Plants</Text>
          </TouchableOpacity>
        </View>

        {/* Attention Banner */}
        <View style={styles.attentionBanner}>
          <Ionicons name="leaf-outline" size={18} color="#2D4B2D" />
          <Text style={styles.attentionText}>
            {plants.length} {plants.length === 1 ? 'plant needs' : 'plants need'} attention today
          </Text>
        </View>

        {/* Today / Upcoming Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleTab, activeTab === 'Today' && styles.activeTab]}
            onPress={() => setActiveTab('Today')}
          >
            <Text style={[styles.toggleText, activeTab === 'Today' && styles.activeTabText]}>Today</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleTab, activeTab === 'Upcoming' && styles.activeTab]}
            onPress={() => setActiveTab('Upcoming')}
          >
            <Text style={[styles.toggleText, activeTab === 'Upcoming' && styles.activeTabText]}>Upcoming</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#999" />
          <TextInput 
            placeholder="Search plants or spaces" 
            style={styles.searchInput}
            placeholderTextColor="#999"
          />
        </View>

        {/* Plant Cards */}
        {plants.map((plant) => (
          <View key={plant.id}>
            <Link 
              href={{
                pathname: "/plant/[id]",
                params: { id: plant.id }
              }} 
              asChild
            >
              <TouchableOpacity 
                style={styles.plantCard}
                activeOpacity={0.7}
              >
                <View style={styles.plantIconBox}>
                  <Ionicons name="leaf" size={30} color="#6B8E6B" />
                </View>
                
                <View style={styles.plantInfo}>
                  <Text style={styles.plantName}>{plant.name || "Unnamed Plant"}</Text>
                  <Text style={styles.plantSpace}>{plant.space || "No Space"}</Text>
                  
                  <View style={styles.taskRow}>
                    <Ionicons name="water" size={16} color="#E6B800" />
                    <Text style={styles.taskTextYellow}>Water: Due today</Text>
                  </View>
                </View>

                <View style={styles.cardActions}>
                   <TouchableOpacity 
                     style={styles.waterButton} 
                     onPress={(e) => { 
                       e.stopPropagation(); 
                       alert('Watered!'); 
                     }}
                   >
                      <Ionicons name="water" size={20} color="#4A90E2" />
                   </TouchableOpacity>
                   
                   <TouchableOpacity 
                     onPress={(e) => {
                       e.stopPropagation(); 
                       handleOpenMenu(plant);
                     }}
                   >
                      <Ionicons name="ellipsis-horizontal" size={20} color="#999" />
                   </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Link>
          </View>
        ))}

      </ScrollView>

      {/* --- OPTIONS MODAL --- */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuContainer}>
            <Text style={styles.menuTitle}>{selectedPlant?.name}</Text>
            
            <TouchableOpacity 
                style={styles.menuOption} 
                onPress={() => {
                    setMenuVisible(false);
                    if (selectedPlant) {
                        router.push({
                            pathname: "/plant/[id]",
                            params: { id: selectedPlant.id }
                        });
                    }
                }}
            >
              <Ionicons name="eye-outline" size={20} color="#2D4B2D" />
              <Text style={styles.menuOptionText}>View Details</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.menuOption} 
                onPress={() => {
                    setMenuVisible(false);
                    alert(`Editing ${selectedPlant?.name}`);
                }}
            >
              <Ionicons name="create-outline" size={20} color="#2D4B2D" />
              <Text style={styles.menuOptionText}>Edit Plant</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={[styles.menuOption, { borderTopColor: '#FFE5E5' }]} 
                onPress={() => {
                    setMenuVisible(false);
                    alert("Delete feature");
                }}
            >
              <Ionicons name="trash-outline" size={20} color="#FF4444" />
              <Text style={[styles.menuOptionText, { color: '#FF4444' }]}>Remove Plant</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FBF9' },
  scrollContent: { padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#1A1A1A' },
  retiredButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F0F0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#DDD' },
  retiredText: { marginLeft: 6, fontSize: 14, color: '#444', fontWeight: '500' },
  attentionBanner: { backgroundColor: '#D5F2E3', flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 25, marginBottom: 25 },
  attentionText: { marginLeft: 8, color: '#1A1A1A', fontWeight: '600', fontSize: 15 },
  toggleContainer: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 30, padding: 4, marginBottom: 20, borderWidth: 1, borderColor: '#EEE' },
  toggleTab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 25 },
  activeTab: { backgroundColor: '#2D4B2D' },
  toggleText: { fontSize: 18, fontWeight: '600', color: '#666' },
  activeTabText: { color: '#FFF' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 15, paddingVertical: 12, borderRadius: 15, marginBottom: 20, borderWidth: 1, borderColor: '#EEE' },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
  plantCard: { backgroundColor: '#FFF', borderRadius: 25, padding: 15, flexDirection: 'row', alignItems: 'center', marginBottom: 15, elevation: 1 },
  plantIconBox: { width: 80, height: 80, backgroundColor: '#F0F4F0', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  plantInfo: { flex: 1, marginLeft: 15 },
  plantName: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A' },
  plantSpace: { fontSize: 14, color: '#888', marginBottom: 8 },
  taskRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  taskTextYellow: { marginLeft: 6, color: '#B8860B', fontWeight: '600' },
  cardActions: { alignItems: 'center', justifyContent: 'space-between', height: 80 },
  waterButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EAF4FF', justifyContent: 'center', alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  menuContainer: { width: 250, backgroundColor: '#FFF', borderRadius: 20, padding: 20, elevation: 5 },
  menuTitle: { fontSize: 16, fontWeight: 'bold', color: '#666', marginBottom: 15, textAlign: 'center' },
  menuOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#EEE' },
  menuOptionText: { fontSize: 16, color: '#2D4B2D', marginLeft: 10, fontWeight: '500' }
});