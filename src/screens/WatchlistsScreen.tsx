// Watchlists Screen
// Manage user watchlists

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function WatchlistsScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>My Watchlists</Text>
        <Text style={styles.subtitle}>Create and manage custom watchlists</Text>

        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            Watchlist management coming soon!{'\n\n'}
            Features will include:{'\n'}
            • Create companies, sectors, or topics watchlists{'\n'}
            • Add/remove items with autocomplete{'\n'}
            • Filter news by watchlists{'\n'}
            • Personalized news feeds
          </Text>
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
    alignItems: 'center',
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
    textAlign: 'center',
    marginBottom: 40,
  },
  placeholder: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
  },
  placeholderText: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
    textAlign: 'center',
  },
});
