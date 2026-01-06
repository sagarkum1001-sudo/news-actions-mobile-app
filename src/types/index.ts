// TypeScript interfaces for News Actions Mobile App

// User types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
}

// News article types
export interface NewsArticle {
  id: string;
  business_bites_news_id?: string;
  title: string;
  summary: string;
  summary_short?: string;
  market: string;
  sector: string;
  impact_score?: number;
  sentiment?: 'positive' | 'negative' | 'neutral';
  link: string;
  urlToImage?: string;
  thumbnail_url?: string;
  published_at: string;
  source_system: string;
  author?: string;
  alternative_sources?: any[];
  rank?: number;
  slno?: number;
  source_links?: SourceLink[];
}

export interface SourceLink {
  title: string;
  source: string;
  url: string;
  published_at: string;
  rank: number;
}

// Watchlist types
export interface Watchlist {
  id: string;
  user_id: string;
  watchlist_name: string;
  watchlist_category: 'companies' | 'sectors' | 'topics';
  market: string;
  created_at: string;
  updated_at?: string;
  items: string[]; // Array of item names
}

export interface WatchlistItem {
  id: string;
  watchlist_id: string;
  item_name: string;
  market: string;
  watchlist_type: 'companies' | 'sectors' | 'topics';
  user_id: string;
  added_at: string;
}

// Watchlist lookup types (for autocomplete)
export interface WatchlistLookupItem {
  id: string;
  item_name: string;
  item_type: 'companies' | 'sectors' | 'topics';
  market: string;
  description?: string;
  market_cap_rank?: number;
  ticker_symbol?: string;
  created_at: string;
}

export interface WatchlistLookupResponse {
  success: boolean;
  results: {
    companies: WatchlistLookupItem[];
    sectors: WatchlistLookupItem[];
    topics: WatchlistLookupItem[];
  };
  suggestion?: {
    message: string;
    item_name: string;
    type: 'companies' | 'sectors' | 'topics';
  };
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface NewsApiResponse {
  articles: NewsArticle[];
  total: number;
  count?: number;
}

export interface WatchlistsApiResponse {
  success: boolean;
  watchlists: Watchlist[];
  count: number;
}

export interface WatchlistFilterApiResponse {
  success: boolean;
  watchlist: Watchlist;
  articles: NewsArticle[];
  articles_count: number;
}

// User feedback types
export interface UserFeedback {
  id: string;
  user_id: string;
  type: 'bug_report' | 'feature_request';
  title: string;
  description: string;
  status: 'pending' | 'resolved' | 'closed';
  debug_context?: any;
  created_at: string;
  updated_at?: string;
  submitted_at?: string;
}

// Search types
export interface SearchFilters {
  market?: string;
  sector?: string;
  query?: string;
}

// App state types
export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  currentMarket: string;
  searchFilters: SearchFilters;
  lastSync: string | null;
}

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  NewsDetail: { article: NewsArticle };
  WatchlistDetail: { watchlist: Watchlist };
};

export type MainTabParamList = {
  News: undefined;
  Watchlists: undefined;
  Search: undefined;
  Profile: undefined;
};
