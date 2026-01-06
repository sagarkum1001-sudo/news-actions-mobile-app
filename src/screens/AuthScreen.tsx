// Authentication Screen
// Handles Google Sign-In for the mobile app

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';

// Import services
import { authService } from '../services/auth';

export default function AuthScreen() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      console.log('🔄 Starting Google Sign-In...');
      const user = await authService.signInWithGoogle();

      if (user) {
        console.log('✅ Sign-in successful:', user.email);
        // Navigation will automatically switch to main app
      }
    } catch (error: any) {
      console.error('❌ Sign-in failed:', error);
      Alert.alert(
        'Sign-In Failed',
        error.message || 'Failed to sign in with Google. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo/Brand Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>NB</Text>
          </View>
          <Text style={styles.appTitle}>News Actions</Text>
          <Text style={styles.appSubtitle}>Business Bites</Text>
        </View>

        {/* Welcome Text */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome</Text>
          <Text style={styles.welcomeText}>
            Sign in to access personalized business news, watchlists, and market insights.
          </Text>
        </View>

        {/* Sign In Button */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={[styles.signInButton, isLoading && styles.signInButtonDisabled]}
            onPress={handleGoogleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Text style={styles.googleIcon}>G</Text>
                <Text style={styles.signInButtonText}>Sign in with Google</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#667eea',
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  appSubtitle: {
    fontSize: 18,
    color: '#e8f0ff',
    textAlign: 'center',
    marginTop: 4,
  },
  welcomeSection: {
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 16,
    color: '#e8f0ff',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonSection: {
    marginBottom: 40,
  },
  signInButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  signInButtonDisabled: {
    opacity: 0.7,
  },
  googleIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4285F4',
    marginRight: 12,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#e8f0ff',
    textAlign: 'center',
    lineHeight: 18,
  },
});
