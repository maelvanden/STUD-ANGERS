import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet } from 'react-native';

import { PrimaryButton } from '@/components/form/primary-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { STATUS_CATEGORIES } from '@/constants/status-categories';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/hooks/use-theme';
import { formatRelativeTime } from '@/lib/time-format';
import type { Status } from '@/types/status';

type Props = {
  status: Status;
};

export function StatusCard({ status }: Props) {
  const theme = useTheme();
  const { profile } = useAuth();
  const category = STATUS_CATEGORIES.find((item) => item.id === status.category);

  function handleInterested() {
    if (!profile) return;
    router.push(`/chat/${status.id}?authorId=${status.authorId}&participantId=${profile.id}`);
  }

  return (
    <ThemedView type="backgroundElement" style={[styles.card, { borderColor: theme.border }]}>
      <ThemedView type="backgroundElement" style={styles.headerRow}>
        <ThemedView type="backgroundElement" style={[styles.categoryBadge, { backgroundColor: theme.backgroundSelected }]}>
          <Ionicons name={category?.icon ?? 'chatbubble-outline'} size={12} color={theme.tint} />
          <ThemedText type="small" style={{ color: theme.tint }}>
            {category?.label ?? status.category}
          </ThemedText>
        </ThemedView>
        <ThemedText type="small" themeColor="textSecondary">
          {formatRelativeTime(status.createdAt)}
        </ThemedText>
      </ThemedView>

      <ThemedText>{status.content}</ThemedText>

      <ThemedView type="backgroundElement" style={styles.footerRow}>
        <ThemedText type="small" themeColor="textSecondary">
          {status.authorName} · {status.authorSchool}
        </ThemedText>
        {!status.isMine ? (
          <ThemedView style={styles.ctaWrapper}>
            <PrimaryButton label="Je suis chaud 🔥" onPress={handleInterested} />
          </ThemedView>
        ) : null}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: Spacing.five,
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
  },
  footerRow: {
    gap: Spacing.two,
  },
  ctaWrapper: {
    alignSelf: 'flex-start',
    minWidth: 160,
  },
});
