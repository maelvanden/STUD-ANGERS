import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { FullScreenLoader } from '@/components/full-screen-loader';
import { PrimaryButton } from '@/components/form/primary-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useEventParticipants } from '@/hooks/use-event-participants';
import { useEvents } from '@/hooks/use-events';
import { useTheme } from '@/hooks/use-theme';
import { cancelEventReminder, scheduleEventReminder } from '@/lib/event-reminders';
import { errorHaptic, successHaptic } from '@/lib/haptics';
import { formatEventDate } from '@/lib/time-format';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { events, isLoading: isLoadingEvents } = useEvents();
  const { participants, isLoading: isLoadingParticipants, isParticipating, join, leave } = useEventParticipants(id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const event = events.find((item) => item.id === id);

  if (isLoadingEvents) {
    return <FullScreenLoader />;
  }

  if (!event) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.notFound}>Événement introuvable.</ThemedText>
      </ThemedView>
    );
  }

  async function handleToggle() {
    if (!event) return;
    setIsSubmitting(true);
    setError(null);
    const result = isParticipating ? await leave() : await join();
    setIsSubmitting(false);

    if (!result.success) {
      errorHaptic();
      setError(result.error);
      return;
    }
    if (!isParticipating) {
      successHaptic();
      await scheduleEventReminder(event.id, event.title, event.date);
    } else {
      await cancelEventReminder(event.id);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title" style={styles.name}>
          {event.title}
        </ThemedText>

        <ThemedView type="backgroundElement" style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={18} color={theme.tint} />
          <ThemedText type="small">{formatEventDate(event.date)}</ThemedText>
        </ThemedView>

        <ThemedView type="backgroundElement" style={styles.infoRow}>
          <Ionicons name="location-outline" size={18} color={theme.textSecondary} />
          <ThemedText type="small">{event.location}</ThemedText>
        </ThemedView>

        {event.description ? <ThemedText themeColor="textSecondary">{event.description}</ThemedText> : null}

        <PrimaryButton
          label={isParticipating ? 'Je ne participe plus' : 'Je participe \u{1F389}'}
          onPress={handleToggle}
          loading={isSubmitting}
          variant={isParticipating ? 'ghost' : 'primary'}
        />

        {error ? (
          <ThemedText type="small" style={{ color: theme.danger }}>
            {error}
          </ThemedText>
        ) : null}

        <ThemedView style={styles.participantsHeader}>
          <Ionicons name="people-outline" size={18} color={theme.accent} />
          <ThemedText type="smallBold">
            {participants.length === 0
              ? 'Aucun participant pour le moment'
              : `${participants.length} participant${participants.length > 1 ? 's' : ''}`}
          </ThemedText>
        </ThemedView>

        {isLoadingParticipants ? (
          <FullScreenLoader />
        ) : (
          <ThemedView style={styles.participantsList}>
            {participants.map((participant) => (
              <ThemedView key={participant.userId} type="backgroundElement" style={styles.participantRow}>
                <ThemedView type="backgroundSelected" style={styles.participantAvatar}>
                  <Ionicons name="person" size={16} color={theme.tint} />
                </ThemedView>
                <ThemedView type="backgroundElement" style={styles.participantInfo}>
                  <ThemedText type="small">{participant.name}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {participant.school}
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            ))}
          </ThemedView>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  notFound: {
    padding: Spacing.four,
  },
  name: {
    fontSize: 26,
    lineHeight: 32,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  participantsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  participantsList: {
    gap: Spacing.two,
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderRadius: Spacing.three,
    padding: Spacing.two,
  },
  participantAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  participantInfo: {
    gap: 2,
  },
});
