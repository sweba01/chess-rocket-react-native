import { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useToggle } from '@/hooks/use-toggle';
import { useDebounce } from '@/hooks/use-debounce';
import { useFetch } from '@/hooks/use-fetch';
import { useAuth } from '@/hooks/use-auth';

// --- Types ---

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

// --- Component ---

export default function CustomHooksScreen() {
  // Section 1: useToggle demos
  const [switchOn, toggleSwitch] = useToggle(false);
  const [panelVisible, togglePanel] = useToggle(false);
  const [modalOpen, , setModalOpen] = useToggle(false);
  const [darkCard, toggleDarkCard] = useToggle(false);

  // Section 2: useDebounce + useFetch
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 500);
  const searchUrl = debouncedQuery
    ? `https://jsonplaceholder.typicode.com/users?name_like=${debouncedQuery}`
    : '';
  const {
    data: searchResults,
    loading: searchLoading,
    error: searchError,
  } = useFetch<User[]>(searchUrl);

  // Section 3: useAuth
  const { user: authUser, isLoggedIn, login, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Section 4: useFetch standalone
  const [postId, setPostId] = useState(1);
  const {
    data: post,
    loading: postLoading,
    error: postError,
    refetch: refetchPost,
  } = useFetch<Post>(
    `https://jsonplaceholder.typicode.com/posts/${postId}`,
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>Custom Hooks</Text>

      {/* ---- Section 1: useToggle ---- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. useToggle</Text>
        <Text style={styles.note}>
          A simple hook to toggle booleans — powers switches, modals, show/hide
          panels, and dark mode toggles.
        </Text>

        {/* Toggle Switch */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Toggle Switch</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>
              {switchOn ? 'ON' : 'OFF'}
            </Text>
            <Switch value={switchOn} onValueChange={toggleSwitch} />
          </View>
        </View>

        {/* Show/Hide Panel */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Show/Hide Panel</Text>
          <View style={styles.buttonRow}>
            <Pressable style={styles.button} onPress={togglePanel}>
              <Text style={styles.buttonText}>
                {panelVisible ? 'Hide Panel' : 'Show Panel'}
              </Text>
            </Pressable>
          </View>
          {panelVisible && (
            <View style={styles.panel}>
              <Text style={styles.panelText}>
                This content is toggled with useToggle! You can show or hide any
                UI section this way.
              </Text>
            </View>
          )}
        </View>

        {/* Modal Open/Close */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Modal</Text>
          <View style={styles.buttonRow}>
            <Pressable
              style={styles.button}
              onPress={() => setModalOpen(true)}>
              <Text style={styles.buttonText}>Open Modal</Text>
            </Pressable>
          </View>
          <Modal
            visible={modalOpen}
            transparent
            animationType="fade"
            onRequestClose={() => setModalOpen(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>useToggle Modal</Text>
                <Text style={styles.modalBody}>
                  This modal is controlled by the useToggle hook. Press the
                  button below to close it.
                </Text>
                <Pressable
                  style={[styles.button, styles.buttonDanger]}
                  onPress={() => setModalOpen(false)}>
                  <Text style={styles.buttonText}>Close Modal</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>

        {/* Dark Mode Card Toggle */}
        <View style={[styles.card, darkCard && styles.cardDark]}>
          <Text style={[styles.cardTitle, darkCard && styles.textLight]}>
            Dark Mode Card
          </Text>
          <Text style={[styles.cardSubtitle, darkCard && styles.textMuted]}>
            Toggle between light and dark styles for this card.
          </Text>
          <View style={styles.buttonRow}>
            <Pressable
              style={[styles.button, darkCard && styles.buttonLight]}
              onPress={toggleDarkCard}>
              <Text
                style={[
                  styles.buttonText,
                  darkCard && styles.buttonTextDark,
                ]}>
                {darkCard ? 'Light Mode' : 'Dark Mode'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* ---- Section 2: useDebounce + useFetch ---- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. useDebounce + useFetch</Text>
        <Text style={styles.note}>
          Type a name to search users from JSONPlaceholder. Input is debounced
          (500ms), then fed into useFetch.
        </Text>

        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Search users by name..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {searchLoading && (
            <ActivityIndicator size="small" style={{ marginVertical: 12 }} />
          )}

          {searchError && (
            <Text style={styles.errorText}>Error: {searchError}</Text>
          )}

          {!searchLoading && searchResults && searchResults.length > 0 && (
            <View style={styles.resultsList}>
              {searchResults.map((u) => (
                <View key={u.id} style={styles.resultItem}>
                  <Text style={styles.resultName}>{u.name}</Text>
                  <Text style={styles.resultDetail}>{u.email}</Text>
                </View>
              ))}
            </View>
          )}

          {!searchLoading &&
            debouncedQuery !== '' &&
            searchResults &&
            searchResults.length === 0 && (
              <Text style={styles.placeholder}>No users found.</Text>
            )}

          {!debouncedQuery && !searchLoading && (
            <Text style={styles.placeholder}>
              Start typing to search users...
            </Text>
          )}
        </View>
      </View>

      {/* ---- Section 3: useAuth ---- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. useAuth</Text>
        <Text style={styles.note}>
          Simulated authentication — login with any email/password to see a mock
          user profile.
        </Text>

        <View style={styles.card}>
          {!isLoggedIn ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <View style={styles.buttonRow}>
                <Pressable
                  style={[
                    styles.button,
                    (!email || !password) && styles.buttonDisabled,
                  ]}
                  onPress={() => login(email, password)}
                  disabled={!email || !password}>
                  <Text style={styles.buttonText}>Login</Text>
                </Pressable>
              </View>
            </>
          ) : (
            <>
              <View style={styles.profileCard}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {authUser?.name?.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>{authUser?.name}</Text>
                  <Text style={styles.profileEmail}>{authUser?.email}</Text>
                </View>
              </View>
              <View style={styles.buttonRow}>
                <Pressable
                  style={[styles.button, styles.buttonDanger]}
                  onPress={logout}>
                  <Text style={styles.buttonText}>Logout</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </View>

      {/* ---- Section 4: useFetch standalone ---- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. useFetch</Text>
        <Text style={styles.note}>
          Standalone fetch demo — fetches a post by ID, shows
          loading/error/data states with a refetch button.
        </Text>

        <View style={styles.card}>
          {postLoading && (
            <ActivityIndicator size="large" style={{ marginVertical: 16 }} />
          )}

          {postError && !postLoading && (
            <Text style={styles.errorText}>Error: {postError}</Text>
          )}

          {post && !postLoading && (
            <>
              <Text style={styles.postId}>#{post.id}</Text>
              <Text style={styles.postTitle}>{post.title}</Text>
              <Text style={styles.postBody}>{post.body}</Text>
            </>
          )}

          <View style={styles.buttonRow}>
            <Pressable style={styles.button} onPress={refetchPost}>
              <Text style={styles.buttonText}>Refetch</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonSecondary]}
              onPress={() =>
                setPostId(Math.floor(Math.random() * 100) + 1)
              }>
              <Text style={styles.buttonText}>Random Post</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    color: '#1a1a1a',
  },
  section: {
    marginBottom: 28,
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
  cardDark: {
    backgroundColor: '#1e1e2e',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#555',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  textLight: {
    color: '#e0e0e0',
  },
  textMuted: {
    color: '#9ca3af',
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
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
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonLight: {
    backgroundColor: '#e0e0e0',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  buttonTextDark: {
    color: '#1e1e2e',
  },
  // Toggle switch
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  // Show/Hide panel
  panel: {
    backgroundColor: '#f0f4ff',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  panelText: {
    fontSize: 14,
    color: '#4f46e5',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  modalBody: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  // Input
  input: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
    fontSize: 15,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  // Search results
  resultsList: {
    marginTop: 8,
  },
  resultItem: {
    backgroundColor: '#f9fafb',
    borderRadius: 6,
    padding: 10,
    marginBottom: 6,
  },
  resultName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  resultDetail: {
    fontSize: 13,
    color: '#6b7280',
  },
  placeholder: {
    fontSize: 15,
    color: '#aaa',
    textAlign: 'center',
    marginVertical: 16,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginBottom: 8,
  },
  // Auth profile
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
    color: '#6b7280',
  },
  // Post
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
});
