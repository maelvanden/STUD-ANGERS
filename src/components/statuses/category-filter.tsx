import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { STATUS_CATEGORIES } from '@/constants/status-categories';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { selectionHaptic } from '@/lib/haptics';
import type { StatusCategory } from '@/types/status';

type Props = {
  selected: StatusCategory | null;
  onChange: (category: StatusCategory | null) => void;
};

const OPTIONS: { id: StatusCategory | null; label: string }[] = [
  { id: null, label: 'Tous' },
  ...STATUS_CATEGORIES.map((category) => ({ id: category.id, label: category.label })),
];

export function CategoryFilter({ selected, onChange }: Props) {
  const theme = useTheme();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.wrap}>
      {OPTIONS.map((option) => {
        const isSelected = option.id === selected;
        return (
          <Pressable
            key={option.label}
            onPress={() => {
              selectionHaptic();
              onChange(option.id);
            }}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected ? theme.tint : theme.backgroundElement,
                borderColor: isSelected ? theme.tint : theme.border,
              },
            ]}>
            <ThemedText type="small" style={{ color: isSelected ? theme.background : theme.text }}>
              {option.label}
            </ThemedText>
          </Pressable>
        );
      })}
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
  },
});
