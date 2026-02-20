import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';

export default function NotificationPermission() {
  const router = useRouter();

  const handlePermission = async () => {
    try {
      // Basic check for physical device/emulator capabilities
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
        });
      }

      const { status } = await Notifications.requestPermissionsAsync();
      console.log("Permission Status:", status);
    } catch (error) {
      // This catches the "Android Push notifications" console error you saw
      console.warn("Notification initialization failed. Skipping to Dashboard.");
    } finally {
      // Always move to the tabs regardless of error
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.infoCard}>
        <Text style={styles.kicker}>KEEP YOUR PLANTS THRIVING</Text>
        <Text style={styles.title}>Stay effortlessly on track</Text>
        <Text style={styles.description}>
          Turn on notifications so Leaflog can nudge you before chores pile up.
        </Text>
      </View>

      <View style={styles.illustrationContainer}>
        <Image 
          source={{ uri: 'https://img.freepik.com/free-vector/communication-concept-illustration_114360-1234.jpg' }} 
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryButton} onPress={handlePermission}>
          <Text style={styles.primaryButtonText}>Turn on notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.secondaryButtonText}>Maybe later</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8F0E8', alignItems: 'center' },
  infoCard: { backgroundColor: '#FFF', width: '90%', marginTop: 40, padding: 25, borderRadius: 30 },
  kicker: { fontSize: 12, fontWeight: 'bold', color: '#6B8E6B', marginBottom: 8 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#2D4B2D', marginBottom: 12 },
  description: { fontSize: 16, color: '#4A6B4A', lineHeight: 22 },
  illustrationContainer: { flex: 1, justifyContent: 'center' },
  image: { width: 300, height: 250 },
  footer: { width: '100%', paddingHorizontal: 30, paddingBottom: 40 },
  primaryButton: { backgroundColor: '#2D4B2D', padding: 20, borderRadius: 35, alignItems: 'center', marginBottom: 12 },
  primaryButtonText: { color: 'white', fontSize: 18, fontWeight: '600' },
  secondaryButton: { padding: 18, borderRadius: 35, alignItems: 'center', borderWidth: 1, borderColor: '#ADC2AD' },
  secondaryButtonText: { color: '#2D4B2D', fontSize: 18, fontWeight: '600' }
});