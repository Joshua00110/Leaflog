import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../firebaseConfig';
import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();
  const user = auth.currentUser;

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace('/auth');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>Settings</Text>

        {/* ACCOUNT SECTION */}
        <Text style={styles.sectionHeader}>ACCOUNT</Text>
        <View style={styles.card}>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.email?.charAt(0).toUpperCase() || 'G'}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user?.displayName || "Gardener"}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="create-outline" size={16} color="#2D4B2D" />
              <Text style={styles.editButtonText}>EDIT</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.card} onPress={handleSignOut}>
          <View style={styles.itemRow}>
            <View style={[styles.iconBox, { backgroundColor: '#E8F0E8' }]}>
              <Ionicons name="log-out-outline" size={22} color="#2D4B2D" />
            </View>
            <View style={styles.itemTextContainer}>
              <Text style={styles.itemTitle}>Sign Out</Text>
              <Text style={styles.itemSub}>Leave Leaflog on this device</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* PREFERENCES SECTION */}
        <Text style={styles.sectionHeader}>PREFERENCES</Text>
        <View style={styles.card}>
          <View style={styles.itemRow}>
            <View style={[styles.iconBox, { backgroundColor: '#E8F0E8' }]}>
              <Ionicons name="notifications-outline" size={22} color="#2D4B2D" />
            </View>
            <View style={styles.itemTextContainer}>
              <Text style={styles.itemTitle}>Notifications</Text>
              <Text style={styles.itemSub}>Enable system reminders</Text>
            </View>
            <Switch value={true} trackColor={{ false: "#DDD", true: "#6B8E6B" }} />
          </View>
          
          <View style={styles.divider} />

          <TouchableOpacity style={styles.itemRow}>
            <View style={[styles.iconBox, { backgroundColor: '#E8F0E8' }]}>
              <Ionicons name="time-outline" size={22} color="#2D4B2D" />
            </View>
            <View style={styles.itemTextContainer}>
              <Text style={styles.itemTitle}>Reminder time</Text>
              <Text style={styles.itemSub}>Choose when notifications are sent</Text>
            </View>
            <Text style={styles.valueText}>09:00</Text>
            <Ionicons name="chevron-forward" size={18} color="#CCC" />
          </TouchableOpacity>
        </View>

        {/* ABOUT SECTION */}
        <Text style={styles.sectionHeader}>ABOUT</Text>
        <View style={styles.card}>
          {['Help & Support', 'Privacy Policy', 'Terms & Conditions'].map((item, index) => (
            <View key={item}>
              <TouchableOpacity style={styles.itemRow}>
                <View style={[styles.iconBox, { backgroundColor: '#E8F0E8' }]}>
                  <Ionicons name="document-text-outline" size={22} color="#2D4B2D" />
                </View>
                <View style={styles.itemTextContainer}>
                  <Text style={styles.itemTitle}>{item}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#CCC" />
              </TouchableOpacity>
              {index < 2 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* DANGER ZONE */}
        <Text style={styles.sectionHeader}>DANGER ZONE</Text>
        <TouchableOpacity style={[styles.card, { backgroundColor: '#FFF5F5' }]}>
          <View style={styles.itemRow}>
            <View style={[styles.iconBox, { backgroundColor: '#FFEBEB' }]}>
              <Ionicons name="trash-outline" size={22} color="#D9534F" />
            </View>
            <View style={styles.itemTextContainer}>
              <Text style={[styles.itemTitle, { color: '#D9534F' }]}>Delete Account</Text>
              <Text style={styles.itemSub}>Remove your data permanently</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#D9534F" />
          </View>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FBF9' },
  scrollContent: { padding: 20 },
  pageTitle: { fontSize: 34, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 25 },
  sectionHeader: { fontSize: 13, fontWeight: 'bold', color: '#888', marginBottom: 10, marginTop: 15, letterSpacing: 1 },
  card: { backgroundColor: '#FFF', borderRadius: 20, padding: 15, marginBottom: 15, elevation: 1 },
  profileRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#2D4B2D', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  profileInfo: { flex: 1, marginLeft: 15 },
  userName: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  userEmail: { fontSize: 14, color: '#666' },
  editButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F4F0', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: '#ADC2AD' },
  editButtonText: { fontSize: 12, fontWeight: 'bold', color: '#2D4B2D', marginLeft: 4 },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  iconBox: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  itemTextContainer: { flex: 1, marginLeft: 15 },
  itemTitle: { fontSize: 16, fontWeight: '600', color: '#1A1A1A' },
  itemSub: { fontSize: 13, color: '#888', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 10 },
  valueText: { fontSize: 16, color: '#1A1A1A', marginRight: 10, fontWeight: '500' }
});