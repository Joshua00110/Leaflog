import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Modal, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { db, auth } from '../../firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

interface Plant {
  id: string;
  name: string;
  spaceId: string;
  spaceName: string;
}

export default function SpaceDetail() {
  // 'id' is the unique ID of the space, 'name' is the title (e.g., Garden)
  const { id, name } = useLocalSearchParams<{ id: string, name: string }>();
  const router = useRouter();
  
  const [plants, setPlants] = useState<Plant[]>([]);
  const [layout, setLayout] = useState('Compact');

  useEffect(() => {
    const user = auth.currentUser;
    if (!user || !id) return;

    // Filter plants to only show those belonging to THIS space ID
    const q = query(
      collection(db, "plants"), 
      where("userId", "==", user.uid),
      where("spaceId", "==", id) 
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const plantList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Plant));
      setPlants(plantList);
    });

    return () => unsubscribe();
  }, [id]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerCard}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2D4B2D" />
        </TouchableOpacity>
        
        <Text style={styles.spaceTitle}>{name || "Space Details"}</Text>
        
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Ionicons name="leaf-outline" size={14} color="#2D4B2D" />
            <Text style={styles.badgeText}>{plants.length} {plants.length === 1 ? 'plant' : 'plants'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Your Plants</Text>
        
        {/* Layout Switcher */}
        <View style={styles.layoutToggle}>
           <TouchableOpacity 
             style={[styles.toggleBtn, layout === 'Compact' && styles.activeToggle]}
             onPress={() => setLayout('Compact')}
           >
             <Ionicons name="grid-outline" size={16} color={layout === 'Compact' ? "#2D4B2D" : "#666"} />
             <Text style={[styles.toggleText, layout === 'Compact' && styles.activeToggleText]}>Compact</Text>
           </TouchableOpacity>
           
           <TouchableOpacity 
             style={[styles.toggleBtn, layout === 'Detailed' && styles.activeToggle]}
             onPress={() => setLayout('Detailed')}
           >
             <Ionicons name="list-outline" size={16} color={layout === 'Detailed' ? "#2D4B2D" : "#666"} />
             <Text style={[styles.toggleText, layout === 'Detailed' && styles.activeToggleText]}>Detailed</Text>
           </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {plants.length === 0 ? (
            <Text style={styles.emptyText}>No plants in this space yet.</Text>
          ) : (
            plants.map((plant) => (
              <View key={plant.id}>
                {/* NAVIGATION WRAPPER */}
                <Link 
                  href={{
                    pathname: "/plant/[id]",
                    params: { id: plant.id }
                  }}
                  asChild
                >
                  <TouchableOpacity style={styles.plantCard} activeOpacity={0.7}>
                    <View style={styles.plantIcon}>
                       <Ionicons name="leaf" size={30} color="#6B8E6B" />
                    </View>

                    <View style={styles.plantInfo}>
                      <Text style={styles.plantName}>{plant.name}</Text>
                      <View style={styles.taskBadge}>
                        <Text style={styles.taskText}>1 task</Text>
                      </View>
                    </View>

                    <View style={styles.cardActions}>
                      <TouchableOpacity 
                        style={styles.actionIcon}
                        onPress={(e) => {
                          e.stopPropagation(); // Stops navigation from firing
                          alert("Watered!");
                        }}
                      >
                        <Ionicons name="water" size={20} color="#4A90E2" />
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                         onPress={(e) => {
                           e.stopPropagation(); // Stops navigation from firing
                           alert("Options Menu");
                         }}
                      >
                        <Ionicons name="ellipsis-horizontal" size={20} color="#CCC" />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </Link>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FBF9' },
  headerCard: { padding: 20, backgroundColor: '#FFF', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 2 },
  backButton: { marginBottom: 10, width: 40 },
  spaceTitle: { fontSize: 32, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 10 },
  badgeRow: { flexDirection: 'row' },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#D5F2E3', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
  badgeText: { marginLeft: 5, color: '#2D4B2D', fontWeight: '600', fontSize: 13 },
  content: { flex: 1, padding: 20 },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  layoutToggle: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  toggleBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
  activeToggle: { backgroundColor: '#D5F2E3' },
  toggleText: { marginLeft: 5, color: '#666' },
  activeToggleText: { color: '#2D4B2D', fontWeight: 'bold' },
  plantCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 12, elevation: 1 },
  plantIcon: { width: 70, height: 70, backgroundColor: '#F0F4F0', borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  plantInfo: { flex: 1, marginLeft: 15 },
  plantName: { fontSize: 20, fontWeight: 'bold' },
  taskBadge: { backgroundColor: '#FFF3E0', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, alignSelf: 'flex-start', marginTop: 4 },
  taskText: { color: '#FFB74D', fontSize: 12, fontWeight: 'bold' },
  cardActions: { alignItems: 'center', justifyContent: 'space-between', height: 70 },
  actionIcon: { width: 35, height: 35, borderRadius: 18, backgroundColor: '#EAF4FF', justifyContent: 'center', alignItems: 'center' },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 16 }
});