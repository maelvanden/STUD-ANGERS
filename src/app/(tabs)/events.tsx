import { useMemo, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EventCard } from '@/components/events/event-card';
import { FullScreenLoader } from '@/components/full-screen-loader';
import { SearchBar } from '@/components/search-bar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useEvents } from '@/hooks/use-events';

export default function EventsScreen() {
  const { events, isLoading } = useEvents();
  const [query, setQuery] = useState('');

  const filteredEvents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return events;
    return events.filter(
      (event) =>
        event.title.toLowerCase().includes(normalizedQuery) ||
        event.location.toLowerCase().includes(normalizedQuery)
    );
  }, [events, query]);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Agenda étudiant
          </ThemedText>
          <ThemedText themeColor="textSecondary" type="small">
            Soirées, concerts et événements sportifs à Angers.
          </ThemedText>
        </ThemedView>

        {isLoading ? (
          <FullScreenLoader />
        ) : (
          <FlatList
            data={filteredEvents}
            keyExtractor={(event) => event.id}
            renderItem={({ item }) => <EventCard event={item} />}
            contentContainerStyle={styles.list}
            ListHeaderComponent={
              <ThemedView style={styles.searchWrapper}>
                <SearchBar value={query} onChangeText={setQuery} placeholder="Chercher un événement..." />
              </ThemedView>
            }
            ListEmptyComponent={
              <ThemedText themeColor="textSecondary" style={styles.emptyText}>
                Aucun événement ne correspond à ta recherche.
              </ThemedText>
            }
          />
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
    gap: 2,
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
  },
  list: {
    padding: Spacing.four,
    gap: Spacing.three,
    flexGrow: 1,
  },
  searchWrapper: {
    marginBottom: Spacing.three,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: Spacing.six,
  },
});
