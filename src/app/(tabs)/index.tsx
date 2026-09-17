import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StatusCard } from '@/components/statuses/status-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useStatuses } from '@/context/statuses-context';
import { useTheme } from '@/hooks/use-theme';
import type { Status } from '@/types/status';

export default function HomeScreen() {
  const theme = useTheme();
  const { statuses } = useStatuses();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            On fait quoi ce soir ?
          </ThemedText>
          <ThemedText themeColor="textSecondary" type="small">
            Les statuts disparaissent après 12h.
          </ThemedText>
        </ThemedView>

        <FlatList<Status>
          data={statuses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <StatusCard status={item} />}
          contentContainerStyle={styles.list}
        />

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
    paddingBottom: Spacing.six,
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
