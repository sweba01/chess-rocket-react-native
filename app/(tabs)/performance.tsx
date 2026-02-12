import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

// ============================================================
// Section 1 & 2: Re-render demo children
// ============================================================

function RegularChild({ label }: { label: string }) {
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <View style={styles.childBox}>
      <Text style={styles.childLabel}>{label}</Text>
      <Text style={styles.renderCount}>Renders: {renderCount.current}</Text>
    </View>
  );
}

const MemoizedChild = memo(function MemoizedChild({ label }: { label: string }) {
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <View style={[styles.childBox, styles.childBoxMemo]}>
      <Text style={styles.childLabel}>{label}</Text>
      <Text style={[styles.renderCount, styles.renderCountMemo]}>
        Renders: {renderCount.current}
      </Text>
    </View>
  );
});

// ============================================================
// Section 4: useCallback demo children
// ============================================================

const CallbackChild = memo(function CallbackChild({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <Pressable style={styles.callbackChild} onPress={onPress}>
      <Text style={styles.childLabel}>{label}</Text>
      <Text style={styles.renderCount}>Renders: {renderCount.current}</Text>
    </Pressable>
  );
});

// ============================================================
// Section 5: Key prop demo item
// ============================================================

function KeyDemoItem({ item }: { item: { id: number; name: string } }) {
  const [text, setText] = useState('');

  return (
    <View style={styles.keyItem}>
      <Text style={styles.keyItemLabel}>{item.name}</Text>
      <TextInput
        style={styles.keyInput}
        placeholder="Type here..."
        placeholderTextColor="#aaa"
        value={text}
        onChangeText={setText}
      />
    </View>
  );
}

// ============================================================
// Main screen
// ============================================================

const INITIAL_ITEMS = [
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' },
  { id: 3, name: 'Cherry' },
  { id: 4, name: 'Date' },
];

const BIG_LIST = Array.from({ length: 500 }, (_, i) => ({
  id: i,
  title: `Item #${i + 1}`,
}));

