import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FullScreenLoader } from '@/components/full-screen-loader';
import { CategoryFilter } from '@/components/statuses/category-filter';
import { StatusCard } from '@/components/statuses/status-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useStatuses } from '@/context/statuses-context';
import { useTheme } from '@/hooks/use-theme';
import type { Status, StatusCategory } from '@/types/status';

export default function HomeScreen() {
  const theme = useTheme();
  const { statuses, isLoading } = useStatuses();
  const [category, setCategory] = useState<StatusCategory | null>(null);

  const filteredStatuses = useMemo(
    () => (category ? statuses.filter((status) => status.category === category) : statuses),
    [statuses, category]
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedView style={styles.headerText}>
            <ThemedText type="title" style={styles.title}>
              On fait quoi ce soir ?
            </ThemedText>
            <ThemedText themeColor="textSecondary" type="small">
              Les statuts disparaissent après 12h.
            </ThemedText>
          </ThemedView>
          <Pressable
            onPress={() => router.push('/conversations')}
            hitSlop={12}
            style={[styles.inboxButton, { backgroundColor: theme.backgroundElement }]}>
            <Ionicons name="chatbubbles-outline" size={22} color={theme.tint} />
          </Pressable>
        </ThemedView>

        <ThemedView style={styles.filterRow}>
          <CategoryFilter selected={category} onChange={setCategory} />
        </ThemedView>

        {isLoading ? (
          <FullScreenLoader />
        ) : (
          <FlatList<Status>
            data={filteredStatuses}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <StatusCard status={item} />}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <ThemedText themeColor="textSecondary" style={styles.emptyText}>
                {category
                  ? 'Aucun statut dans cette catégorie pour le moment.'
                  : 'Aucun statut pour le moment. Sois le premier à proposer quelque chose !'}
              </ThemedText>
            }
          />
        )}

        <Pressable
          onPress={() => router.push('/new-status')}
          style={[styles.fab, { backgroundColor: theme.tint }]}>
          <Ionicons name="add" size={28} color={theme.background} />
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  inboxButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
  },
  filterRow: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two,
  },
  list: {
    padding: Spacing.four,
    gap: Spacing.three,
    paddingBottom: Spacing.six,
    flexGrow: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: Spacing.six,
  },
  fab: {
    position: 'absolute',
    right: Spacing.four,
    bottom: Spacing.four,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
});
