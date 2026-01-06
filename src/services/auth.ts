// Authentication service using Google OAuth with Supabase
// Replicates web app authentication for seamless cross-platform experience

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../constants/config';
import { User } from '../types';

class AuthService {
  private supabase: SupabaseClient;
  private isInitialized = false;

  constructor() {
    this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  /**
   * Initialize Google Sign-In
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      GoogleSignin.configure({
        webClientId: 'your-web-client-id.apps.googleusercontent.com', // Replace with actual web client ID
        offlineAccess: true,
        forceCodeForRefreshToken: true,
      });

      this.isInitialized = true;
      console.log('✅ Google Sign-In initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Google Sign-In:', error);
      throw error;
    }
  }

  /**
   * Sign in with Google
   */
  async signInWithGoogle(): Promise<User> {
    try {
      await this.initialize();

      // Check if user is already signed in
      const { data: existingSession } = await this.supabase.auth.getSession();
      if (existingSession?.session?.user) {
        console.log('✅ User already signed in');
        return this.mapSupabaseUserToUser(existingSession.session.user);
      }

      // Start Google Sign-In flow
      console.log('🔄 Starting Google Sign-In...');
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      // Get the ID token from the user info
      const tokens = await GoogleSignin.getTokens();
      if (!tokens.idToken) {
        throw new Error('No ID token received from Google Sign-In');
      }

      console.log('🔄 Signing in with Supabase...');
      const { data, error } = await this.supabase.auth.signInWithIdToken({
        provider: 'google',
        token: tokens.idToken,
      });

      if (error) {
        console.error('❌ Supabase sign-in error:', error);
        throw error;
      }

      if (!data.user) {
        throw new Error('No user data received from Supabase');
      }

      console.log('✅ Successfully signed in:', data.user.email);
      return this.mapSupabaseUserToUser(data.user);

    } catch (error: any) {
      console.error('❌ Google Sign-In failed:', error);

      // Handle specific error cases
      if (error?.code === 'SIGN_IN_CANCELLED') {
        throw new Error('Sign-in was cancelled');
      } else if (error?.code === 'SIGN_IN_REQUIRED') {
        throw new Error('Sign-in is required');
      } else if (error?.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
        throw new Error('Google Play Services not available');
      }

      throw error;
    }
  }

  /**
   * Sign out user
   */
  async signOut(): Promise<void> {
    try {
      console.log('🔄 Signing out...');

      // Sign out from Supabase
      const { error: supabaseError } = await this.supabase.auth.signOut();
      if (supabaseError) {
        console.warn('⚠️ Supabase sign-out warning:', supabaseError);
      }

      // Sign out from Google
      try {
        await GoogleSignin.signOut();
        console.log('✅ Google Sign-Out successful');
      } catch (googleError) {
        console.warn('⚠️ Google sign-out warning:', googleError);
      }

      console.log('✅ Sign-out complete');

    } catch (error) {
      console.error('❌ Sign-out failed:', error);
      throw error;
    }
  }

  /**
   * Get current user session
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { session }, error } = await this.supabase.auth.getSession();

      if (error) {
        console.warn('⚠️ Session error:', error);
        return null;
      }

      if (!session?.user) {
        return null;
      }

      return this.mapSupabaseUserToUser(session.user);
    } catch (error) {
      console.error('❌ Failed to get current user:', error);
      return null;
    }
  }

  /**
   * Get current session
   */
  async getCurrentSession(): Promise<any> {
    try {
      const { data: { session }, error } = await this.supabase.auth.getSession();

      if (error) {
        console.warn('⚠️ Session error:', error);
        return null;
      }

      return session;
    } catch (error) {
      console.error('❌ Failed to get current session:', error);
      return null;
    }
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    const { data: { subscription } } = this.supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event);

        if (session?.user) {
          const user = this.mapSupabaseUserToUser(session.user);
          callback(user);
        } else {
          callback(null);
        }
      }
    );

    // Return unsubscribe function
    return () => subscription.unsubscribe();
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<string | null> {
    try {
      const { data, error } = await this.supabase.auth.refreshSession();

      if (error) {
        console.error('❌ Token refresh failed:', error);
        return null;
      }

      return data.session?.access_token || null;
    } catch (error) {
      console.error('❌ Token refresh error:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null;
  }

  /**
   * Get authentication headers for API calls
   */
  async getAuthHeaders(): Promise<{ Authorization?: string }> {
    const session = await this.getCurrentSession();
    if (!session?.access_token) {
      return {};
    }

    return {
      Authorization: `Bearer ${session.access_token}`,
    };
  }

  // ===== PRIVATE METHODS =====

  /**
   * Map Supabase user to our User interface
   */
  private mapSupabaseUserToUser(supabaseUser: any): User {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
      full_name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name,
      avatar_url: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture,
      created_at: supabaseUser.created_at,
    };
  }
}

// Export singleton instance
export const authService = new AuthService();
