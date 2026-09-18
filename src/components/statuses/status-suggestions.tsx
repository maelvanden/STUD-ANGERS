import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { STATUS_EXAMPLES } from '@/constants/status-examples';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { tapHaptic } from '@/lib/haptics';
import type { StatusCategory } from '@/types/status';

type Props = {
  category: StatusCategory;
  onSelect: (example: string) => void;
};

export function StatusSuggestions({ category, onSelect }: Props) {
  const theme = useTheme();
  const examples = STATUS_EXAMPLES[category];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.wrap}>
      {examples.map((example) => (
        <Pressable
          key={example}
          onPress={() => {
            tapHaptic();
            onSelect(example);
          }}
          style={[styles.chip, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          <ThemedText type="small" numberOfLines={1} style={styles.chipText}>
            {example}
          </ThemedText>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  chip: {
    borderWidth: 1,
    borderRadius: Spacing.five,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    maxWidth: 260,
  },
  chipText: {
    flexShrink: 1,
  },
});
