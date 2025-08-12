import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
type CareerOrCourse = {
  id: string;
  title: string;
  type: 'course' | 'career';
  description?: string;
  category?: string;
};

// Mock data for search
const mockCourses: CareerOrCourse[] = [
  {
    id: '1',
    title: 'Introduction to Python',
    type: 'course',
    description: 'Learn Python programming basics',
    category: 'Programming'
  },
  {
    id: '2',
    title: 'Web Development Bootcamp',
    type: 'course',
    description: 'Full stack web development course',
    category: 'Web Development'
  },
  {
    id: '3',
    title: 'Data Science Career Path',
    type: 'career',
    description: 'Become a data scientist',
    category: 'Data Science'
  }];

// Local storage for recent searches
const RECENT_SEARCHES_KEY = 'recentSearches';

const getRecentSearches = async (): Promise<string[]> => {
  try {
    // In a real app, you would use AsyncStorage or similar
    const recent = localStorage.getItem(RECENT_SEARCHES_KEY);
    return recent ? JSON.parse(recent) : [];
  } catch (error) {
    console.error('Error getting recent searches:', error);
    return [];
  }
};

const saveRecentSearch = async (query: string): Promise<void> => {
  try {
    const recent = await getRecentSearches();
    const updated = [query, ...recent.filter(item => item !== query)].slice(0, 5);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving recent search:', error);
  }
};

const searchAll = async (query: string): Promise<CareerOrCourse[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!query.trim()) return [];
  
  const lowerQuery = query.toLowerCase();
  return mockCourses.filter(
    item => item.title.toLowerCase().includes(lowerQuery) ||
            item.description?.toLowerCase().includes(lowerQuery) ||
            item.category?.toLowerCase().includes(lowerQuery)
  );
};

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CareerOrCourse[]>([]);
  const [recentSearches, setRecentSearchesState] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadRecent = async () => {
      const recent = await getRecentSearches();
      setRecentSearchesState(recent);
    };
    const handleClearRecent = () => {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
      setRecentSearchesState([]);
    };
    loadRecent();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const handler = setTimeout(async () => {
      try {
        const results = await searchAll(searchQuery);
        setSearchResults(results);
        await saveRecentSearch(searchQuery);
        const recent = await getRecentSearches();
        setRecentSearchesState(recent);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleSearchChange = async (query: string) => {
    setSearchQuery(query);
  };

  const handleRecentPress = (query: string) => {
    setSearchQuery(query);
  };

  const handleRemoveRecent = async (query: string) => {
    const updated = recentSearches.filter(item => item !== query);
    setRecentSearchesState(updated);
    await setRecentSearches(updated);
  };

  const renderResultItem = ({ item }: { item: CareerOrCourse }) => {
    const routeBase = item.type === 'career' ? '/career/' : '/course/';
    const routeId = item.id.replace(`${item.type}-`, '');

    return (
      <TouchableOpacity
        style={styles.resultItem}
        activeOpacity={0.8}
        onPress={() => router.push(`${routeBase}${routeId}`)}
      >
        <View style={styles.resultContent}>
          <View style={[styles.iconContainer, { backgroundColor: '#e3f2fd' }]}>
            <MaterialCommunityIcons
              name={item.icon || 'briefcase'}
              size={26}
              color="#1976d2"
            />
          </View>
          <View style={styles.resultTextContainer}>
            <Text style={styles.resultTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.resultCategory} numberOfLines={1}>{item.category}</Text>
            {item.likes?.length > 0 && (
              <View style={styles.likesContainer}>
                {item.likes.slice(0, 2).map((like, index) => (
                  <View key={index} style={styles.likeTag}>
                    <Text style={styles.likeText}>{like}</Text>
                  </View>
                ))}
                {item.likes.length > 2 && (
                  <Text style={styles.moreLikes}>+{item.likes.length - 2} more</Text>
                )}
              </View>
            )}
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#888" />
      </TouchableOpacity>
    );
  };

  const renderRecentItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.recentSearchItem}
      activeOpacity={0.7}
      onPress={() => handleRecentPress(item)}
    >
      <Ionicons name="time-outline" size={20} color="#888" />
      <Text style={styles.recentSearchText} numberOfLines={1}>{item}</Text>
      <TouchableOpacity
        style={styles.clearRecentSearch}
        onPress={(e) => {
          e.stopPropagation();
          handleRemoveRecent(item);
        }}
      >
        <Ionicons name="close" size={20} color="#bbb" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={22} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search careers and courses..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearchChange}
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
            returnKeyType="search"
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={22} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isSearching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1976d2" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      ) : searchQuery === '' ? (
        <View style={styles.recentSearchesContainer}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>
          {recentSearches.length > 0 ? (
            <FlatList
              data={recentSearches}
              renderItem={renderRecentItem}
              keyExtractor={(item, index) => `recent-${index}`}
              style={styles.recentSearchesList}
              keyboardShouldPersistTaps="handled"
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={60} color="#ddd" />
              <Text style={styles.emptyStateText}>Your recent searches will appear here</Text>
            </View>
          )}
        </View>
      ) : searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={renderResultItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.resultsListContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="alert-circle-outline" size={60} color="#ddd" />
          <Text style={styles.emptyStateText}>No results found</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fafafa', // softer background
  },
  header: {
    backgroundColor: '#fff',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    zIndex: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: Platform.OS === 'ios' ? 12 : 16,
    marginBottom: 12,
    paddingHorizontal: 18,
    height: 52,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  searchIcon: { marginRight: 14 },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 18,
    fontWeight: '500',
    color: '#222',
  },
  clearButton: {
    padding: 8,
    marginLeft: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  loadingText: {
    marginTop: 14,
    fontSize: 17,
    fontWeight: '600',
    color: '#444',
  },
  recentSearchesContainer: { 
    flex: 1, 
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 14,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  recentSearchText: {
    flex: 1,
    marginLeft: 14,
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
  },
  clearRecentSearch: {
    padding: 6,
    marginLeft: 12,
  },
  resultsListContent: { 
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 6,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e0e7ff',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  resultContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
    backgroundColor: '#dbeafe',
  },
  resultTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 6,
  },
  resultCategory: {
    fontSize: 15,
    color: '#64748b',
    marginBottom: 8,
  },
  likesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  likeTag: {
    backgroundColor: '#dbeafe',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  likeText: {
    fontSize: 13,
    color: '#2563eb',
    fontWeight: '600',
  },
  moreLikes: {
    fontSize: 13,
    color: '#64748b',
    marginLeft: 6,
    alignSelf: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 36,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#9ca3af',
    marginTop: 20,
    textAlign: 'center',
    fontWeight: '500',
  },
});
