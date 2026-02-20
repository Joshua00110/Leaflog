import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

export default function LandingPage() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.brandCard}>
        <Text style={styles.brandTitle}>Leaflog</Text>
        <Text style={styles.brandSubtitle}>Simple coordination. Thriving plants. 🌱</Text>
      </View>

      <View style={styles.illustrationContainer}>
        <Image 
          source={{ uri: 'https://img.freepik.com/free-vector/garden-concept-illustration_114360-3164.jpg' }} 
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={styles.footer}>
        {/* UPDATED: Navigates to the notification permission screen first */}
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push('/notifications')}
        >
          <Text style={styles.buttonText}>Get started</Text>
        </TouchableOpacity>
        
        <Text style={styles.legalText}>
          By continuing you accept our Privacy Policy and Terms
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8F0E8', alignItems: 'center' },
  brandCard: { backgroundColor: '#FFF', width: '90%', marginTop: 40, padding: 30, borderRadius: 30, alignItems: 'center' },
  brandTitle: { fontSize: 42, fontWeight: 'bold', color: '#2D4B2D' },
  brandSubtitle: { fontSize: 18, color: '#4A6B4A', textAlign: 'center', marginTop: 10 },
  illustrationContainer: { flex: 1, justifyContent: 'center', width: '100%' },
  image: { width: '100%', height: 300 },
  footer: { width: '100%', paddingHorizontal: 30, paddingBottom: 40, alignItems: 'center' },
  button: { backgroundColor: '#2D4B2D', width: '100%', padding: 20, borderRadius: 35, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 18, fontWeight: '600' },
  legalText: { fontSize: 12, color: '#666', marginTop: 10 }
});