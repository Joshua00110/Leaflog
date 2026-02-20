import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { db } from '../../firebaseConfig'; 
import { collection, onSnapshot, query } from 'firebase/firestore';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Space {
  id: string;
  name: string;
  lightCondition: string;
}

export default function HomeDashboard() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [totalPlants, setTotalPlants] = useState(0);

  useEffect(() => {
    // Sync Dynamic Spaces
    const qSpaces = query(collection(db, "spaces"));
    const unsubSpaces = onSnapshot(qSpaces, (snapshot) => {
      setSpaces(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Space)));
    });

    // Sync total plant count for the top stat card
    const qPlants = query(collection(db, "plants"));
    const unsubPlants = onSnapshot(qPlants, (snapshot) => {
      setTotalPlants(snapshot.size);
    });

    return () => { unsubSpaces(); unsubPlants(); };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header with Stats */}
        <View style={styles.headerCard}>
          <Text style={styles.brandTitle}>Leaflog</Text>
          <Text style={styles.greeting}>Hi, gardener.</Text>

          <View style={styles.statsRow}>
            <View style={[styles.statsCard, { backgroundColor: '#E0F2F1' }]}>
              <Text style={styles.statsNumber}>{totalPlants}</Text>
              <Text style={styles.statsLabel}>Total Plants</Text>
            </View>
            <View style={[styles.statsCard, { backgroundColor: '#F5F5F5' }]}>
              <Text style={styles.statsNumber}>{spaces.length}</Text>
              <Text style={styles.statsLabel}>Active Spaces</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Your plant spaces</Text>
        <Text style={styles.sectionSubtitle}>Tap a space to view its plants</Text>

        {/* 1. Dynamic Spaces: These will appear here as you add them */}
        {spaces.map((space) => (
          <TouchableOpacity key={space.id} style={styles.spaceCard}>
            <View style={styles.spaceIconBox}>
              <Ionicons name="leaf-outline" size={32} color="#2D4B2D" />
            </View>
            <View style={styles.spaceInfo}>
              <View style={styles.spaceHeader}>
                <Text style={styles.spaceName}>{space.name}</Text>
                <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
              </View>
              <Text style={styles.spaceDetail}>Light: {space.lightCondition}</Text>
              <View style={styles.statusRow}>
                <Ionicons name="sparkles" size={16} color="#6B8E6B" />
                <Text style={styles.statusText}>Connected</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* 2. Permanent Retired Plants Card */}
        <TouchableOpacity style={styles.retiredCard}>
          <View style={styles.retiredIconBox}>
            <Ionicons name="archive-outline" size={24} color="#2D4B2D" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.retiredTitle}>Retired plants</Text>
            <Text style={styles.retiredSub}>Plant graveyard - visit past blooms anytime.</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

      </ScrollView>

      {/* Floating Action Button to add new Spaces */}
      <Link href="/add" asChild>
        <TouchableOpacity style={styles.fab}>
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FBF9' },
  scrollContent: { padding: 20 },
  headerCard: { backgroundColor: '#FFF', borderRadius: 28, padding: 20, marginBottom: 25 },
  brandTitle: { fontSize: 40, fontWeight: 'bold', color: '#2D4B2D', fontFamily: 'serif' },
  greeting: { fontSize: 18, color: '#666', marginBottom: 20 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statsCard: { width: '48%', padding: 15, borderRadius: 16 },
  statsNumber: { fontSize: 26, fontWeight: 'bold', color: '#2D4B2D' },
  statsLabel: { fontSize: 14, color: '#444' },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', color: '#1A1A1A' },
  sectionSubtitle: { fontSize: 16, color: '#666', marginBottom: 20 },
  spaceCard: { 
    backgroundColor: '#FFF', borderRadius: 24, padding: 16, flexDirection: 'row', 
    alignItems: 'center', marginBottom: 15, elevation: 1 
  },
  spaceIconBox: { width: 80, height: 80, backgroundColor: '#F0F4F0', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  spaceInfo: { flex: 1, marginLeft: 15 },
  spaceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  spaceName: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A' },
  spaceDetail: { fontSize: 14, color: '#666', marginTop: 2 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  statusText: { marginLeft: 6, color: '#6B8E6B', fontWeight: '600' },
  retiredCard: { 
    backgroundColor: '#FFF', borderRadius: 24, padding: 16, flexDirection: 'row', 
    alignItems: 'center', marginTop: 10, elevation: 1 
  },
  retiredIconBox: { width: 50, height: 50, backgroundColor: '#F0F4F0', borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  retiredTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  retiredSub: { fontSize: 12, color: '#666' },
  fab: { 
    position: 'absolute', bottom: 30, right: 30, backgroundColor: '#2D4B2D', 
    width: 65, height: 65, borderRadius: 32.5, justifyContent: 'center', alignItems: 'center', elevation: 5 
  }
});