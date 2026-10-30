import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { STATUS_CATEGORIES } from '@/constants/status-categories';
import type { StatusExample } from '@/constants/status-examples';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { tapHaptic } from '@/lib/haptics';

type Props = {
  example: StatusExample;
};

export function ExampleStatusCard({ example }: Props) {
  const theme = useTheme();
  const category = STATUS_CATEGORIES.find((item) => item.id === example.category);

  function handlePress() {
    tapHaptic();
    router.push(`/new-status?category=${example.category}&content=${encodeURIComponent(example.content)}`);
  }

  return (
    <Pressable onPress={handlePress}>
      <ThemedView type="backgroundElement" style={[styles.card, { borderColor: theme.border, borderStyle: 'dashed' }]}>
        <ThemedView type="backgroundElement" style={styles.headerRow}>
          <ThemedView type="backgroundElement" style={[styles.categoryBadge, { backgroundColor: theme.backgroundSelected }]}>
            <Ionicons name={category?.icon ?? 'chatbubble-outline'} size={12} color={theme.tint} />
            <ThemedText type="small" style={{ color: theme.tint }}>
              {category?.label ?? example.category}
            </ThemedText>
          </ThemedView>
          <ThemedView type="backgroundElement" style={[styles.exampleBadge, { borderColor: theme.border }]}>
            <ThemedText type="small" themeColor="textSecondary">
              Exemple
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedText>{example.content}</ThemedText>

        <ThemedView type="backgroundElement" style={styles.footerRow}>
          <ThemedText type="small" themeColor="textSecondary">
            {example.authorName} · {example.authorSchool}
          </ThemedText>
          <ThemedView type="backgroundElement" style={styles.ctaRow}>
            <Ionicons name="add-circle-outline" size={16} color={theme.tint} />
            <ThemedText type="small" style={{ color: theme.tint }}>
              Publier un statut comme ça
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </Pressable>
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
  exampleBadge: {
    borderWidth: 1,
    borderRadius: Spacing.five,
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
  },
  footerRow: {
    gap: Spacing.two,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
