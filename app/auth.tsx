import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
// Firebase Imports
import { auth, db } from '../firebaseConfig'; 
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();

  const handleAuth = async () => {
    if (!email || !password || (!isLogin && !name)) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      if (isLogin) {
        // Logging in using the function you were inspecting
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Registering a new gardener
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Save additional info (Name) to Firestore users collection
        await setDoc(doc(db, "users", userCredential.user.uid), {
          name: name,
          email: email,
          createdAt: new Date().toISOString()
        });
      }
      // Success! Move to the Dashboard
      router.replace('/(tabs)');
    } catch (error: any) {
      // Handle the "auth/invalid-credential" error mentioned in your remarks
      Alert.alert("Authentication Failed", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.headerSection}>
            <Text style={styles.title}>{isLogin ? 'Welcome back' : 'Create Account'}</Text>
            <Text style={styles.subtitle}>
              {isLogin ? 'Log in to manage your garden.' : 'Start your plant journey with Leaflog.'}
            </Text>
          </View>

          <View style={styles.formCard}>
            {!isLogin && (
              <TextInput 
                style={styles.input} 
                placeholder="Full Name" 
                value={name} 
                onChangeText={setName}
                placeholderTextColor="#A0B0A0"
              />
            )}
            <TextInput 
              style={styles.input} 
              placeholder="Email" 
              value={email} 
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#A0B0A0"
            />
            <TextInput 
              style={styles.input} 
              placeholder="Password" 
              value={password} 
              onChangeText={setPassword}
              secureTextEntry 
              placeholderTextColor="#A0B0A0"
            />
            
            <TouchableOpacity style={styles.primaryButton} onPress={handleAuth}>
              <Text style={styles.buttonText}>{isLogin ? 'Log in' : 'Sign up'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.toggleButton}>
            <Text style={styles.toggleText}>
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8F0E8' },
  scrollContent: { alignItems: 'center', paddingVertical: 60 },
  headerSection: { marginBottom: 40, alignItems: 'center', paddingHorizontal: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#2D4B2D', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#4A6B4A', marginTop: 10, textAlign: 'center' },
  formCard: { 
    backgroundColor: '#FFF', 
    width: '90%', 
    padding: 25, 
    borderRadius: 30, 
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  input: { backgroundColor: '#F0F4F0', padding: 18, borderRadius: 15, marginBottom: 15, fontSize: 16, color: '#2D4B2D' },
  primaryButton: { backgroundColor: '#2D4B2D', padding: 20, borderRadius: 35, alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: '600' },
  toggleButton: { marginTop: 25 },
  toggleText: { color: '#4A6B4A', fontSize: 15, fontWeight: '500' }
});