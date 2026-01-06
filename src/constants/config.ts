// Configuration constants for News Actions Mobile App

// Supabase configuration (same as web app)
export const SUPABASE_URL = 'https://qqzyizvglvxkupssowex.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxenlpenZnbHZ4a3Vwc3Nvd2V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzMjg5NjksImV4cCI6MjA3ODkwNDk2OX0.F5Y1TCuWwmN3kxTX5HyvGFQ5fSXyba7F41M99bvA-DU';

// API Base URL - points to existing Vercel deployment
export const API_BASE_URL = 'https://news-actions-business-bites.vercel.app';

// App constants
export const APP_CONFIG = {
  name: 'News Actions Business Bites',
  version: '1.0.0',
  markets: ['US', 'China', 'EU', 'India', 'Crypto'] as const,
  watchlistTypes: ['companies', 'sectors', 'topics'] as const,
  maxWatchlists: 10,
  maxWatchlistNameLength: 50,
};

// Storage keys
export const STORAGE_KEYS = {
  user: 'user_data',
  authToken: 'auth_token',
  lastSync: 'last_sync',
  preferences: 'user_preferences',
};

// Notification settings
export const NOTIFICATION_CONFIG = {
  dailyNewsTime: '09:00', // 9 AM daily
  channelId: 'news_actions_daily',
  channelName: 'Daily News Updates',
  channelDescription: 'Get your daily business news summary',
};
