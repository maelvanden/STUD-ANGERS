import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useEventParticipants } from '@/hooks/use-event-participants';
import { useTheme } from '@/hooks/use-theme';
import { formatEventDate } from '@/lib/time-format';
import type { StudEvent } from '@/types/event';

type Props = {
  event: StudEvent;
};

export function EventCard({ event }: Props) {
  const theme = useTheme();
  const { participants } = useEventParticipants(event.id);

  return (
    <Pressable onPress={() => router.push(`/event/${event.id}`)}>
      {({ pressed }) => (
        <ThemedView
          type="backgroundElement"
          style={[styles.card, { borderColor: theme.border, opacity: pressed ? 0.85 : 1 }]}>
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

          <ThemedView type="backgroundElement" style={styles.infoRow}>
            <Ionicons name="people-outline" size={14} color={theme.accent} />
            <ThemedText type="small" style={{ color: theme.accent }}>
              {participants.length === 0
                ? 'Sois le premier à participer'
                : `${participants.length} participant${participants.length > 1 ? 's' : ''}`}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      )}
    </Pressable>
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
