import { useReducer, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useCounterStore } from '@/store/use-counter-store';

// --- useReducer setup ---

type CounterAction = { type: 'increment' } | { type: 'decrement' } | { type: 'reset' };

function counterReducer(state: number, action: CounterAction): number {
  switch (action.type) {
    case 'increment':
      return state + 1;
    case 'decrement':
      return state - 1;
    case 'reset':
      return 0;
  }
}

// --- React Query fetcher ---

async function fetchRandomUser() {
  const id = Math.floor(Math.random() * 10) + 1;
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}

// --- Component ---

export default function StateManagementScreen() {
  // Section 1: local state
  const [localCount, setLocalCount] = useState(0);
  const [reducerCount, dispatchReducer] = useReducer(counterReducer, 0);

  // Section 2: Zustand global state
  const { count: globalCount, increment, decrement, reset } = useCounterStore();

  // Section 3: React Query server state
  const queryClient = useQueryClient();
  const { data: user, isLoading, isError, error } = useQuery({
    queryKey: ['randomUser'],
    queryFn: fetchRandomUser,
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>State Management</Text>

      {/* ---- Section 1: useState & useReducer ---- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. useState & useReducer</Text>
        <Text style={styles.note}>Local state — resets when you leave this tab.</Text>

        {/* useState */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>useState</Text>
          <Text style={styles.countText}>{localCount}</Text>
          <View style={styles.buttonRow}>
            <Pressable style={styles.button} onPress={() => setLocalCount((c) => c + 1)}>
              <Text style={styles.buttonText}>+ Increment</Text>
            </Pressable>
          </View>
        </View>

        {/* useReducer */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>useReducer</Text>
          <Text style={styles.countText}>{reducerCount}</Text>
          <View style={styles.buttonRow}>
            <Pressable
              style={styles.button}
              onPress={() => dispatchReducer({ type: 'increment' })}>
              <Text style={styles.buttonText}>+ Increment</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonSecondary]}
              onPress={() => dispatchReducer({ type: 'decrement' })}>
              <Text style={styles.buttonText}>- Decrement</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonDanger]}
              onPress={() => dispatchReducer({ type: 'reset' })}>
              <Text style={styles.buttonText}>Reset</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* ---- Section 2: Zustand ---- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Zustand (Global State)</Text>
        <Text style={styles.note}>
          Switch to another tab and come back — this value persists because it's global!
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Global Counter</Text>
          <Text style={styles.countText}>{globalCount}</Text>
          <View style={styles.buttonRow}>
            <Pressable style={styles.button} onPress={increment}>
              <Text style={styles.buttonText}>+ Increment</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.buttonSecondary]} onPress={decrement}>
              <Text style={styles.buttonText}>- Decrement</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.buttonDanger]} onPress={reset}>
              <Text style={styles.buttonText}>Reset</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* ---- Section 3: React Query ---- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. React Query (Server State)</Text>
        <Text style={styles.note}>
          Fetches a random user from jsonplaceholder. Cached & deduped automatically.
        </Text>

        <View style={styles.card}>
          {isLoading && <ActivityIndicator size="large" style={{ marginVertical: 16 }} />}

          {isError && (
            <Text style={styles.errorText}>Error: {(error as Error).message}</Text>
          )}

          {user && (
            <>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userDetail}>{user.email}</Text>
              <Text style={styles.userDetail}>{user.address?.city}</Text>
            </>
          )}

          <View style={styles.buttonRow}>
            <Pressable
              style={styles.button}
              onPress={() =>
                queryClient.invalidateQueries({ queryKey: ['randomUser'] })
              }>
              <Text style={styles.buttonText}>Fetch New User</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

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
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#555',
  },
  countText: {
    fontSize: 40,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 8,
    color: '#1a1a1a',
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
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
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
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginBottom: 8,
  },
});
