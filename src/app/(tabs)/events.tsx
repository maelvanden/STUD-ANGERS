import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EventCard } from '@/components/events/event-card';
import { FullScreenLoader } from '@/components/full-screen-loader';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useEvents } from '@/hooks/use-events';

export default function EventsScreen() {
  const { events, isLoading } = useEvents();

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
            data={events}
            keyExtractor={(event) => event.id}
            renderItem={({ item }) => <EventCard event={item} />}
            contentContainerStyle={styles.list}
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
  },
});
