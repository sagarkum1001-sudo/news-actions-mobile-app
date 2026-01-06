// API service layer for News Actions Mobile App
// Consumes existing Vercel serverless functions

import { API_BASE_URL, SUPABASE_URL, SUPABASE_ANON_KEY } from '../constants/config';
import {
  NewsArticle,
  Watchlist,
  WatchlistLookupResponse,
  NewsApiResponse,
  WatchlistsApiResponse,
  WatchlistFilterApiResponse,
  UserFeedback,
  User,
} from '../types';

class ApiService {
  private baseUrl: string;
  private supabaseUrl: string;
  private supabaseAnonKey: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.supabaseUrl = SUPABASE_URL;
    this.supabaseAnonKey = SUPABASE_ANON_KEY;
  }

  // Generic fetch wrapper with error handling
  private async apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // ===== NEWS API METHODS =====

  /**
   * Fetch news articles with optional filters
   */
  async getNews(params: {
    market?: string;
    sector?: string;
    search?: string;
  } = {}): Promise<NewsApiResponse> {
    const queryParams = new URLSearchParams();

    if (params.market) queryParams.append('market', params.market);
    if (params.sector) queryParams.append('sector', params.sector);
    if (params.search) queryParams.append('search', params.search);

    const queryString = queryParams.toString();
    const endpoint = `/api/news${queryString ? `?${queryString}` : ''}`;

    return this.apiRequest<NewsApiResponse>(endpoint);
  }

  /**
   * Get individual article details
   */
  async getArticle(articleId: string): Promise<{ article: NewsArticle }> {
    return this.apiRequest<{ article: NewsArticle }>(`/api/news/article/${articleId}`);
  }

  // ===== WATCHLIST API METHODS =====

  /**
   * Get all user watchlists
   */
  async getWatchlists(authToken: string): Promise<WatchlistsApiResponse> {
    return this.apiRequest<WatchlistsApiResponse>('/api/watchlists', {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });
  }

  /**
   * Create a new watchlist
   */
  async createWatchlist(
    authToken: string,
    data: {
      name: string;
      type: 'companies' | 'sectors' | 'topics';
      market: string;
      items?: string[];
    }
  ): Promise<any> {
    return this.apiRequest('/api/watchlists', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        name: data.name,
        type: data.type,
        market: data.market,
        items: data.items || [],
      }),
    });
  }

  /**
   * Delete a watchlist
   */
  async deleteWatchlist(authToken: string, watchlistId: string): Promise<any> {
    return this.apiRequest(`/api/watchlists/${watchlistId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });
  }

  /**
   * Add item to watchlist
   */
  async addWatchlistItem(
    authToken: string,
    watchlistId: string,
    itemName: string
  ): Promise<any> {
    return this.apiRequest(`/api/watchlists/${watchlistId}/items`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        item_name: itemName,
      }),
    });
  }

  /**
   * Remove item from watchlist
   */
  async removeWatchlistItem(
    authToken: string,
    watchlistId: string,
    itemName: string
  ): Promise<any> {
    return this.apiRequest(`/api/watchlists/${watchlistId}/items`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        item_name: itemName,
      }),
    });
  }

  /**
   * Filter news by watchlist
   */
  async filterNewsByWatchlist(
    authToken: string,
    watchlistId: string,
    market: string = 'US',
    page: number = 1
  ): Promise<WatchlistFilterApiResponse> {
    const queryParams = new URLSearchParams({
      id: watchlistId,
      market,
      page: page.toString(),
    });

    return this.apiRequest<WatchlistFilterApiResponse>(
      `/api/watchlists/filter-news?${queryParams}`,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      }
    );
  }

  /**
   * Search for watchlist items (autocomplete)
   */
  async searchWatchlistItems(params: {
    query: string;
    market?: string;
    type?: 'companies' | 'sectors' | 'topics';
    limit?: number;
  }): Promise<WatchlistLookupResponse> {
    const queryParams = new URLSearchParams({
      query: params.query,
      market: params.market || 'US',
      type: params.type || 'companies',
      limit: (params.limit || 8).toString(),
    });

    return this.apiRequest<WatchlistLookupResponse>(
      `/api/watchlists/lookup?${queryParams}`
    );
  }

  // ===== USER FEEDBACK API METHODS =====

  /**
   * Submit user feedback (bug report or feature request)
   */
  async submitFeedback(
    authToken: string,
    data: {
      type: 'bug_report' | 'feature_request';
      title: string;
      description: string;
    }
  ): Promise<any> {
    return this.apiRequest('/api/user-assist', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(data),
    });
  }

  /**
   * Get user's feedback submissions
   */
  async getUserFeedback(authToken: string): Promise<{ feedback: UserFeedback[] }> {
    return this.apiRequest<{ feedback: UserFeedback[] }>('/api/user-assist', {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });
  }

  // ===== READ LATER API METHODS =====

  /**
   * Get user's read later articles
   */
  async getReadLaterArticles(authToken: string): Promise<{ bookmarks: any[] }> {
    return this.apiRequest<{ bookmarks: any[] }>('/api/user/read-later', {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });
  }

  /**
   * Add article to read later
   */
  async addToReadLater(
    authToken: string,
    data: {
      article_id: string;
      title: string;
      url: string;
      sector: string;
      source_system: string;
    }
  ): Promise<any> {
    return this.apiRequest('/api/user/read-later', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(data),
    });
  }

  /**
   * Remove article from read later
   */
  async removeFromReadLater(authToken: string, articleId: string): Promise<any> {
    return this.apiRequest('/api/user/read-later', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        article_id: articleId,
      }),
    });
  }

  // ===== SEARCH API METHODS =====

  /**
   * Search articles with semantic search
   */
  async searchArticles(
    authToken: string,
    params: {
      query: string;
      market?: string;
      user_id: string;
    }
  ): Promise<{ articles: NewsArticle[] }> {
    const queryParams = new URLSearchParams({
      query: params.query,
      market: params.market || 'US',
      user_id: params.user_id,
    });

    return this.apiRequest<{ articles: NewsArticle[] }>(
      `/api/search-similar?${queryParams}`,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      }
    );
  }
}

// Export singleton instance
export const apiService = new ApiService();
