import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// --- Types ---

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

const POSTS_PER_PAGE = 10;

// --- Component ---

export default function DataFetchingScreen() {
  // Section 1: Basic API call
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);

  // Section 2: Empty state
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Section 4: Pagination
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [postsLoading, setPostsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // --- Section 1: Fetch user ---

  const fetchUser = async () => {
    setUserLoading(true);
    setUserError(null);
    try {
      const id = Math.floor(Math.random() * 10) + 1;
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/users/${id}`,
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setUser(data);
    } catch (err: any) {
      setUserError(err.message);
    } finally {
      setUserLoading(false);
    }
  };

  // --- Section 2: Fetch empty / non-empty ---

  const fetchEmptyResults = async () => {
    setSearchLoading(true);
    try {
      const res = await fetch(
        'https://jsonplaceholder.typicode.com/posts?userId=999',
      );
      const data = await res.json();
      setSearchResults(data);
      setHasSearched(true);
    } finally {
      setSearchLoading(false);
    }
  };

  const fetchNonEmptyResults = async () => {
    setSearchLoading(true);
    try {
      const res = await fetch(
        'https://jsonplaceholder.typicode.com/posts?userId=1',
      );
      const data = await res.json();
      setSearchResults(data);
      setHasSearched(true);
    } finally {
      setSearchLoading(false);
    }
  };

  // --- Section 4: Paginated posts ---

  const fetchPosts = useCallback(
    async (pageNum: number, isRefresh = false) => {
      if (postsLoading && !isRefresh) return;
      setPostsLoading(true);
      try {
        const res = await fetch(
          `https://jsonplaceholder.typicode.com/posts?_page=${pageNum}&_limit=${POSTS_PER_PAGE}`,
        );
        const data: Post[] = await res.json();
        if (isRefresh) {
          setPosts(data);
        } else {
          setPosts((prev) => [...prev, ...data]);
        }
        setHasMore(data.length === POSTS_PER_PAGE);
      } finally {
        setPostsLoading(false);
        setRefreshing(false);
      }
    },
    [postsLoading],
  );

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchPosts(1, true);
  };

  const handleLoadMore = () => {
    if (!postsLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(nextPage);
    }
  };

  // --- Header (Sections 1-3) ---

  const renderHeader = () => (
    <>
      <Text style={styles.pageTitle}>Data Fetching</Text>

      {/* Section 1: API Calls */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. API Calls + Loading/Error</Text>
        <Text style={styles.note}>
          Manual fetch with useState for loading, error, and success states.
        </Text>

        <View style={styles.card}>
          {userLoading && (
            <ActivityIndicator size="large" style={{ marginVertical: 16 }} />
          )}

          {userError && !userLoading && (
            <View style={styles.errorBox}>
              <Text style={styles.errorTitle}>Something went wrong</Text>
              <Text style={styles.errorText}>{userError}</Text>
            </View>
          )}

          {user && !userLoading && !userError && (
            <>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userDetail}>{user.email}</Text>
              <Text style={styles.userDetail}>{user.phone}</Text>
            </>
          )}

          {!user && !userLoading && !userError && (
            <Text style={styles.placeholder}>
              Press the button to fetch a user
            </Text>
          )}

          <View style={styles.buttonRow}>
            <Pressable style={styles.button} onPress={fetchUser}>
              <Text style={styles.buttonText}>Fetch Random User</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonDanger]}
              onPress={() => {
                setUserError('Simulated network error!');
                setUser(null);
              }}>
              <Text style={styles.buttonText}>Simulate Error</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Section 2: Empty State */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Empty State Handling</Text>
        <Text style={styles.note}>
          What to show when an API returns no results vs actual data.
        </Text>

        <View style={styles.card}>
          {searchLoading && (
            <ActivityIndicator size="large" style={{ marginVertical: 16 }} />
          )}

          {!searchLoading && hasSearched && searchResults.length === 0 && (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>No results found</Text>
              <Text style={styles.emptySubtitle}>
                Try a different search query
              </Text>
            </View>
          )}

          {!searchLoading && searchResults.length > 0 && (
            <View>
              <Text style={styles.resultCount}>
                {searchResults.length} posts found
              </Text>
              {searchResults.slice(0, 3).map((post) => (
                <View key={post.id} style={styles.miniPost}>
                  <Text style={styles.miniPostTitle} numberOfLines={1}>
                    {post.title}
                  </Text>
                </View>
              ))}
              {searchResults.length > 3 && (
                <Text style={styles.moreText}>
                  ...and {searchResults.length - 3} more
                </Text>
              )}
            </View>
          )}

          {!searchLoading && !hasSearched && (
            <Text style={styles.placeholder}>
              Try fetching with different user IDs
            </Text>
          )}

          <View style={styles.buttonRow}>
            <Pressable style={styles.button} onPress={fetchEmptyResults}>
              <Text style={styles.buttonText}>userId=999 (empty)</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonSecondary]}
              onPress={fetchNonEmptyResults}>
              <Text style={styles.buttonText}>userId=1 (has data)</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Section 3: Dynamic UI Rendering */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Dynamic UI Rendering</Text>
        <Text style={styles.note}>
          The UI adapts its layout based on the current fetch state.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Current status:{' '}
            {userLoading
              ? 'Loading...'
              : userError
                ? 'Error'
                : user
                  ? 'Data loaded'
                  : 'Idle'}
          </Text>
          <View
            style={[
              styles.statusBar,
              {
                backgroundColor: userLoading
                  ? '#fbbf24'
                  : userError
                    ? '#ef4444'
                    : user
                      ? '#22c55e'
                      : '#9ca3af',
              },
            ]}
          />
          <Text style={styles.statusExplainer}>
            {userLoading
              ? 'Showing a spinner, content is hidden'
              : userError
                ? 'Showing error box, data is hidden'
                : user
                  ? `Rendering ${user.name}'s card dynamically`
                  : 'Showing placeholder text, waiting for action'}
          </Text>
        </View>
      </View>

      {/* Section 4 header */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Pagination & Pull to Refresh</Text>
        <Text style={styles.note}>
          Pull down to refresh. Scroll to the bottom to load more posts.
        </Text>
      </View>
    </>
  );

  // --- Post item ---

  const renderPost = ({ item }: { item: Post }) => (
    <View style={[styles.card, styles.postCard]}>
      <Text style={styles.postId}>#{item.id}</Text>
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postBody} numberOfLines={2}>
        {item.body}
      </Text>
    </View>
  );

  // --- Footer ---

  const renderFooter = () => {
    if (!hasMore && posts.length > 0)
      return <Text style={styles.endText}>— End of posts —</Text>;
    if (postsLoading && posts.length > 0)
      return <ActivityIndicator style={{ marginVertical: 16 }} />;
    return null;
  };

  return (
    <FlatList
      data={posts}
      renderItem={renderPost}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      contentContainerStyle={styles.content}
      style={styles.container}
    />
  );
}

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    paddingTop: 60,
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    color: '#1a1a1a',
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 28,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  note: {
    fontSize: 13,
    color: '#888',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#555',
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  button: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonSecondary: {
    backgroundColor: '#6b7280',
  },
  buttonDanger: {
    backgroundColor: '#ef4444',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  // Section 1
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  userDetail: {
    fontSize: 15,
    color: '#555',
    marginBottom: 2,
  },
  placeholder: {
    fontSize: 15,
    color: '#aaa',
    textAlign: 'center',
    marginVertical: 16,
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  errorTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: 2,
  },
  errorText: {
    fontSize: 14,
    color: '#b91c1c',
  },
  // Section 2
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9ca3af',
  },
  resultCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4f46e5',
    marginBottom: 8,
  },
  miniPost: {
    backgroundColor: '#f9fafb',
    borderRadius: 6,
    padding: 10,
    marginBottom: 6,
  },
  miniPostTitle: {
    fontSize: 14,
    color: '#374151',
  },
  moreText: {
    fontSize: 13,
    color: '#9ca3af',
    fontStyle: 'italic',
    marginTop: 4,
  },
  // Section 3
  statusBar: {
    height: 8,
    borderRadius: 4,
    marginVertical: 8,
  },
  statusExplainer: {
    fontSize: 14,
    color: '#555',
  },
  // Section 4
  postCard: {
    marginHorizontal: 20,
  },
  postId: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4f46e5',
    marginBottom: 4,
  },
  postTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  postBody: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  endText: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 14,
    marginVertical: 20,
  },
});
