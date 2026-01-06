// Main App Navigator
// Handles authentication flow and main app navigation

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

// Import screens (will create these next)
import AuthScreen from '../screens/AuthScreen';
import NewsScreen from '../screens/NewsScreen';
import WatchlistsScreen from '../screens/WatchlistsScreen';
import SearchScreen from '../screens/SearchScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Import services
import { authService } from '../services/auth';
import { User, RootStackParamList, MainTabParamList } from '../types';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Main tab navigator (shown after authentication)
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#667eea',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#e5e7eb',
          borderTopWidth: 1,
        },
        headerStyle: {
          backgroundColor: '#667eea',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="News"
        component={NewsScreen}
        options={{
          title: 'News',
          tabBarIcon: ({ color, size }) => (
            <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
              <View style={[styles.iconPlaceholder, { backgroundColor: color }]} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Watchlists"
        component={WatchlistsScreen}
        options={{
          title: 'Watchlists',
          tabBarIcon: ({ color, size }) => (
            <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
              <View style={[styles.iconPlaceholder, { backgroundColor: color }]} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => (
            <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
              <View style={[styles.iconPlaceholder, { backgroundColor: color }]} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
              <View style={[styles.iconPlaceholder, { backgroundColor: color }]} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Main app navigator
export default function AppNavigator() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize authentication
    const initializeAuth = async () => {
      try {
        await authService.initialize();

        // Check if user is already signed in
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const unsubscribe = authService.onAuthStateChange((newUser) => {
      setUser(newUser);
    });

    return unsubscribe;
  }, []);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // User is authenticated - show main app
          <Stack.Screen name="Main" component={MainTabNavigator} />
        ) : (
          // User not authenticated - show auth screen
          <Stack.Screen name="Auth" component={AuthScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  iconPlaceholder: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});
