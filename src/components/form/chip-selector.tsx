import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Chip = {
  id: string;
  label: string;
};

type Props = {
  chips: readonly Chip[];
  selected: readonly string[];
  onToggle: (id: string) => void;
};

export function ChipSelector({ chips, selected, onToggle }: Props) {
  const theme = useTheme();

  return (
    <View style={styles.wrap}>
      {chips.map((chip) => {
        const isSelected = selected.includes(chip.id);
        return (
          <Pressable
            key={chip.id}
            onPress={() => onToggle(chip.id)}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected ? theme.tint : theme.backgroundElement,
                borderColor: isSelected ? theme.tint : theme.border,
              },
            ]}>
            <ThemedText type="small" style={{ color: isSelected ? theme.background : theme.text }}>
              {chip.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    borderWidth: 1,
    borderRadius: Spacing.five,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
});
