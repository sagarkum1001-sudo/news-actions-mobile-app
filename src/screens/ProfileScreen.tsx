// Profile Screen
// User profile and settings

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

// Import services
import { authService } from '../services/auth';

export default function ProfileScreen() {
  const handleSignOut = async () => {
    try {
      await authService.signOut();
      // Navigation will automatically switch to auth screen
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Manage your account and preferences</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>
              Profile management coming soon!{'\n\n'}
              Features will include:{'\n'}
              • User profile information{'\n'}
              • Notification preferences{'\n'}
              • Reading history{'\n'}
              • Account settings
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>

          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>
              Support features coming soon!{'\n\n'}
              • Bug reports{'\n'}
              • Feature requests{'\n'}
              • Help & FAQ{'\n'}
              • Contact support
            </Text>
          </View>
        </View>

        {/* Sign Out Button */}
        <View style={styles.signOutSection}>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  placeholder: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  placeholderText: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
  },
  signOutSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  signOutButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
