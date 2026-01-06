// Authentication service using Supabase Auth
// Simplified auth for Expo managed workflow compatibility

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../constants/config';
import { User } from '../types';

class AuthService {
  private supabase: SupabaseClient;
  private isInitialized = false;

  constructor() {
    this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  /**
   * Initialize authentication service
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // For Expo managed workflow, we'll use a simplified approach
      // In production, you would integrate with Expo's AuthSession or similar
      this.isInitialized = true;
      console.log('✅ Auth service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize auth service:', error);
      throw error;
    }
  }

  /**
   * Sign in with Google (simplified for Expo managed workflow)
   * Note: In production, integrate with Expo's AuthSession or WebBrowser
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

      // For Expo managed workflow, we'll use a simplified approach
      // In production, you would implement proper OAuth flow with Expo's modules
      console.log('🔄 Starting simplified sign-in...');

      // For now, throw an error indicating Google Sign-In is not implemented
      // Replace this with proper Expo AuthSession implementation
      throw new Error('Google Sign-In not yet implemented for Expo managed workflow. Please implement using Expo AuthSession.');

    } catch (error: any) {
      console.error('❌ Sign-In failed:', error);
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