export default function PerformanceScreen() {
  // Section 1 & 2: re-render triggers
  const [parentCount, setParentCount] = useState(0);

  // Section 3: useMemo
  const [memoInput, setMemoInput] = useState(1000);
  const [memoTrigger, setMemoTrigger] = useState(0);

  const expensiveResult = useMemo(() => {
    let sum = 0;
    for (let i = 0; i < memoInput; i++) {
      sum += Math.sqrt(i);
    }
    return sum.toFixed(2);
  }, [memoInput]);

  const renderCountMemo = useRef(0);
  renderCountMemo.current += 1;

  // Section 4: useCallback
  const [callbackCount, setCallbackCount] = useState(0);

  const unstableCallback = () => {
    setCallbackCount((c) => c + 1);
  };

  const stableCallback = useCallback(() => {
    setCallbackCount((c) => c + 1);
  }, []);

  // Section 5: key prop
  const [indexItems, setIndexItems] = useState(INITIAL_ITEMS);
  const [idItems, setIdItems] = useState(INITIAL_ITEMS);

  const shuffleItems = () => {
    const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);
    setIndexItems(shuffle);
    setIdItems(shuffle);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>Performance</Text>

      {/* ---- Section 1: Why re-renders happen ---- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Why Re-renders Happen</Text>
        <Text style={styles.note}>
          When parent state changes, ALL children re-render by default.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Parent count: {parentCount}</Text>
          <Pressable
            style={styles.button}
            onPress={() => setParentCount((c) => c + 1)}>
            <Text style={styles.buttonText}>Update Parent State</Text>
          </Pressable>

          <Text style={styles.childHeader}>Children (watch render counts):</Text>
          <RegularChild label="Child A" />
          <RegularChild label="Child B" />
          <Text style={styles.explainer}>
            Both children re-render every time even though their props
            haven't changed. This is React's default behavior.
          </Text>
        </View>
      </View>

      {/* ---- Section 2: React.memo ---- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. React.memo</Text>
        <Text style={styles.note}>
          Wrapping a component in memo() skips re-renders if props are the same.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Parent count: {parentCount}</Text>
          <Pressable
            style={styles.button}
            onPress={() => setParentCount((c) => c + 1)}>
            <Text style={styles.buttonText}>Update Parent State</Text>
          </Pressable>

          <Text style={styles.childHeader}>Without memo vs With memo:</Text>
          <RegularChild label="Regular Child" />
          <MemoizedChild label="Memoized Child" />
          <Text style={styles.explainer}>
            The memoized child stays at 1 render because its prop "label" never
            changes. The regular child keeps incrementing.
          </Text>
        </View>
      </View>

      {/* ---- Section 3: useMemo ---- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. useMemo</Text>
        <Text style={styles.note}>
          Caches expensive computation results. Only recalculates when
          dependencies change.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Sum of sqrt(0) to sqrt({memoInput - 1})
          </Text>
          <Text style={styles.memoResult}>{expensiveResult}</Text>

          <View style={styles.buttonRow}>
            <Pressable
              style={styles.button}
              onPress={() => setMemoInput((n) => n + 5000)}>
              <Text style={styles.buttonText}>Increase N (+5000)</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonSecondary]}
              onPress={() => setMemoTrigger((c) => c + 1)}>
              <Text style={styles.buttonText}>
                Unrelated state ({memoTrigger})
              </Text>
            </Pressable>
          </View>

          <Text style={styles.explainer}>
            Component re-rendered {renderCountMemo.current} time(s), but
            useMemo only recalculates when N changes — not when "unrelated
            state" is updated.
          </Text>
        </View>
      </View>

      {/* ---- Section 4: useCallback ---- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. useCallback</Text>
        <Text style={styles.note}>
          Stabilizes function references so memo'd children don't re-render.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Callback counter: {callbackCount}
          </Text>
          <Pressable
            style={styles.button}
            onPress={() => setParentCount((c) => c + 1)}>
            <Text style={styles.buttonText}>
              Re-render parent ({parentCount})
            </Text>
          </Pressable>

          <Text style={styles.childHeader}>
            Both wrapped in React.memo:
          </Text>
          <CallbackChild
            label="Unstable callback"
            onPress={unstableCallback}
          />
          <CallbackChild label="Stable callback" onPress={stableCallback} />
          <Text style={styles.explainer}>
            The "unstable" child re-renders because a new function is created
            each render. The "stable" child uses useCallback, so its prop
            reference stays the same and memo skips the re-render.
          </Text>
        </View>
      </View>

      {/* ---- Section 5: Key Prop ---- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. Key Prop Importance</Text>
        <Text style={styles.note}>
          Type something in each input, then shuffle. Watch what happens to the
          text.
        </Text>

        <View style={styles.card}>
          <Pressable style={styles.button} onPress={shuffleItems}>
            <Text style={styles.buttonText}>Shuffle Both Lists</Text>
          </Pressable>

          <Text style={styles.childHeader}>key=index (broken):</Text>
          {indexItems.map((item, index) => (
            <KeyDemoItem key={index} item={item} />
          ))}

          <Text style={styles.childHeader}>key=id (correct):</Text>
          {idItems.map((item) => (
            <KeyDemoItem key={item.id} item={item} />
          ))}

          <Text style={styles.explainer}>
            With index keys, the text stays in position while labels shuffle
            around it — React reuses the wrong component instances. With id
            keys, text follows its label correctly.
          </Text>
        </View>
      </View>

      {/* ---- Section 6: FlatList Optimization ---- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>6. FlatList Optimization</Text>
        <Text style={styles.note}>
          FlatList only renders items on screen. Below is a 500-item list in a
          fixed-height window.
        </Text>

        <View style={styles.card}>
          <View style={styles.flatListContainer}>
            <FlatList
              data={BIG_LIST}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.flatListItem}>
                  <Text style={styles.flatListText}>{item.title}</Text>
                </View>
              )}
              getItemLayout={(_, index) => ({
                length: 44,
                offset: 44 * index,
                index,
              })}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={5}
            />
          </View>

          <Text style={styles.explainer}>
            Key optimizations applied:{'\n'}
            - getItemLayout: skips measurement, enables fast scroll-to{'\n'}
            - initialNumToRender: 10 (only renders 10 items at mount){'\n'}
            - maxToRenderPerBatch: 10 (renders 10 items per frame){'\n'}
            - windowSize: 5 (keeps 5 screens worth of items in memory)
          </Text>
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
    marginTop: 8,
  },
  button: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  buttonSecondary: {
    backgroundColor: '#6b7280',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  childHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginTop: 12,
    marginBottom: 8,
  },
  childBox: {
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  childBoxMemo: {
    backgroundColor: '#f0fdf4',
    borderLeftColor: '#22c55e',
  },
  childLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  renderCount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ef4444',
  },
  renderCountMemo: {
    color: '#22c55e',
  },
  callbackChild: {
    backgroundColor: '#f5f3ff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#7c3aed',
  },
  explainer: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 10,
    lineHeight: 18,
  },
  // Section 3: useMemo
  memoResult: {
    fontSize: 32,
    fontWeight: '700',
    color: '#4f46e5',
    textAlign: 'center',
    marginVertical: 8,
  },
  // Section 5: keys
  keyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  keyItemLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    width: 60,
  },
  keyInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: '#1a1a1a',
  },
  // Section 6: FlatList
  flatListContainer: {
    height: 220,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f9fafb',
    marginBottom: 8,
  },
  flatListItem: {
    height: 44,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  flatListText: {
    fontSize: 15,
    color: '#374151',
  },
});
