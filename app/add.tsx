import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

export default function LandingPage() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Brand Card */}
      <View style={styles.brandCard}>
        <Text style={styles.brandTitle}>Leaflog</Text>
        <Text style={styles.brandSubtitle}>
          Simple coordination. Thriving plants. 🌱
        </Text>
      </View>

      {/* Illustration Area */}
      <View style={styles.illustrationContainer}>
        {/* Replace with your local image once you have one in /assets */}
        <Image 
          source={{ uri: 'https://img.freepik.com/free-vector/garden-concept-illustration_114360-3164.jpg' }} 
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* Bottom Action Area */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={styles.buttonText}>Get started</Text>
        </TouchableOpacity>

        <Text style={styles.legalText}>
          By continuing you accept our <Text style={styles.link}>Privacy Policy</Text> and <Text style={styles.link}>Terms & Conditions</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8F0E8', alignItems: 'center' },
  brandCard: { 
    backgroundColor: '#FFF', width: '90%', marginTop: 40, padding: 30, 
    borderRadius: 30, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05 
  },
  brandTitle: { fontSize: 42, fontWeight: 'bold', color: '#2D4B2D', fontFamily: 'serif' },
  brandSubtitle: { fontSize: 18, color: '#4A6B4A', textAlign: 'center', marginTop: 10, lineHeight: 26 },
  illustrationContainer: { flex: 1, justifyContent: 'center', width: '100%' },
  image: { width: '100%', height: 300 },
  footer: { width: '100%', paddingHorizontal: 30, paddingBottom: 40, alignItems: 'center' },
  button: { 
    backgroundColor: '#2D4B2D', width: '100%', padding: 20, 
    borderRadius: 35, alignItems: 'center', marginBottom: 25 
  },
  buttonText: { color: 'white', fontSize: 18, fontWeight: '600' },
  legalText: { fontSize: 12, color: '#666', textAlign: 'center', lineHeight: 18 },
  link: { textDecorationLine: 'underline', fontWeight: '500' }
});