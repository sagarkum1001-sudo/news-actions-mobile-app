// News Screen
// Main news feed with market filtering

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

// Import services and types
import { apiService } from '../services/api';
import { NewsArticle } from '../types';
import { APP_CONFIG } from '../constants/config';

export default function NewsScreen() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMarket, setSelectedMarket] = useState<string>('US');

  useEffect(() => {
    loadNews();
  }, [selectedMarket]);

  const loadNews = async () => {
    setLoading(true);
    try {
      console.log('🔄 Loading news for market:', selectedMarket);
      const response = await apiService.getNews({ market: selectedMarket });

      if (response.articles) {
        setArticles(response.articles);
        console.log('✅ Loaded', response.articles.length, 'articles');
      }
    } catch (error) {
      console.error('❌ Failed to load news:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMarketTabs = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.marketTabs}
      contentContainerStyle={styles.marketTabsContent}
    >
      {APP_CONFIG.markets.map((market) => (
        <TouchableOpacity
          key={market}
          style={[
            styles.marketTab,
            selectedMarket === market && styles.marketTabActive,
          ]}
          onPress={() => setSelectedMarket(market)}
        >
          <Text
            style={[
              styles.marketTabText,
              selectedMarket === market && styles.marketTabTextActive,
            ]}
          >
            {market}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderArticle = (article: NewsArticle) => (
    <TouchableOpacity key={article.id} style={styles.articleCard}>
      <Text style={styles.articleTitle} numberOfLines={2}>
        {article.title}
      </Text>
      <Text style={styles.articleSummary} numberOfLines={3}>
        {article.summary}
      </Text>
      <View style={styles.articleMeta}>
        <Text style={styles.articleSource}>{article.source_system}</Text>
        <Text style={styles.articleDate}>
          {new Date(article.published_at).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Market Filter Tabs */}
      {renderMarketTabs()}

      {/* News Feed */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.loadingText}>Loading {selectedMarket} news...</Text>
        </View>
      ) : (
        <ScrollView style={styles.newsFeed} showsVerticalScrollIndicator={false}>
          {articles.length > 0 ? (
            articles.map(renderArticle)
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No news articles found for {selectedMarket}</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  marketTabs: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  marketTabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  marketTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  marketTabActive: {
    backgroundColor: '#667eea',
  },
  marketTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  marketTabTextActive: {
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  newsFeed: {
    flex: 1,
    paddingHorizontal: 16,
  },
  articleCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    lineHeight: 24,
  },
  articleSummary: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  articleMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  articleSource: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  articleDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});
