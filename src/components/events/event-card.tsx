import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatEventDate } from '@/lib/time-format';
import type { StudEvent } from '@/types/event';

type Props = {
  event: StudEvent;
};

export function EventCard({ event }: Props) {
  const theme = useTheme();

  return (
    <ThemedView type="backgroundElement" style={[styles.card, { borderColor: theme.border }]}>
      <ThemedText type="smallBold" style={styles.title}>
        {event.title}
      </ThemedText>

      <ThemedView type="backgroundElement" style={styles.infoRow}>
        <Ionicons name="calendar-outline" size={14} color={theme.tint} />
        <ThemedText type="small" style={{ color: theme.tint }}>
          {formatEventDate(event.date)}
        </ThemedText>
      </ThemedView>

      <ThemedView type="backgroundElement" style={styles.infoRow}>
        <Ionicons name="location-outline" size={14} color={theme.textSecondary} />
        <ThemedText type="small" themeColor="textSecondary">
          {event.location}
        </ThemedText>
      </ThemedView>

      {event.description ? <ThemedText type="small">{event.description}</ThemedText> : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  title: {
    fontSize: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
});
