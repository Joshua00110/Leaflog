import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { db } from '../../firebaseConfig';
import { doc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';

export default function PlantDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [plant, setPlant] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('Care');

  // --- FETCH DATA ---
  useEffect(() => {
    if (!id) return;
    const unsub = onSnapshot(doc(db, "plants", id), (docSnap) => {
      if (docSnap.exists()) {
        setPlant({ id: docSnap.id, ...docSnap.data() });
      }
    });
    return () => unsub();
  }, [id]);

  // --- LOGIC: CALCULATE WATERING STATUS ---
  const getWateringStatus = () => {
    if (!plant?.lastWatered) return { last: "Never", overdue: "0d", isOverdue: false };

    const last = plant.lastWatered.toDate();
    const today = new Date();
    const frequency = plant.wateringFrequency || 3; 

    const diffTime = Math.abs(today.getTime() - last.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    const isOverdue = diffDays >= frequency;
    const overdueDays = isOverdue ? diffDays - frequency : 0;

    return {
      last: `${diffDays}d ago`,
      overdue: `${overdueDays}d`,
      isOverdue: isOverdue
    };
  };

  // --- LOGIC: NOTIFICATIONS (FIXED FOR image_b990a6.jpg) ---
  const scheduleWateringReminder = async (plantName: string) => {
    const days = plant?.wateringFrequency || 3;
    await Notifications.cancelAllScheduledNotificationsAsync(); 
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "LeafLog Reminder! 🌿",
        body: `Your ${plantName} is thirsty. Time to water!`,
      },
      // ✅ FIX: Added the 'type' property that was missing in your screenshot
      trigger: { 
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: Math.floor(days * 24 * 60 * 60), 
        repeats: false 
      },
    });
  };

  // --- LOGIC: WATER ACTION ---
  const handleWaterPlant = async () => {
    if (!id || !plant) return;
    try {
      const plantRef = doc(db, "plants", id);
      await updateDoc(plantRef, {
        lastWatered: serverTimestamp(),
      });
      
      await scheduleWateringReminder(plant.name);
      Alert.alert("Success!", "Watering logged.");
    } catch (error) {
      console.error("Error updating watering: ", error);
    }
  };

  if (!plant) return null;

  const status = getWateringStatus();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Image Area */}
      <View style={styles.imageCard}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={20} color="black" />
        </TouchableOpacity>

        <View style={styles.iconContainer}>
           <Ionicons name="leaf" size={80} color="#6B8E6B" />
        </View>
        
        <View style={styles.nameOverlay}>
          <Text style={styles.plantName}>{plant.name}</Text>
        </View>

        <View style={styles.locationBadge}>
          <Ionicons name="home-outline" size={14} color="#2D4B2D" />
          <Text style={styles.locationText}>{plant.space || 'Garden'}</Text>
        </View>
      </View>

      {/* Navigation Tabs */}
      <View style={styles.tabBar}>
        {['Care', 'History', 'Details'].map((tab) => (
          <TouchableOpacity 
            key={tab} 
            onPress={() => setActiveTab(tab)}
            style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.scheduleHeader}>
           <TouchableOpacity style={styles.editSchedule}>
              <Ionicons name="time-outline" size={18} color="#2D4B2D" />
              <Text style={styles.editScheduleText}>Edit Schedules</Text>
           </TouchableOpacity>
        </View>

        <View style={styles.careRow}>
          {/* Water Card */}
          <View style={styles.careCard}>
            <Text style={styles.careLabelRed}>Last: {status.last}</Text>
            
            <TouchableOpacity 
              style={[styles.waterCircle, status.isOverdue && { borderColor: '#E57373' }]} 
              onPress={handleWaterPlant}
            >
               <Ionicons name="water" size={30} color="#2D4B2D" />
               <Text style={styles.waterText}>WATER</Text>
            </TouchableOpacity>

            <Text style={styles.careLabelRed}>Overdue: {status.overdue}</Text>
            <TouchableOpacity style={styles.skipButton}>
               <Ionicons name="time-outline" size={14} color="#2D4B2D" />
               <Text style={styles.skipText}>SKIP WATERING</Text>
            </TouchableOpacity>
          </View>

          {/* Feed Card */}
          <View style={styles.careCardDisabled}>
            <Text style={styles.careLabelGray}>Tracking</Text>
            <View style={styles.feedCircle}>
                <Ionicons name="nutrition-outline" size={30} color="#CCC" />
                <Text style={styles.feedText}>FEED</Text>
            </View>
            <Text style={styles.careLabelGray}>Disabled</Text>
          </View>
        </View>

        <View style={styles.section}>
           <Text style={styles.sectionTitle}>Other actions</Text>
           <TouchableOpacity style={styles.actionBadge}>
              <Ionicons name="cloud-outline" size={16} color="#4A90E2" />
              <Text style={styles.actionText}>Mist</Text>
           </TouchableOpacity>
        </View>

        <View style={styles.section}>
           <Text style={styles.sectionTitle}>Special Notes</Text>
           <Text style={styles.notesText}>{plant.notes || "No special notes yet"}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FBF9' },
  imageCard: { 
    height: 250, backgroundColor: '#E0E4E0', margin: 15, borderRadius: 30, 
    overflow: 'hidden', position: 'relative', alignItems: 'center', justifyContent: 'center' 
  },
  iconContainer: { marginBottom: 20 },
  backButton: { position: 'absolute', top: 20, left: 20, backgroundColor: '#FFF', padding: 8, borderRadius: 12 },
  moreButton: { position: 'absolute', top: 20, right: 20, backgroundColor: '#FFF', padding: 8, borderRadius: 12 },
  nameOverlay: { 
    position: 'absolute', bottom: 60, backgroundColor: 'rgba(0,0,0,0.15)', 
    paddingHorizontal: 20, paddingVertical: 5, borderRadius: 15 
  },
  plantName: { fontSize: 28, fontWeight: 'bold', color: '#FFF' },
  locationBadge: { 
    position: 'absolute', bottom: 20, left: 20, flexDirection: 'row', 
    alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 
  },
  locationText: { marginLeft: 5, color: '#2D4B2D', fontWeight: '600' },
  tabBar: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 10, gap: 10 },
  tabItem: { paddingVertical: 8, paddingHorizontal: 25, borderRadius: 25 },
  activeTabItem: { backgroundColor: '#2D4B2D' },
  tabText: { fontSize: 16, color: '#666', fontWeight: '600' },
  activeTabText: { color: '#FFF' },
  content: { padding: 20 },
  scheduleHeader: { alignItems: 'flex-end', marginBottom: 15 },
  editSchedule: { flexDirection: 'row', alignItems: 'center' },
  editScheduleText: { color: '#2D4B2D', fontWeight: '600', marginLeft: 5 },
  careRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  careCard: { 
    width: '48%', backgroundColor: '#FFF', padding: 15, borderRadius: 24, 
    alignItems: 'center', elevation: 2 
  },
  careCardDisabled: { 
    width: '48%', backgroundColor: '#FFF', padding: 15, borderRadius: 24, 
    alignItems: 'center', opacity: 0.5 
  },
  waterCircle: { 
    width: 80, height: 80, borderRadius: 40, borderWidth: 4, borderColor: '#D5F2E3', 
    justifyContent: 'center', alignItems: 'center', marginVertical: 10 
  },
  feedCircle: {
    width: 80, height: 80, borderRadius: 40, borderWidth: 4, borderColor: '#F5F5F5', 
    justifyContent: 'center', alignItems: 'center', marginVertical: 10 
  },
  waterText: { fontSize: 10, fontWeight: 'bold', color: '#2D4B2D' },
  feedText: { fontSize: 10, fontWeight: 'bold', color: '#CCC' },
  careLabelRed: { color: '#E57373', fontSize: 12, fontWeight: '600' },
  careLabelGray: { color: '#999', fontSize: 12 },
  skipButton: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F4F0', 
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, marginTop: 10 
  },
  skipText: { fontSize: 10, fontWeight: 'bold', color: '#2D4B2D', marginLeft: 4 },
  section: { marginBottom: 25, backgroundColor: '#FFF', padding: 15, borderRadius: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 10 },
  actionBadge: { 
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    backgroundColor: '#EBF3FB', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 
  },
  actionText: { marginLeft: 8, color: '#1A1A1A', fontWeight: '500' },
  notesText: { color: '#999', fontStyle: 'italic' } 
});